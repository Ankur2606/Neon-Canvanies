# 🎨 Prototype for Neon Canvanies: Agentic Art Generation on the Decentralized Cloud 

## 1. The Problem: The Creative Bottleneck

Digital art creation has a high barrier to entry. While many people have creative ideas, turning a simple sketch into a polished, high-quality piece of art requires technical skill, expensive software, and significant time. Furthermore, existing AI art tools often impose restrictive guardrails, operate as black boxes, and offer limited flexibility, stifling true creative freedom.

## 2. The Solution: Democratizing Digital Art with Agentic AI

**Neon Canvanies** is a web-based drawing application that bridges the gap between imagination and creation. It provides an intuitive canvas for users to sketch their ideas and leverages a suite of autonomous AI agents to transform those sketches into stunning, production-quality artwork.

Our solution is built on two core principles:
*   **Creative Freedom**: We use open-source AI models, freeing our users from the creative constraints and potential censorship of closed-source platforms. Users can select from predefined styles or write their own prompts for limitless possibilities.
*   **Decentralized Infrastructure**: To power this vision, we are building on the **Akash Network**. This allows us to run our AI models and application logic on a censorship-resistant, cost-effective, and globally distributed cloud, ensuring the platform remains open and accessible to all.

---

## 3. Innovative Features & Architecture

Neon Canvanies is more than just a drawing app; it's an intelligent creative partner. Our architecture is designed around a collection of specialized, agentic tools that work together to bring a user's vision to life.

### Key Features:

*   **Intuitive Drawing Toolkit**: A fully-featured canvas with essential tools to capture your ideas, including a paintbrush, eraser, color picker, and controls for brush size and opacity. You can also import existing images to edit or export your final creations.
*   **Agentic AI Orchestration**: At the heart of our system is an orchestrator agent that assists users by refining their prompts, answering questions, and autonomously delegating tasks to the appropriate specialist agent.
*   **Specialized Art Agents**:
    *   **Sketch-to-Image Agent**: Utilizes the `gokaygokay/Sketch-to-Image-Kontext-Dev-LoRA` model to interpret the user's drawing and generate a foundational image.
    *   **Text-to-Image Agent**: Employs the `lodestones/ChromaV2` model to create new artwork from a user's text prompt, offering unparalleled flexibility.
    *   **Image Editing Agent**: Leverages `Qwen/Qwen-Image-Edit` to apply stylistic transformations or user-defined edits to an existing image on the canvas.
*   **Flexible User Control**: Users can either select from curated styles (Cyberpunk, Anime, etc.) or provide their own detailed prompts, giving them full control over the creative process.

### User Onboarding Flow:

1.  **Welcome**: The user is greeted with a welcome screen explaining the core features.
2.  **Sketch**: The user draws a basic sketch on the canvas.
3.  **Choose a Path**:
    *   **AI Styles**: Select a predefined style (e.g., "Cyberpunk").
    *   **Custom Prompt**: Open the prompt editor to describe a unique vision.
    *   **Chat with AI**: Interact with an agent to get prompt suggestions or delegate a task.
4.  **Generate**: The frontend sends the request to the correct AI agent service running on Akash.
5.  **Refine & Export**: The user can further edit the drawing or the generated image and export their final masterpiece.

### Architecture Diagram:

<img width="512" height="279" alt="image" src="https://github.com/user-attachments/assets/09b5760c-bc68-4ae1-822a-df35b5d10a78" />


```
+-------------------+      +-------------------------------------------------+      +--------------------------------+
|   User Browser    |      |         Akash Network (Decentralized Cloud)     |      |   AI Model Service Containers  |
| (Next.js Frontend)|      |                                                 |      |      (Custom Docker Image)     |
+--------+----------+      +---------------------+---------------------------+      +--------------+-----------------+
         |                               (HTTPS) |                                                 |
         |  1. User Draws & Selects AI Task      |                                                 |
         +-------------------------------------> |   Frontend Service (Next.js)                    |
                                                 +---------------------+---------------------------+
                                                                       | 2. API Request
                                                                       | (to specific AI agent)
         +-------------------------------------------------------------+-----------------------------------------------------+
         |                                                             |                                                     |
         v                                                             v                                                     v
+--------+-----------------+                  +------------------------+-----------------+                    +--------------+--------------+
| Sketch-to-Image Service  |                  |  Text-to-Image Service                   |                    | Image Editing Service       |
| (FastAPI + Diffusers)    |                  |  (FastAPI + Diffusers)                   |                    | (FastAPI + Transformers)    |
| Model: gokaygokay/...    |                  |  Model: lodestones/ChromaV2              |                    | Model: Qwen/Qwen-Image-Edit |
+--------------------------+                  +------------------------------------------+                    +-----------------------------+
```

---

## 4. Our Commitment to Decentralization: Using the Akash Network

The Akash Network is fundamental to the ethos and technical viability of Neon Canvanies.

### Why Akash?
*   **Cost-Efficiency**: Running multiple, resource-intensive AI models can be prohibitively expensive on traditional cloud providers. Akash's decentralized marketplace for cloud compute offers significantly lower costs, making our project sustainable.
*   **Censorship Resistance**: By deploying on a permissionless, decentralized network, we ensure that our application and the creative freedom it enables cannot be shut down or controlled by a single entity.
*   **Flexibility & Scalability**: Akash allows us to deploy our custom Docker containers with ease. We can specify the exact hardware requirements (CPU, GPU, RAM) for each of our AI models and accordingly bid then scale our resources up or down based on user demand.

### Our Deployment Plan:

1.  **Containerization**: We define two core services for our deployment: a `frontend` service for our Next.js application and a `triton-server` service to host our AI models. The configuration for our AI service container is defined in the `Dockerfile` and `services/app.py` files.
2.  **Efficient Model Serving with Triton**: Instead of running a separate container for each AI model, we use the **NVIDIA Triton Inference Server**. This is a highly efficient, production-grade solution that allows us to serve all three of our models (`sketch-to-image`, `text-to-image`, `image-editor`) from a single, powerful GPU instance. The Triton container is configured at startup to download all required models directly from Hugging Face.
3.  **SDL Configuration**: We use a `deploy.yaml` file with Akash's Stack Definition Language (SDL) to define our entire deployment. This file specifies:
    *   The `frontend` service running our Next.js app.
    *   The `triton-server` service, which uses a standard NVIDIA container image. Its startup `command` handles the setup and downloads all the necessary models.
    *   **Resource Requirements**: The SDL defines compute profiles, including a powerful `ai_models_gpu` profile that requests a high-performance NVIDIA A100 GPU, along with sufficient CPU, RAM, and storage to handle all models.
    *   **Secure Networking**: The `frontend` is exposed globally so users can access the app. The `triton-server` is only exposed internally to the `frontend` service, ensuring secure and direct communication between the application and the AI models without exposing the model server to the public internet.
4.  **Decentralized Deployment**: By submitting our `deploy.yaml` to the Akash marketplace, we find a provider on the decentralized network that meets our specific hardware and pricing requirements. This ensures our application runs on a globally distributed and resilient infrastructure.

By building on Akash and using professional-grade tools like Triton, we are not only creating an innovative application but also demonstrating a viable, cost-effective path for deploying complex AI workloads on the decentralized cloud.
