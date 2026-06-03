---
name: storyboard
description: "Narrative brainstorm for animations, transitions, interactions. Triggers on 'storyboard', 'how should this feel', 'motion design'."
---

# Storyboard Protocol

Narrative brainstorm for animations and interactions. Write like a film director, not an engineer.

## Process

1. Generate 3-5 distinct motion concepts
2. Each written as a **scene** - cinematic prose explaining how it FEELS to watch
3. After narrative: technical specs (duration, easing, properties, implementation hint)
4. Present all options
5. User picks one - becomes the motion spec for implementation

## Rules
- Write like a film director describing a shot, not an engineer listing properties
- Each option must feel genuinely different to WATCH (not same motion with different timing)
- Use physical metaphors: liquid, gravity, breath, magnetism, weight
- The narrative is the source of truth - code must match the feeling described

## Output Format

```
## Scene 1: [Metaphor Name]

[2-3 sentences of cinematic prose. How does it feel? What's the emotional quality?
What physical thing does it remind you of?]

**Technical:**
- Duration: [ms]
- Easing: [curve]
- Properties: [what animates]
- Implementation: [framework/approach hint]

---
[repeat for each scene]
```
