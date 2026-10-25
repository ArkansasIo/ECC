# ECC Local API Setup Guide

## 1. Clone and open ECC

```powershell
git clone https://github.com/ArkansasIo/ECC.git
cd ECC
code .
```

If ECC is already cloned, open the existing directory instead of cloning a second copy.

## 2. Create the API development branch

```powershell
git fetch origin
git checkout ecc-api-roadmap
```

If you want to work directly from your local main branch instead, create a separate feature branch before making implementation changes.

## 3. Inspect the repository first

From the ECC root:

```powershell
git status
git branch --show-current
git log -5 --oneline
```

Identify the existing package manager, workspace configuration, agent registry, skill directories, hooks, memory implementation, and AgentShield/security controls before wiring the API into them.

## 4. API development sequence

The recommended implementation order is:

```text
API contract
  -> domain models
  -> agent registry adapter
  -> orchestrator
  -> tool permissions
  -> persistence
  -> live events
  -> VS Code client
  -> Git/GitHub workflow
```

Do not bypass existing ECC security controls just to make the first API prototype work.

## 5. Local services

The eventual development environment should contain:

- ECC API server
- ECC worker/agent runtime
- PostgreSQL
- Optional Redis/event queue
- Local sandbox/tool runner
- VS Code extension

For an initial prototype, the API can run without the complete production stack, using in-memory task state. PostgreSQL and the worker should be introduced before production use.

## 6. Example task

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "project_id": "local-project",
  "instruction": "Inspect the Rust project, identify missing modules, implement them, and run the test suite.",
  "agents": ["planner", "rust", "qa"],
  "approval_required": true,
  "max_steps": 100
}
```

The API should return a task identifier and a status that can be followed through the event stream.

## 7. Development loop

```text
VS Code
  |
  v
ECC API
  |
  v
Task + Policy
  |
  v
Planner
  |
  +--> Rust Agent
  +--> QA Agent
  +--> Documentation Agent
  |
  v
Workspace Tools
  |
  v
Build + Test
  |
  v
Diff Review
  |
  v
Approval
  |
  v
Git Branch / Commit / PR
```

## 8. Safety rules

During development, keep these capabilities disabled unless explicitly authorized:

- unrestricted shell access
- arbitrary filesystem access outside the project workspace
- unrestricted network access
- secret retrieval
- destructive Git operations
- automatic production deployment
- automatic Git push

Every tool invocation should have an agent identity, project context, capability check, and audit event.

## 9. VS Code target

The VS Code extension should eventually provide:

- ECC task input
- active task status
- agent list
- live agent events
- tool-call history
- generated diff
- test/build output
- approval requests
- commit/PR controls

## 10. First verification checklist

```text
[ ] ECC opens successfully in VS Code
[ ] Existing tests/build still pass
[ ] API starts
[ ] /api/v1/health returns healthy
[ ] Existing agent registry is discoverable
[ ] Read-only project task succeeds
[ ] Write task is sandboxed
[ ] Tests execute through the approved tool runtime
[ ] Diff is generated
[ ] Approval gate blocks sensitive Git operations
[ ] Audit events are persisted
```

## 11. Next implementation target

After the roadmap branch is available locally, implement the API against the existing ECC agent and skill registry. The API should adapt existing functionality rather than duplicate it. Once that adapter works, add persistent tasks and live events before building the VS Code extension.
