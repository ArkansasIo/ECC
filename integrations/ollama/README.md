# ECC + Ollama Local Runtime

This integration connects ECC workflows to a locally running Ollama server. It does not vendor or silently repackage Ollama's binaries or model weights; install Ollama using its official distribution and download models through the Ollama CLI.

## Architecture

- **Ollama runtime**: local model server and model storage.
- **ECC**: agent skills, engineering workflows, security review, testing and documentation.
- **Bridge CLI**: small Node.js client for health checks, listing models, chat, and embeddings.
- **Model selection**: configured by environment variables; defaults to a locally installed model name and can be overridden per command.

## Requirements

- Node.js 18+
- Ollama installed from the official project: https://ollama.com/download
- A model pulled locally, e.g. `ollama pull qwen2.5-coder:7b` (choose a model that fits your hardware)
- ECC checkout with its existing license and third-party notices retained

## Quick start

```bash
ollama serve
# in another terminal:
ollama pull qwen2.5-coder:7b
node integrations/ollama/cli.js health
node integrations/ollama/cli.js models
node integrations/ollama/cli.js chat "Explain this project's architecture"
```

Defaults:
- Base URL: `http://127.0.0.1:11434`
- Chat model: `qwen2.5-coder:7b`
- Embedding model: `nomic-embed-text`

Override with:
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `OLLAMA_EMBED_MODEL`

## Commands

```
node integrations/ollama/cli.js health
node integrations/ollama/cli.js models
node integrations/ollama/cli.js chat "prompt"
node integrations/ollama/cli.js embed "text"
```

The bridge sends prompts only to the configured Ollama endpoint. Keep the endpoint on localhost unless you have authenticated and encrypted the remote route yourself. Do not expose port 11434 directly to an untrusted network.

## ECC workflow

Use this integration alongside existing ECC skills:
1. Plan the task.
2. Ask the configured local model to draft or analyze.
3. Run tests and static checks independently.
4. Review the result with ECC skills and human judgment.
5. Never interpret a model response as proof that tests passed.

## Licensing and provenance

ECC remains subject to the license in the repository root. Ollama is a separate upstream project with its own license and third-party dependencies. This adapter does not copy Ollama source code, binaries, or model files into ECC. Review Ollama's current licensing and distribution terms at https://github.com/ollama/ollama and the license of each downloaded model before redistribution.
