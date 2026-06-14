# Task Coordinator — ascinfo.dev

Coordinates development through a linear pipeline: Plan → Checkpoint → Implement → Review.

## Task

$ARGUMENTS

## Before Starting

1. If $ARGUMENTS is empty, ask the user for a task description. Do not proceed without one.
2. Check for existing `.claude/workspace/WIP.md`. If found, warn: "Ya hay una tarea en progreso. ¿Continúas con la nueva igualmente?"
3. Read: `CLAUDE.md`, `.claude/workspace/MECHANICS.md`

## Pipeline

### Phase 1 — Plan

Create `.claude/workspace/WIP.md` with current timestamp and phase "Planning".

Launch `planner` with:
- The task description from $ARGUMENTS
- Instruction to analyze relevant code in `src/` before planning
- Instruction to create `PLAN-{slug}.md` in `.claude/workspace/planning/` then move it to `.claude/workspace/progress/`
- Instruction to update WIP.md on start and completion

Tell the user: "Fase 1: Generando plan de implementación..."

---

### Phase 2 — Checkpoint

After the planner finishes:
1. Read the generated plan from `.claude/workspace/progress/`
2. Show the plan summary to the user
3. Ask: **"¿El plan te parece correcto? Responde 'si' para proceder con la implementación o 'no' para cancelar."**
4. If the user says no: delete WIP.md, tell the user "Tarea cancelada. Puedes usar /plan para refinar el enfoque." and stop.
5. If the user says yes: continue to Phase 3.

---

### Phase 3 — Implement

Update WIP.md phase to "Implementation".

Launch `fullstack-developer` with:
- Instruction to read the plan from `.claude/workspace/progress/`
- Instruction to implement step by step following `.claude/skills/clean-code.md`
- Instruction to run `pnpm type-check` and `pnpm test` from the project root before finishing
- Instruction to move the plan to `.claude/workspace/review/` on completion
- Instruction to update WIP.md on start and completion

Tell the user: "Fase 3: Implementando..."

---

### Phase 4 — Review

Update WIP.md phase to "Review".

Launch `code-reviewer` with:
- Instruction to review via `git diff`
- Instruction to run `pnpm type-check` to verify TypeScript
- Instruction to create `REVIEW-{slug}.md` in `.claude/workspace/review/` with a clear `## VERDICT: PASS` or `## VERDICT: FAIL` section
- Instruction to update WIP.md on start and completion

Tell the user: "Fase 4: Revisando código..."

After reviewer finishes, read the REVIEW file and check the verdict:

**PASS:**
- Move plan and review files to `.claude/workspace/completed/`
- Delete WIP.md
- Tell the user: "Tarea completada. Código aprobado en revisión."

**FAIL:**
- Launch `fullstack-developer` ONE MORE TIME with the specific issues from the review
- Developer fixes issues and updates WIP.md
- Move all files to `.claude/workspace/completed/`
- Delete WIP.md
- Tell the user: "Tarea completada con correcciones aplicadas."

**FAIL-TESTS** (production code correct, tests insufficient):
- Read the Recommendation section to identify the class name
- Launch `test-writer` with the class name and review feedback
- test-writer generates the missing tests
- Move all files to `.claude/workspace/completed/`
- Delete WIP.md
- Tell the user: "Tarea completada. Tests completados por test-writer."

---

## Rules

- **No loops** — each phase runs once
- **One fix retry max** — if review fails, developer gets one attempt, no second review
- **Linear only** — Plan → Checkpoint → Implement → Review → Done
- **Communicate in Spanish** at each phase transition
