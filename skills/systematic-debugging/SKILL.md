---
name: systematic-debugging
description: "Root cause investigation before any fix. Triggers on bug encounters, test failures, unexpected behavior. MANDATORY for @frontend and @backend."
---

# Systematic Debugging

## Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.
```

If you haven't completed Phase 1, you cannot propose fixes. Symptom fixes are failure.

## When to Use
Any technical issue. Use ESPECIALLY when:
- Under time pressure (rushing guarantees rework)
- "Just one quick fix" seems obvious
- Previous fix didn't work
- You don't fully understand the issue

## Phase 1: Root Cause Investigation

BEFORE attempting ANY fix:
1. **Read error messages completely** - stack traces, line numbers, error codes
2. **Reproduce consistently** - exact steps, every time
3. **Check recent changes** - git diff, recent commits, new deps, config changes
4. **Trace data flow** - where does the bad value originate? Trace backward.
5. **Multi-component systems** - add diagnostic logging at each boundary BEFORE fixing

## Phase 2: Pattern Analysis
1. Find working examples in the same codebase
2. Compare: what's different between working and broken?
3. Check dependencies: what settings/config/env does this assume?

## Phase 3: Hypothesis and Test
1. State hypothesis: "I think X is the root cause because Y." Be specific.
2. Test minimally: smallest possible change, one variable at a time.
3. Verify: did it work? If not, form NEW hypothesis. Don't stack fixes.

## Phase 4: Fix
1. Apply the minimal fix that addresses root cause
2. Verify the original symptom is gone
3. Check for regressions
4. Document what was wrong and why (commit message or comment)

## Anti-Patterns (Instant Failure)
- Changing multiple things at once
- "Let me try this" without stating why
- Fixing symptoms without understanding cause
- Assuming the error message is wrong
- Blaming the framework before checking your code
