---
name: search-patterns
description: "Search the design-patterns registry by query, product, or category."
disable-model-invocation: true
---

# /search-patterns

Search the design-patterns registry for patterns by query, product, or category.

## Input

The user provides one or more of:
- **Query** (keyword search), e.g. `wizard`, `sidebar`, `accordion`
- **Product** (filter by product), e.g. `--product PPM`, `--product CP`
- **Category** (filter by category), e.g. `dialogs`, `navigation`, `forms`
- Or **list all** patterns (no filters)

Examples: `/search-patterns wizard`, `/search-patterns --product PPM`, `/search-patterns --category navigation`, `/search-patterns wizard --product PPM`

## Instructions

1. Use the **design-patterns** skill for context (registry location, script usage).
2. Run the design-patterns search script (it defaults to that skill’s `reference/`; use `--patterns-dir` only for a custom registry):
   - Base: `python .cursor/skills/design-patterns/scripts/search_patterns.py`
   - Add flags from the user's message: `--query "..."`, `--product "..."`, `--category "..."`, or `--list` to list all patterns.
   - Use `--format table` (default) so results are returned in table format.
3. Present the script output to the user (table of Pattern | Product | Category | Status | Path).
