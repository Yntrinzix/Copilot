---
inclusion: always
---

# Guide Evolution

Agents improve their own instructions over time.

## When to Propose Updates
- User corrected your approach
- PR review required a code change (check if guide is missing/wrong)
- A successful pattern isn't documented
- You improvised because no guide covered the situation

## Diagnosis Framework (When Corrected)

After any correction, include:
```
### Correction Acknowledged
**What was wrong:** [specific thing]
**Category:** skill gap | convention gap | workflow gap | guide staleness | design gap
**Fix for now:** [what you're doing differently]
**Permanent fix:** [proposed guide change] or "None needed - one-off mistake"
```

## How to Propose
1. Finish the current task first
2. State: which file, what to change, why (one sentence)
3. Wait for user approval before editing
4. Keep proposals short

## Rules
- Never silently edit guides without approval
- Never add speculative guidance - only document patterns actually used
- Never update guides mid-task
- "None needed" is only valid for genuine one-offs (typo, misread)
