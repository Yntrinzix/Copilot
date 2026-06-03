---
name: spec-driven
description: "Spec-driven development lifecycle. Triggers on 'new feature', 'spec', 'design this', 'plan this feature'."
---

# Spec-Driven Development

Every feature follows: Requirements → Design → Tasks → Implementation. No skipping.

## Phase 1: Requirements

Create `requirements.md` covering:
- Problem statement (what and why)
- User stories or acceptance criteria
- Constraints and dependencies
- Out of scope (what we're NOT building)

**Gate:** User must say "approved" or "looks good" before proceeding.

## Phase 2: Design

Create `design.md` covering:
- Architecture approach
- Component structure
- API contracts / data flow
- State management
- Error handling strategy
- Edge cases identified

Run @dark-architect adversarial review (3 rounds minimum) on the design.

**Gate:** User must explicitly approve the design before tasks are written.

## Phase 3: Tasks

Create `tasks.md` with:
- Numbered tasks in implementation order
- Each task has: title, description, acceptance criteria, files to touch
- Dependencies between tasks noted
- Each AC must be testable (can write a test for it)

**Gate:** User reviews task breakdown before implementation starts.

## Phase 4: Implementation

Execute tasks in order. For each task:
1. Read existing files first
2. Implement to satisfy the AC
3. Run tests/lint
4. Move to next task

## Hard Rules

- **NEVER write implementation code before design is approved**
- **NEVER skip the adversarial review on designs for Large scope (11+ files)**
- **NEVER write tasks before the user approves the design**
- If user says "just do it" on a Small task (1-3 files), skip to implementation. This gate is for Medium+ only.

## File Storage

Save specs alongside the project or in a dedicated specs directory:
```
specs/{feature-name}/
├── requirements.md
├── design.md
└── tasks.md
```

## Resuming

If a spec already exists partially (requirements done, design not started), pick up from where it left off. Call `knowledge_search` to check for prior work on this feature.
