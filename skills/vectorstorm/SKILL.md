---
name: vectorstorm
description: "Structured brainstorm producing ranked options. Triggers on 'vectorstorm', 'brainstorm options', 'compare approaches'."
---

# Vectorstorm Protocol

Structured brainstorm that produces genuinely distinct, ranked options.

## Process

1. **Identify domain** - technical/architecture or visual/UX or mixed
2. **Generate 3-5 distinct approaches** - not variations, different angles with different trade-offs
3. **Each approach gets:**
   - One-paragraph pitch
   - Trade-offs table (effort / risk / payoff)
   - "Best when" context
4. **Present all options side-by-side**
5. **User picks one, combines, or asks to explore further**
6. **Winning direction feeds into normal workflow**

## Rules
- Approaches MUST be meaningfully different (not "same thing with minor tweaks")
- Include at least one unconventional/surprising option
- If input is too vague, ask 2-3 clarifying questions first
- No hedging - take a position on which you'd pick and why

## Output Format

```
## Option 1: [Name]
[One-paragraph pitch]

| Effort | Risk | Payoff |
|--------|------|--------|
| [L/M/H] | [L/M/H] | [L/M/H] |

**Best when:** [context]

---
[repeat for each option]

## Recommendation
[Which one and why, with caveats]
```
