---
name: tournament
description: "Tournament-style adversarial review. Triggers on 'tournament', 'stress-test design', 'adversarial review'."
---

# Tournament Protocol

Three-round adversarial review of a design, plan, or architecture decision.

## Round 1: Attack (@dark-architect)

Load the `grill-me` skill's branch-by-branch questioning method. Produce N numbered challenges, each rated:
- **FATAL** - Design cannot ship with this flaw
- **SERIOUS** - Significant risk, needs mitigation
- **MINOR** - Nice to fix, won't block

Prune MINOR challenges immediately. Only SERIOUS+ advance to Round 2.

## Round 2: Defense

For each SERIOUS+ challenge, spawn a defender (typically @architect) to counter-argue.

**Parallel defense rule:** If multiple defense angles exist for a challenge, present ALL of them (2-5 defenders per challenge). Only present 1 if there's genuinely one viable counter-argument.

Defenders must provide:
- Counter-argument with evidence
- Why the challenge is wrong, overstated, or already mitigated
- Alternative framing if the challenge has merit but isn't fatal

## Round 3: Judgment (@dark-architect)

The Dark Architect reviews each defense and rules:
- **KILLED** - Defense was convincing. Challenge dismissed.
- **UNDEFEATED** - Defense failed. This is a real risk.

**Rules:**
- The orchestrator does NOT declare winners. Only the Dark Architect can kill or accept a defense.
- **Fact-check rule:** If the Dark Architect rejects a defense based on a technical claim about how a tool/library/framework works (not a design opinion), verify the claim before accepting the rejection. Unverified technical claims cannot kill a defense.

## Output

Final verdict with:
- Surviving risks (undefeated challenges)
- Recommended changes before proceeding
- Killed challenges (confirmed design is solid in those areas)

## Stop Condition
All challenges are either killed (design is solid) or undefeated (real risk found requiring action).
