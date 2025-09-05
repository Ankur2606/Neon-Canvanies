# Use an official NVIDIA CUDA runtime as a parent image.
# This provides the necessary CUDA drivers for GPU acceleration.
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

# Set the working directory in the container to /app
WORKDIR /app

# Set environment variable to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies required for the application.
# - git and git-lfs are needed for cloning models from Hugging Face.
# - ffmpeg and libsndfile1 are common dependencies for audio/video processing.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    git-lfs \
    ffmpeg \
    libsndfile1 && \
    # Clean up the apt cache to reduce image size
    rm -rf /var/lib/apt/lists/*

# Copy the Python application code into the container at /app
COPY ./services/app.py /app/app.py

# Install Python dependencies using pip.
# We pin minimal versions and use --no-cache-dir to keep the layer small.
RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
    "fastapi" \
    "uvicorn[standard]" \
    "python-multipart" \
    "pillow" \
    "torch" \
    "transformers" \
    "diffusers" \
    "accelerate" \
    "safetensors" \
    "huggingface-hub"

# Expose port 8000 to allow incoming connections to the FastAPI server.
# This matches the port specified in the CMD instruction.
EXPOSE 8000

# Set default environment variables.
# These can be overridden at runtime by the Akash SDL.
ENV HF_TOKEN=""
ENV MODEL_ID="runwayml/stable-diffusion-v1-5"
ENV PORT=8000
ENV DEVICE="cuda"

# Define the command to run the application.
# This starts the Uvicorn server, binding to all interfaces on the specified port.
# Using a single worker is recommended for GPU-based inference.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
