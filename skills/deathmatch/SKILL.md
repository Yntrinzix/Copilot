---
name: deathmatch
description: "Extended tournament with redemption round. Triggers on 'deathmatch', 'maximum scrutiny', 'full adversarial'."
---

# Deathmatch Protocol

Extended tournament (5 rounds) where WOUNDED ideas get a second chance.

## Round 1: Attack (@dark-architect)
Same as tournament Round 1. Produce N numbered challenges rated FATAL/SERIOUS/MINOR.

## Round 2: Defense
Same as tournament Round 2. Defenders counter-argue SERIOUS+ challenges.

## Round 3: Ruling (@dark-architect)
Dark Architect declares each challenge:
- **SURVIVED** - Defense held. Challenge neutralized.
- **WOUNDED** - Defense was weak but idea has potential. Gets one more shot.

NOT killed. Wounded.

## Round 4: Deathmatch (Redemption)

Each WOUNDED challenge gets ONE redemption attempt:
- New arguments only. Cannot repeat failed defenses.
- Can reframe, cite new evidence, propose new mitigations
- Can concede the flaw but argue the system works despite it

Survivors from Round 3 get stress-tested (can DA find a deeper flaw?).

## Round 5: Final Verdict (@dark-architect)

For WOUNDED challenges after redemption:
- **REDEEMED** - Found genuine value despite the wound
- **DEAD** - No redemption possible

For SURVIVED challenges after stress-test:
- **CONFIRMED SURVIVOR** - Held under deeper scrutiny
- **LATE WOUND** - Deeper flaw found

## Output

Full scoreboard:
```
| # | Challenge | R3 Status | R5 Status | Action Required |
|---|-----------|-----------|-----------|-----------------|
```

Plus: mandatory pre-deployment actions for anything not CONFIRMED SURVIVOR or REDEEMED.

## Rules
- NEVER skip Round 3. The orchestrator doesn't declare winners.
- Fact-check rule applies (same as tournament).
- Round 4 gets genuinely new arguments, not restatements.
