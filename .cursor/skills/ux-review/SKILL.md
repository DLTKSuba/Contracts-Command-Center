---
name: ux-review
description: "Standalone UX review using harmony-ux-principles only; any project."
disable-model-invocation: true
---

# /ux-review

Standalone UX review using the harmony-ux-principles skill only. Works on any project; does not require Harmony.

## Input

The user invokes `/ux-review` with an optional **file path** or **description** of the UI to review (e.g. a component, page, or flow).

## Instructions

1. Use **only** the **harmony-ux-principles** skill. Do not require Harmony components or tokens; this is a generic UX review.
2. Run through the skill's checklist (Application section):
   - Count interactive elements — Is cognitive load reasonable?
   - Check for cross-reference friction — Do users need to remember or scroll?
   - Identify the entry point — Is it obvious where to start?
   - Verify system status — Is save state and progress visible?
   - Look for error-prone flows — Could constraints prevent mistakes?
   - Consider the user's frequency — Is this a daily task or occasional?
3. Report findings with **specific recommendations** tied to these principles.
