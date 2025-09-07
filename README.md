# 🎨 Prototype for Neon Canvanies: Agentic Art Generation on the Decentralized Cloud 

## 1. The Problem: The Creative Bottleneck

Digital art creation has a high barrier to entry. While many people have creative ideas, turning a simple sketch into a polished, high-quality piece of art requires technical skill, expensive software, and significant time. Furthermore, existing AI art tools often impose restrictive guardrails, operate as black boxes, and offer limited flexibility, stifling true creative freedom.

## 2. The Solution: Democratizing Digital Art with Agentic AI

**Neon Canvanies** is a web-based drawing application that bridges the gap between imagination and creation. It provides an intuitive canvas for users to sketch their ideas and leverages a suite of autonomous AI agents, powered by Google's Gemini model, to transform those sketches into stunning, production-quality artwork.

Our solution is built on two core principles:
*   **Creative Freedom**: We use powerful generative AI to give users maximum creative control. Users can select from predefined styles, write their own custom prompts with the "Dream-Mode," and even use an AI assistant to refine and enhance their creative ideas.
*   **Decentralized Integration**: The application includes a non-custodial wallet integration for the **BlockDAG (BDAG) Testnet** using the Thirdweb SDK. This feature allows users to connect their MetaMask wallet, view their BDAG balance, and lays the groundwork for future decentralized features like NFT minting or token-gated access.

---

## 3. Innovative Features & Architecture

Neon Canvanies is more than just a drawing app; it's an intelligent creative partner. Our architecture is designed around a collection of specialized, agentic AI flows that work together to bring a user's vision to life.

### Key Features:

*   **Intuitive Drawing Toolkit**: A fully-featured canvas with essential tools to capture your ideas, including a paintbrush, eraser, color picker, and controls for brush size and opacity. You can also import existing images to edit or export your final creations.
*   **Agentic AI Generation**: At the heart of our system is an AI flow that intelligently interprets user sketches and prompts to generate high-quality images. It can operate in two modes:
    *   **AI Styles**: Select from curated styles (Cyberpunk, Anime, Fantasy, Chibi, Realistic) to instantly transform your sketch.
    *   **Dream-Mode**: Describe a unique vision with a custom text prompt, giving you complete control over the output. The AI is instructed to use the drawing for composition but prioritize the theme of your prompt.
*   **AI-Powered Prompt Refinement**: A dedicated AI agent helps you write better prompts. It can take a simple idea and flesh it out into a more descriptive and evocative prompt, maximizing the quality of the generated art.
*   **BlockDAG Wallet Integration**: Securely connect your MetaMask wallet to the BlockDAG Testnet. The interface displays your wallet address and BDAG balance, with options to connect, disconnect, and toggle balance visibility.

### User Onboarding Flow:

1.  **Welcome**: The user is greeted with a welcome screen explaining the core features.
2.  **Sketch**: The user draws a basic sketch on the canvas.
3.  **Choose a Path**:
    *   **AI Styles**: Select a predefined style (e.g., "Cyberpunk").
    *   **Dream-Mode**: Open the prompt editor to describe a unique vision.
    *   **Refine Prompt**: Use the AI assistant to improve your custom prompt.
4.  **Generate**: The frontend sends the request to the backend Gemini-powered flow.
5.  **Refine & Export**: The user can further edit the drawing or the generated image and export their final masterpiece.
6.  **Connect Wallet**: The user can connect their MetaMask wallet at any time via the header to interact with BlockDAG testnet features.

### Architecture Diagram:

Our application uses a modern web stack with a Next.js frontend and a Genkit backend that orchestrates calls to the Google Gemini model.

<img width="512" height="279" alt="image" src="https://github.com/user-attachments/assets/09b5760c-bc68-4ae1-822a-df35b5d10a78" />


```
+-------------------+      +---------------------------------+      +------------------------+
|   User Browser    |----->|         Next.js Server          |----->|   Google Gemini API    |
| (React Frontend)  |      |      (Genkit AI Flows)          |      |                        |
+-------------------+      +---------------------------------+      +------------------------+
        |                                    |
        | 3. Thirdweb SDK                    |
        | Connects to                        |
        v                                    |
+-------------------+                        |
|  BlockDAG Network |                        |
|   (via MetaMask)  |                        |
+-------------------+                        |
```
* **Frontend**: A responsive Next.js application with React, ShadCN components, and Tailwind CSS.
* **Backend AI Flows**: We use Genkit, an open-source AI framework, to define our AI logic. These server-side flows handle prompt construction, interact with the Gemini API for image generation and prompt refinement, and return the results to the client.
* **Wallet Connection**: The frontend integrates the Thirdweb SDK to connect to users' MetaMask wallets and interact with the BlockDAG Testnet. This is a client-side integration and does not require a backend service.

This architecture ensures a fast, secure, and scalable application, with a clear separation between the user interface and the powerful generative AI capabilities.
```