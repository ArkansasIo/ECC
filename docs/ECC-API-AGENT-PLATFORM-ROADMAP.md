# ECC API Agent Platform Roadmap

## Purpose

Turn ECC into an API-driven AI development platform that can coordinate specialized agents, operate on project workspaces, integrate with VS Code and GitHub, and require explicit approval for sensitive operations.

## Architecture

```text
VS Code / ECC CLI / Web UI
            |
            v
       ECC API Gateway
            |
     +------+------+
     |             |
   Auth          Task Store
     |             |
     +------+------+
            |
            v
     ECC Orchestrator
            |
      Project Manager
            |
   +--------+---------+
   |        |         |
 Coding   Research   Game Dev
 Rust     Math       QA / Test
 Security Docs       Git / GitHub
   |        |         |
   +--------+---------+
            |
            v
       Tool Runtime
            |
   Files / Git / Shell / Build
            |
            v
        Test + Review
            |
       Approval Gate
            |
            v
        Commit / PR
```

## Implementation Checklist

### 1. API foundation
- [ ] REST API
- [ ] OpenAPI specification
- [ ] Task creation, status, cancellation, approval
- [ ] Agent discovery and execution
- [ ] Project endpoints
- [ ] Run/event endpoints
- [ ] Health and readiness endpoints

### 2. Existing ECC integration
- [ ] Existing agents
- [ ] Skills
- [ ] Hooks
- [ ] Memory
- [ ] Rules
- [ ] AgentShield/security controls
- [ ] Existing configuration and command system

### 3. Orchestration
- [ ] Project-manager agent
- [ ] Planner
- [ ] Coding agent
- [ ] Rust agent
- [ ] Math agent
- [ ] Research agent
- [ ] Game-development agent
- [ ] QA/testing agent
- [ ] Security agent
- [ ] Documentation agent
- [ ] Git/GitHub agent
- [ ] Agent-to-agent task handoff
- [ ] Retry and failure recovery

### 4. Project workspaces
- [ ] Project registry
- [ ] Per-project workspace isolation
- [ ] File read/write operations
- [ ] Build and test execution
- [ ] Artifact storage
- [ ] Rust/Cargo support
- [ ] TypeScript/Node support
- [ ] Game-project support

### 5. Authentication and authorization
- [ ] User accounts
- [ ] API keys/tokens
- [ ] Roles and RBAC
- [ ] Capability-based agent permissions
- [ ] Tool permissions
- [ ] Approval gates
- [ ] Secret isolation
- [ ] Audit log

Sensitive operations such as destructive filesystem operations, secret access, Git pushes, deployments, and unrestricted network access must not be granted by default.

### 6. Persistent storage
- [ ] PostgreSQL task store
- [ ] Projects
- [ ] Tasks
- [ ] Agent runs
- [ ] Events
- [ ] Conversations
- [ ] Memory
- [ ] Agent configuration
- [ ] Artifact metadata

### 7. Live events
- [ ] WebSocket transport
- [ ] Server-Sent Events transport
- [ ] Task progress events
- [ ] Agent lifecycle events
- [ ] Tool-call events
- [ ] Build/test events
- [ ] Approval-required events
- [ ] Error/completion events

Suggested event types:

```text
task.created
task.planned
agent.started
agent.completed
tool.called
tool.completed
build.started
build.completed
test.started
test.completed
review.completed
approval.required
task.completed
task.failed
task.cancelled
```

### 8. VS Code integration
- [ ] ECC VS Code extension
- [ ] Task submission panel
- [ ] Agent activity panel
- [ ] Live event stream
- [ ] Workspace/file integration
- [ ] Diff viewer
- [ ] Test results
- [ ] Approval UI
- [ ] ECC chat/task interface

### 9. Git and GitHub automation
- [ ] Repository discovery
- [ ] Clone/open workspace
- [ ] Branch creation
- [ ] File changes
- [ ] Diff generation
- [ ] Build/test validation
- [ ] Commit creation
- [ ] Push with approval
- [ ] Pull request creation
- [ ] Automated review

