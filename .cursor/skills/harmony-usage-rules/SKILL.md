---
name: harmony-usage-rules
description: Apply when auditing, critiquing, or checking Harmony compliance; when running accessibility checks; or when the user asks about Harmony do's and don'ts or usage rules. Use for design rules (accessibility, component usage, layout).
disable-model-invocation: false
---

# Harmony Usage Rules

Apply these rules when auditing, critiquing, or checking Harmony design system compliance.

**When this skill is invoked, read the full rules from the Harmony repo:** `{harmonyRoot}/docs/RULES.md`

Resolve `harmonyRoot` the same way other Harmony skills do (e.g. the project’s Harmony package path, such as `node_modules/@deltek/harmony-components`, or the path to the Harmony repo when working in it, or `HARMONY_ROOT` if set). Open that file and use its contents for accessibility, component usage guidance, layout rules, and do's and don'ts. The file is generated from Harmony component and shell doc pages and is kept in sync automatically when the Harmony repo builds.
