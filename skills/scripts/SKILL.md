---
name: scripts
description: "Master script table. Triggers on 'scripts', 'what commands are available', 'help'."
---

# Scripts

Shortcut keywords that trigger specific actions. Execute immediately when heard.

| Keyword | Action |
|---------|--------|
| `tournament` | Load `/skills/tournament/SKILL.md` and execute the 3-round adversarial review |
| `deathmatch` | Load `/skills/deathmatch/SKILL.md` and execute the 5-round extended review |
| `wargame` | Load `/skills/wargame/SKILL.md` and execute multi-party decision analysis |
| `vectorstorm` | Load `/skills/vectorstorm/SKILL.md` and execute structured brainstorm |
| `storyboard` | Load `/skills/storyboard/SKILL.md` and execute narrative motion design |
| `grill me` | Load `/skills/grill-me/SKILL.md` and interview relentlessly |
| `scripts` | Show this table |
| `pr status` | Check all open PRs across repos and summarize: branch, title, review status, CI status |
| `dep check` | Check if dependency PRs are merged, report which are ready vs blocking |
| `trace` | Given a file path, map what's inside, who calls it, what it depends on. Output Mermaid diagram. |
| `review` | Given a PR number + repo, read the PR changes and present findings for approval before posting |
| `drift check` | Compare architecture docs against actual repo structures. Flag mismatches. |
| `cleanup` | After feature merges: remove worktrees, delete branches locally and on origin |
| `visualize` | Generate Mermaid diagrams from architecture knowledge (C4, data flow, dependency graph) |
| `proto check` | Verify proto package versions are aligned across repos. Report mismatches. |
| `parallel qa` | While implementing current task, run QA review on the previously completed task |
| `post-merge retro` | After a PR merge: diff planned vs shipped, note scope changes, flag guide gaps |
| `health check` | Codebase health: hotspots (files in >50% of PRs), guide drift, refactor candidates |
| `upskill` | Check for new patterns/releases in the stack. Compare against guides, propose updates. |
| `rescan` | Re-read source files for a knowledge entry, check git log for changes, propose updates |
| `mentor` | Personalized learning session. Continue from last or propose next lesson. |
| `mentor assess` | Rapid diagnostic questions on a topic, score understanding |
| `mentor drill` | Practical exercise with feedback, no hand-holding |
