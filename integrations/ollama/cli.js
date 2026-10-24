#!/usr/bin/env node
"use strict";

/**
 * Minimal ECC-to-Ollama bridge.
 * Uses only Node.js built-ins; model weights remain managed by Ollama.
 */

const BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const CHAT_MODEL = process.env.OLLAMA_MODEL || "qwen2.5-coder:7b";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
const TIMEOUT_MS = Number.parseInt(process.env.OLLAMA_TIMEOUT_MS || "120000", 10);

async function request(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "content-type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!response.ok) {
      throw new Error(`Ollama API returned HTTP ${response.status}: ${JSON.stringify(data)}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function usage() {
  console.log(`ECC + Ollama local bridge

Usage:
  node integrations/ollama/cli.js health
  node integrations/ollama/cli.js models
  node integrations/ollama/cli.js chat "your prompt"
  node integrations/ollama/cli.js embed "text to embed"

Environment:
  OLLAMA_BASE_URL     default: http://127.0.0.1:11434
  OLLAMA_MODEL        default: qwen2.5-coder:7b
  OLLAMA_EMBED_MODEL  default: nomic-embed-text
  OLLAMA_TIMEOUT_MS   default: 120000
`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    usage();
    return;
  }

  if (command === "health") {
    const data = await request("/api/tags");
    console.log(JSON.stringify({ ok: true, endpoint: BASE_URL, installedModels: data.models?.length ?? 0 }, null, 2));
    return;
  }

  if (command === "models") {
    const data = await request("/api/tags");
    console.log(JSON.stringify((data.models || []).map(model => ({
      name: model.name,
      size: model.size,
      modified_at: model.modified_at,
      details: model.details,
    })), null, 2));
    return;
  }

  if (command === "chat") {
    const prompt = args.join(" ").trim();
    if (!prompt) throw new Error('chat requires a prompt, e.g. chat "Explain this code".');
    const data = await request("/api/chat", {
      model: CHAT_MODEL,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    console.log(data.message?.content || "");
    return;
  }

  if (command === "embed") {
    const input = args.join(" ").trim();
    if (!input) throw new Error('embed requires text, e.g. embed "hello world".');
    const data = await request("/api/embed", { model: EMBED_MODEL, input });
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  usage();
  process.exitCode = 2;
}

main().catch(error => {
  const aborted = error && error.name === "AbortError";
  console.error(`ECC + Ollama: ${aborted ? `request timed out after ${TIMEOUT_MS} ms` : error.message}`);
  process.exitCode = 1;
});
