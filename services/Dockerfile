# Use a GPU-ready runtime with PyTorch and CUDA preinstalled
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install essential system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends git ffmpeg libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the application file
COPY app.py /app/app.py

# Install Python dependencies
# We pin versions for stability but this can be adjusted.
RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
    "fastapi" \
    "uvicorn[standard]" \
    "pillow" \
    "transformers==4.33.0" \
    "diffusers>=0.21.4" \
    "accelerate" \
    "safetensors" \
    "huggingface-hub" \
    "torch" \
    "einops" \
    "torchvision" \
    "sentencepiece" \
    "protobuf>=3.20.0"

# Expose the port the FastAPI server will run on
EXPOSE 8080

# Set default environment variables (can be overridden at runtime)
ENV HF_TOKEN=""
ENV MODEL_ID="runwayml/stable-diffusion-v1-5"
ENV PORT=8080
ENV DEVICE="cuda"

# Command to run the FastAPI server
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
