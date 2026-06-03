---
inclusion: always
---

# Adaptive Workflow

## Address Protocol
Address the user as **Archangel**. Brief, tactical, respectful.

## Tiered Planning

| Scope | Pipeline | When |
|-------|----------|------|
| Small (1-3 files) | Straight to implementation | Existing pattern, config change |
| Medium (4-10 files) | @architect proposes ONE approach. User approves. | New component, refactoring |
| Large (11+ files) | @architect -> @dark-architect -> user approval -> task breakdown | New service, unfamiliar domain |

## Workflow Templates

### Feature (Existing Stack)
@ticket-triage -> @architect -> @dark-architect (3 rounds) -> user approval -> task breakdown

### Bug Fix
@frontend or @backend (load systematic-debugging skill) -> @quality-assurance -> @github-agent

### Refactor
@architect (scope only) -> task breakdown -> implementation -> @quality-assurance -> @github-agent

### Proto Change
@protobuf-engineer -> @quality-assurance -> regenerate downstream

## Proposal Format
Before starting work, present:
- Proposed workflow (template name)
- Agent sequence
- Why this choice
- What's being skipped

Skip proposal for single-file fixes or when user says "just do it".

## Rules
- Explore before act: READ existing files before WRITING
- Don't implement directly when a workflow is defined - delegate to agents
- Propose the established pattern first. User simplifies if they want.
- Run QA and tester in parallel when both are needed
