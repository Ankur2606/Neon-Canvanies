
import os
import io
import base64
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, AutoPipelineForText2Image

# --- Configuration and Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-service")

MODEL_ID = os.environ.get("MODEL_ID")
HF_TOKEN = os.environ.get("HF_TOKEN")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

if not MODEL_ID:
    raise ValueError("MODEL_ID environment variable is not set.")

# --- Global Variables ---
# These will be loaded on startup
pipe = None
model = None
tokenizer = None
model_type = None

# --- Pydantic Models for API Requests ---
class GenerationRequest(BaseModel):
    prompt: str
    init_image_b64: Optional[str] = None # Base64 encoded image for img2img or visual models
    negative_prompt: Optional[str] = None
    # Common diffusion parameters
    height: Optional[int] = 512
    width: Optional[int] = 512
    num_inference_steps: Optional[int] = 20
    guidance_scale: Optional[float] = 7.5
    strength: Optional[float] = 0.8 # For img2img
    seed: Optional[int] = None


class GenerationResponse(BaseModel):
    image_b64: str # Base64 encoded result image

# --- FastAPI App Initialization ---
app = FastAPI(title="AI Image Generation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Utility Functions ---
def image_to_base64_png(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def base64_to_pil(b64_str: str) -> Image.Image:
    try:
        decoded_bytes = base64.b64decode(b64_str)
        return Image.open(io.BytesIO(decoded_bytes)).convert("RGB")
    except Exception as e:
        logger.exception("Failed to decode base64 image string.")
        raise HTTPException(status_code=400, detail="Invalid base64 image format.") from e


# --- Model Loading (Startup Event) ---
@app.on_event("startup")
def startup_event():
    global pipe, model, tokenizer, model_type
    logger.info(f"Starting up. Device: {DEVICE}. Loading model: {MODEL_ID}...")

    load_kwargs = {"use_auth_token": HF_TOKEN if HF_TOKEN else None}
    if DEVICE == "cuda":
        load_kwargs["torch_dtype"] = torch.float16

    try:
        # Heuristic to determine model type based on ID
        if "qwen" in MODEL_ID.lower():
            logger.info("Detected Qwen-VL model type.")
            model_type = "qwen"
            model = AutoModelForCausalLM.from_pretrained(MODEL_ID, device_map=DEVICE, trust_remote_code=True, **load_kwargs).eval()
            tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
            logger.info("Qwen-VL model and tokenizer loaded.")
        elif "chroma" in MODEL_ID.lower():
             logger.info("Detected text-to-image model type (Chroma).")
             model_type = "txt2img"
             pipe = AutoPipelineForText2Image.from_pretrained(MODEL_ID, **load_kwargs)
             pipe = pipe.to(DEVICE)
             logger.info("Text-to-Image pipeline loaded.")
        else: # Default to img2img for sketch-to-image, etc.
            logger.info("Assuming img2img/sketch-to-image model type.")
            model_type = "img2img"
            pipe = StableDiffusionImg2ImgPipeline.from_pretrained(MODEL_ID, **load_kwargs)
            pipe = pipe.to(DEVICE)
            logger.info("Image-to-Image pipeline loaded.")

        if hasattr(pipe, "enable_xformers_memory_efficient_attention"):
            pipe.enable_xformers_memory_efficient_attention()
            logger.info("Enabled xformers memory efficient attention.")

    except Exception as e:
        logger.exception("Fatal error during model loading.")
        raise RuntimeError("Failed to load model on startup.") from e

# --- API Endpoints ---
@app.get("/health")
def health():
    return {"status": "ok", "device": DEVICE, "model_id": MODEL_ID, "model_type": model_type}

@app.post("/generate", response_model=GenerationResponse)
def generate(req: GenerationRequest):
    if model_type not in ["qwen", "txt2img", "img2img"]:
        raise HTTPException(status_code=503, detail="Model not loaded or invalid model type.")

    generator = None
    if req.seed is not None:
        generator = torch.Generator(device=DEVICE).manual_seed(int(req.seed))

    try:
        image = None
        # --- QWEN-VL Logic ---
        if model_type == "qwen":
            if not req.init_image_b64:
                raise HTTPException(status_code=400, detail="Qwen model requires an initial image (init_image_b64).")
            
            pil_image = base64_to_pil(req.init_image_b64)
            query = tokenizer.from_list_format([
                {'image': pil_image},
                {'text': req.prompt},
            ])
            with torch.no_grad():
                response, _ = model.chat(tokenizer, query=query, history=None)
            # Qwen does not directly output an image, it outputs text.
            # This is a placeholder for how one might handle it.
            # In a real scenario, the response would need parsing.
            logger.warning("Qwen model generated text response, not an image. This is a limitation of the current endpoint for this model.")
            raise HTTPException(status_code=501, detail="Image generation for Qwen not implemented, only text response.")

        # --- Text-to-Image Logic ---
        elif model_type == "txt2img":
            with torch.cuda.amp.autocast():
                result = pipe(
                    prompt=req.prompt,
                    negative_prompt=req.negative_prompt,
                    height=req.height,
                    width=req.width,
                    num_inference_steps=req.num_inference_steps,
                    guidance_scale=req.guidance_scale,
                    generator=generator,
                )
                image = result.images[0]

        # --- Image-to-Image Logic ---
        elif model_type == "img2img":
            if not req.init_image_b64:
                raise HTTPException(status_code=400, detail="Image-to-Image models require an initial image (init_image_b64).")
            
            init_image = base64_to_pil(req.init_image_b64)
            with torch.cuda.amp.autocast():
                result = pipe(
                    prompt=req.prompt,
                    image=init_image,
                    strength=req.strength,
                    num_inference_steps=req.num_inference_steps,
                    guidance_scale=req.guidance_scale,
                    negative_prompt=req.negative_prompt,
                    generator=generator
                )
                image = result.images[0]

        if image:
            return GenerationResponse(image_b64=image_to_base64_png(image))
        else:
            raise HTTPException(status_code=500, detail="Image could not be generated.")

    except Exception as e:
        logger.exception("An error occurred during image generation.")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
