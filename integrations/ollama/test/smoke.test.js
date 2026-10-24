"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const cli = path.resolve(__dirname, "..", "cli.js");

const help = spawnSync(process.execPath, [cli, "help"], { encoding: "utf8" });
assert.equal(help.status, 0, help.stderr);
assert.match(help.stdout, /OLLAMA_BASE_URL/);
assert.match(help.stdout, /chat/);
console.log("Ollama bridge smoke tests passed.");
