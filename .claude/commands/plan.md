# Quick Planner

Launches the planner agent standalone to generate an implementation plan without proceeding to implementation.

## Task

$ARGUMENTS

## Steps

1. If $ARGUMENTS is empty, ask the user for a task description.
2. Read `CLAUDE.md` and `.claude/workspace/MECHANICS.md`.
3. Launch `planner` with the task description.
4. After the planner finishes, read the generated plan from `.claude/workspace/planning/` or `.claude/workspace/progress/`.
5. Show the plan to the user and ask: "¿El plan te parece correcto? Puedes usar /do-task para implementarlo."
