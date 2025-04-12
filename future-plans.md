# Project Plan: Multilingual REALITY Livestreaming Bot

## Core Architecture

Low-Cost Hybrid Model: PC (Controller + REALITY Environment) + 2 Dedicated Android Phones (Processing) + Cloud AI Services (Core Intelligence)

## Components & Roles

1.  **PC (Primary Controller & REALITY Environment):**
    *   **OS:** User's primary OS (Windows/Linux/Mac).
    *   **Core Script:** Python 3.x, utilizing the `LangChain` framework for orchestration, memory management, and AI interaction chains.
    *   **GUI Interface:** Python-based dashboard using `PyQt5` or `Tkinter` for system monitoring and control:
        *   Real-time status monitoring of all components
        *   Audio level visualization and control
        *   Conversation history display
        *   Manual override controls
        *   System configuration panel
    *   **REALITY Environment:** Android Emulator running:
        *   REALITY App (Source of collaborator audio output, viewer text comments display).
        *   `ADBKeyboard` App (Target for bot's text input).
    *   **Audio Routing:** `Voicemeeter` (or similar) to capture emulator audio output and manage local TTS playback routing.
    *   **RAG Storage:** Local `ChromaDB` instance for storing and querying conversation history/memory vectors.
    *   **AI API Client:** `openai` Python library configured to interact with:
        *   Cloud LLM & Embedding services (via OpenAI-compatible endpoint, e.g., Gemini backend).
        *   Local ASR server on Phone 1 (via its IP address and OpenAI-compatible API).
        *   Local TTS server on Phone 2 (via its IP address and OpenAI-compatible API).
    *   **ADB Control:** Python `subprocess` module to send broadcast commands to `ADBKeyboard` running within the emulator.
    *   **Viewer Comment Reading:** WebSocket connection to REALITY App for direct streaming of viewer text comments.

2.  **Phone 1 (ASR Server):**
    *   **Hardware:** Dedicated Android phone.
    *   **Environment:** `chroot` Linux environment (e.g., Debian/Ubuntu ARM).
    *   **ASR Engine:** `faster-whisper` (using `tiny` or `base` multilingual models).
    *   **Server:** Python web server (e.g., using `FastAPI` or `Flask`) running within the chroot environment, exposing an OpenAI-compatible `/v1/audio/transcriptions` API endpoint.

3.  **Phone 2 (TTS Server):**
    *   **Hardware:** Dedicated Android phone.
    *   **Environment:** `chroot` Linux environment.
    *   **TTS Engine:** `MeloTTS`, utilizing **custom-trained** EN/ZH/JA voice models.
    *   **Server:** Python web server (e.g., using `FastAPI` or `Flask`) running within the chroot environment, exposing an OpenAI-compatible `/v1/audio/speech` API endpoint.

4.  **Cloud Services:**
    *   **AI Models:** Provides LLM and Embedding capabilities, accessed via an OpenAI-compatible API endpoint (e.g., Google Gemini backend configured for compatibility) using the `openai` library from the Python script.

## Workflow

1.  **Input:**
    *   **Voice:** Collaborators speak within the REALITY App running in the PC's emulator.
    *   **Text:** Viewers post text comments in the REALITY App.
2.  **Audio Capture:** The emulator outputs audio, which is captured by `Voicemeeter` on the PC.
3.  **ASR Request:** The Core Script packages the captured audio data and sends an HTTP POST request (using the `openai` library configured for Phone 1's IP) to the **ASR Server on Phone 1**.
4.  **ASR Processing:** Phone 1's server uses `faster-whisper` to transcribe the audio and returns the text via HTTP response to the PC Core Script.
5.  **Viewer Comment Reading:** The PC Core Script reads the latest viewer text comments displayed in the emulator.
6.  **LangChain Processing (PC):**
    *   Receives the ASR transcription text.
    *   Gets the latest viewer text comments (if any).
    *   Calls the **Cloud Embedding API** (via `openai` library configured for the cloud endpoint) to generate a query vector, potentially based on collaborator speech and/or viewer comments.
    *   Queries the local **ChromaDB** using the vector to retrieve relevant RAG context (past memories/facts).
    *   Constructs a complete prompt including ASR text, viewer comments, and RAG context.
    *   Calls the **Cloud LLM API** (via `openai` library configured for the cloud endpoint) with the complete prompt.
    *   Receives the text response from the LLM.
    *   Detects the language of the LLM response (e.g., using `langdetect`).
7.  **TTS Request:** The PC Core Script sends the LLM's text response and the detected language (for model selection) via HTTP POST (using the `openai` library configured for Phone 2's IP) to the **TTS Server on Phone 2**.
8.  **TTS Processing:** Phone 2's server selects the appropriate custom `MeloTTS` model based on the request, generates the audio stream, and returns it via HTTP response.
9.  **Audio Output:** The PC Core Script receives the audio stream and plays it through `Voicemeeter` or `sounddevice` for the user to hear.