### 10. Model/provider layer
- [ ] Provider-neutral model interface
- [ ] Model registry
- [ ] Per-agent model policies
- [ ] Streaming generation
- [ ] Tool calling
- [ ] Retry/fallback policy
- [ ] Token and cost accounting

### 11. OpenAI-compatible API surface

Target compatibility endpoints:

```text
POST /v1/chat/completions
GET  /v1/models
```

The compatibility layer should route requests into ECC agents while preserving ECC permissions, project context, tools, audit logging, and approval requirements.

### 12. ECC Development Studio

The complete workflow should be:

```text
User objective
    -> API authentication
    -> policy evaluation
    -> project selection
    -> manager/planner
    -> specialist-agent execution
    -> tool execution
    -> build/test
    -> security review
    -> documentation update
    -> approval gate
    -> Git branch/commit/PR
    -> final result + audit trail
```

## Initial API Contract

### Create task

`POST /api/v1/tasks`

```json
{
  "project_id": "project-123",
  "instruction": "Implement the Rust combat subsystem and add tests.",
  "agents": ["planner", "rust", "qa"],
  "approval_required": true,
  "max_steps": 100
}
```

### Task lifecycle

```text
queued
  -> planning
  -> running
  -> review
  -> awaiting_approval
  -> completed
```

Terminal failure states:

```text
failed
cancelled
```

## Security Model

ECC should use least-privilege, capability-based permissions.

```text
read
write
execute
git
network
secrets
```

No agent receives unrestricted host access by default. Sensitive capabilities require explicit policy authorization and, where configured, human approval.

## Repository Integration

The implementation should be organized so the existing ECC agents and skills remain reusable rather than being replaced by the API layer. The API becomes the control plane; the existing ECC runtime remains a source of agent capabilities.

Recommended long-term structure:

```text
ECC/
├── apps/
│   ├── ecc-api/
│   ├── ecc-worker/
│   ├── ecc-cli/
│   └── ecc-vscode/
├── packages/
│   ├── agent-core/
│   ├── agent-runtime/
│   ├── agent-registry/
│   ├── orchestrator/
│   ├── provider-adapters/
│   ├── tool-runtime/
│   ├── policy/
│   ├── memory/
│   ├── project/
│   ├── git/
│   ├── events/
│   ├── storage/
│   ├── schemas/
│   └── observability/
├── config/
├── docs/
├── tests/
├── docker/
└── scripts/
```

## Local Wiring Workflow

After cloning ECC on Windows:

```powershell
git clone https://github.com/ArkansasIo/ECC.git
cd ECC
code .
```

For the API workspace, install dependencies, configure environment variables, then run the API and worker independently. The exact commands should follow the repository's package manager and existing workspace configuration rather than replacing it.

Recommended development sequence:

1. Start the ECC API.
2. Verify `/api/v1/health`.
3. Register or discover an ECC agent.
4. Submit a test task.
5. Stream task events.
6. Run a workspace read-only task.
7. Run a controlled write task.
8. Execute tests.
9. Review the generated diff.
10. Require approval before Git push or deployment.

## Milestones

### Phase 1 — Control Plane
API, task model, agent registry, provider interface, permissions, health, and OpenAPI.

### Phase 2 — Runtime Integration
Connect existing ECC agents, skills, hooks, memory, and rules.

### Phase 3 — Persistent Platform
PostgreSQL, task/run persistence, event storage, project registry, and audit logging.

### Phase 4 — Real-Time Development
WebSocket/SSE events and VS Code integration.

### Phase 5 — Autonomous Engineering Workflow
Planner, specialist agents, build/test/review loops, Git branches, commits, and pull requests.

### Phase 6 — Production Platform
Authentication, rate limiting, observability, sandboxing, model routing, deployment controls, backups, and disaster recovery.

## Definition of Done

ECC reaches the first production-ready milestone when a user can submit a project task from VS Code or the API, ECC can plan and delegate it to registered agents, agents can safely operate inside an isolated project workspace, tests and security checks run automatically, live progress is visible, and Git changes require the configured approval policy before commit/push/deployment.
