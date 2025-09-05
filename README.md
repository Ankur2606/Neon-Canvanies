# 🎨 Neon Canvanies: Agentic Art Generation on the Decentralized Cloud


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
*   **Agentic AI Orchestration**: At the heart of our system is an orchestrator agent powered by **Hermes 4**. This agent assists users by refining their prompts, answering questions, and autonomously delegating tasks to the appropriate specialist agent.
*   **Specialized Art Agents**:
    *   **Sketch-to-Image Agent**: Utilizes the `gokaygokay/Sketch-to-Image-Kontext-Dev-LoRA` model to interpret the user's drawing and generate a foundational image.
    *   **Text-to-Image Agent**: Employs the `lodestones/Chroma` model to create new artwork from a user's text prompt, offering unparalleled flexibility.
    *   **Image Editing Agent**: Leverages `Qwen/Qwen-Image-Edit` to apply stylistic transformations or user-defined edits to an existing image on the canvas.
*   **Flexible User Control**: Users can either select from curated styles (Cyberpunk, Anime, etc.) or provide their own detailed prompts, giving them full control over the creative process.

### User Onboarding Flow:

1.  **Welcome**: The user is greeted with a welcome screen explaining the core features.
2.  **Sketch**: The user draws a basic sketch on the canvas.
3.  **Choose a Path**:
    *   **AI Styles**: Select a predefined style (e.g., "Cyberpunk").
    *   **Custom Prompt**: Open the prompt editor to describe a unique vision.
    *   **Chat with AI**: Interact with the Hermes 4 agent to get prompt suggestions or delegate a task.
4.  **Generate**: The orchestrator agent receives the request and routes it to the correct art agent. The AI generates the image.
5.  **Refine & Export**: The user can further edit the drawing or the generated image and export their final masterpiece.

### Architecture Diagram:

```
+-------------------+      +-------------------------+      +------------------------+
|   User Browser    |      |   Akash Network (Cloud) |      |   AI Model Containers  |
| (Next.js Frontend)|      |                         |      |    (Hosted on Akash)   |
+--------+----------+      +------------+------------+      +-----------+------------+
         |                       (HTTPS) |                             |
         |  1. User Draws & Prompts      |                             |
         +-----------------------------> |   Next.js Backend Server  |                             |
                                         +------------+------------+                             |
                                                      | 2. API Request                         |
                                                      |    (Task for Agent)                    |
                                                      v                                        |
                                         +-------------------------+                             |
                                         | Hermes 4 Orchestrator   |                             |
                                         | (Akash Chat API)        |                             |
                                         +------------+------------+                             |
                                                      | 3. Delegates Task                      |
             +----------------------------------------+-----------------------------------------+
             |                                        |                                         |
             v                                        v                                         v
+------------+------------+             +------------+------------+             +------------+------------+
| Sketch-to-Image Agent |             |  Text-to-Image Agent  |             | Image Editing Agent   |
| (gokaygokay/...)      |             |  (lodestones/Chroma)  |             | (Qwen/...)            |
+-----------------------+             +-----------------------+             +-----------------------+
```

---

## 4. Our Commitment to Decentralization: Using the Akash Network

The Akash Network is fundamental to the ethos and technical viability of Neon Canvanies.

### Why Akash?
*   **Cost-Efficiency**: Running multiple, resource-intensive AI models can be prohibitively expensive on traditional cloud providers. Akash's decentralized marketplace for cloud compute offers significantly lower costs, making our project sustainable.
*   **Censorship Resistance**: By deploying on a permissionless, decentralized network, we ensure that our application and the creative freedom it enables cannot be shut down or controlled by a single entity.
*   **Flexibility & Scalability**: Akash allows us to deploy our custom Docker containers with ease. We can specify the exact hardware requirements (CPU, GPU, RAM) for beach of our AI models and accordingly big then scale our resources up or down based on user demand.

### Our Deployment Plan:

1.  **Containerization**: Each component of our backend—the Next.js server, the Hermes 4 orchestrator, and each specialist AI model—will be packaged into its own Docker container.
2.  **SDL Configuration**: We will define our deployment requirements using Akash's Stack Definition Language (SDL). This allows us to specify the resources needed for each container, from lightweight frontend servers to powerful GPU instances for our AI models.
3.  **Decentralized Deployment**: We will deploy our SDL file to the Akash marketplace, which will automatically match our application with providers on the network who meet our specified requirements. This ensures our application is running on a globally distributed and resilient infrastructure.

By building on Akash, we are not only creating an innovative tool but also contributing to the vision of a more open, free, and decentralized internet.
