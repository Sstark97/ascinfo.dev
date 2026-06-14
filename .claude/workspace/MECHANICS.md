# Workspace Mechanics

Reference document for all agents and the task coordinator. Defines how the workspace operates.

## Directory Structure

```
.claude/workspace/
├── WIP.md              # Active task tracker (ephemeral, deleted on completion)
├── planning/           # Plans being drafted by planner agent
├── progress/           # Plans ready for implementation by fullstack-developer
├── review/             # Code under review by code-reviewer
├── completed/          # Finished plans and reviews (historical record)
└── MECHANICS.md        # This file
```

## WIP.md Format

```markdown
# WIP: [Task Title]

## Task
[Original user request]

## Phase
[Current phase: Planning | Implementation | Review | Complete]

## Log
- [YYYY-MM-DD HH:MM] Phase started: [phase name]
- [YYYY-MM-DD HH:MM] Agent: [agent name] — [action taken]
- [YYYY-MM-DD HH:MM] Phase complete: [phase name]
```

## File Naming

Plans and reviews use a slug derived from the task title:
- `PLAN-{task-slug}.md` (e.g., `PLAN-add-notion-repository.md`)
- `REVIEW-{task-slug}.md` (e.g., `REVIEW-add-notion-repository.md`)

## File Movement Flow

```
planning/PLAN-{slug}.md
    → (planner moves after creation)
progress/PLAN-{slug}.md
    → (developer moves after implementation)
review/PLAN-{slug}.md + review/REVIEW-{slug}.md
    → (coordinator moves after verdict)
completed/PLAN-{slug}.md + completed/REVIEW-{slug}.md
```

## Timestamps

Always use: `date '+%Y-%m-%d %H:%M'`

## Lifecycle Rules

1. WIP.md is created at task start and deleted at task end
2. Plan files are permanent — always move to completed/, never delete
3. One task at a time — check for existing WIP.md before starting
4. Each agent updates WIP.md with its start and completion log entries
