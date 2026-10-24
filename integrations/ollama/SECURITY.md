# Security Notes — ECC + Ollama

- Bind local Ollama to loopback; do not expose its API publicly without a secure gateway.
- Never store API keys, secrets, model credentials, or user data in committed configuration.
- Treat model output as untrusted data; it must not execute commands or change system configuration automatically.
- Apply timeouts and limit prompt/data size in production services.
- Models downloaded from registries may have separate licenses and usage conditions.
- Use official Ollama distributions and verify source, release, and checksum according to your deployment policy.
- Do not claim sandboxing merely because inference is local.
