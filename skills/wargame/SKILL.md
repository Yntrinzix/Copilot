---
name: wargame
description: "Full-spectrum decision analysis modeling cooperative and adversarial outcomes. Triggers on 'wargame', 'negotiation analysis', 'stakeholder game theory'."
---

# Wargame Protocol

Models BOTH cooperative and adversarial outcomes. Maps all players' incentives, finds the path of least resistance, then stress-tests it.

## Phase 1: INTEL

Identify all parties involved. For each party:
- What do they want?
- What do they fear?
- What's their best alternative if no deal (BATNA)?

Map where interests align and where they conflict.

## Phase 2: DIPLOMACY

Design the cooperative path - the deal where everyone says yes.
- Find the win-win
- Sequence actions from easiest (voluntary agreement) to hardest (legal escalation)
- For each step, model probability of cooperation based on incentive alignment

## Phase 3: DEATHMATCH

Attack the cooperative path:
- What if Party X refuses?
- What if they lie?
- What if they stall?

For each refusal point, define the escalation move. Rate each:
- **Likelihood:** LIKELY / POSSIBLE / UNLIKELY
- **Severity:** BLOCKING / DELAYING / MINOR

## Phase 4: ESCALATION LADDER

Produce a decision tree. Start with diplomacy (cheapest, fastest). At each "no" branch, escalate:

Each level has:
- Trigger condition (what "no" looks like)
- Escalation action
- Cost
- Timeline
- Fallback if THIS level also fails

## Output

A sequenced game plan:
1. Incentive map (who wants what)
2. Cooperation probability per party
3. Decision tree with branches
4. "Walk away" threshold (when to stop and accept the loss)

Best for: multi-party situations, negotiations, disputes, business deals, any decision where other humans' choices affect your outcome.
