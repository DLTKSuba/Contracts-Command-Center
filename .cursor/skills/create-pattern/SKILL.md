---
name: create-pattern
description: "Create a new pattern from a component using the design-patterns skill."
disable-model-invocation: true
---

# /create-pattern

Create a new pattern from a component using the design-patterns skill.

## Input

The user provides:
- **Component name** (required), e.g. `FloatingNav`, `WizardDialog`
- **Product** (optional), e.g. `CP`, `PPM`, `VP`, or `cross-product`

Examples: `/create-pattern FloatingNav CP`, `/create-pattern FloatingNav`, `/create-pattern WizardDialog --product PPM`

## Instructions

1. Use the **design-patterns** skill for context (pattern structure, workflow, script usage).
2. Run the pattern creation script from the **workspace root** so it can find the user's component:
   - With product: `python .cursor/skills/design-patterns/scripts/create_pattern.py [name] --product [product]`
   - Without product: `python .cursor/skills/design-patterns/scripts/create_pattern.py [name]`
   Use the component name (and optional product) from the user's message. Omit `--product` if the user did not specify one.
3. Report the **generated file path** to the user (under `.cursor/skills/design-patterns/reference/`).
4. Remind the user to **fill any TODO sections** in the generated doc and **set status to review** when ready.
