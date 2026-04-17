---
name: Multi-Section Form
product: cross-product
category: forms
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Multi-Section Form

> **Product**: cross-product | **Category**: forms | **Status**: draft

## Problem Statement

Users need to complete complex forms with many fields. Grouping into collapsible sections (Accordion) reduces cognitive load and lets users focus on one section at a time while keeping the full form on one page.

## Solution

A form composed of Accordion sections; each section contains Label, Input, Textarea, NumberInput, and similar controls. Buttons for Submit/Cancel at bottom. Sections can be expanded/collapsed.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ Section 1: Basic info                                     │
│   Label: [Input        ]  Label: [NumberInput]               │
│   Label: [Textarea     ]                                     │
├─────────────────────────────────────────────────────────────┤
│ ▶ Section 2: Details (collapsed)                            │
├─────────────────────────────────────────────────────────────┤
│ ▶ Section 3: Optional (collapsed)                           │
├─────────────────────────────────────────────────────────────┤
│ [Cancel]                                    [Submit]        │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Accordion
├── Section 1
│   ├── Header (title)
│   └── Content — Label, Input, Textarea, NumberInput, Button
├── Section 2
└── Section N
(Footer) Button Cancel, Button Submit
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Accordion | Yes | Collapsible sections |
| Form fields | Yes | Label, Input, Textarea, NumberInput as needed |
| Submit/Cancel | Yes | At bottom of form |

## Usage Guidelines

### When to Use

- Long forms with logical groups (e.g. Basic info, Details, Optional)
- When progressive disclosure helps (expand section when needed)
- Single-page form with multiple sections

### When NOT to Use

- Short form → Single Card or no accordion
- Strict linear flow → Use Stepper Wizard
- Each section is a separate step → Consider wizard

## Implementation

### Component Dependencies

```typescript
import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Label, Input, Textarea, NumberInput } from '@/components/ui/...';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Accordion, Label, Input, Textarea, NumberInput, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Accordion | Default expanded section(s); allowMultiple or single. |
| Fields | Controlled components; validation per section or on submit. |

## Accessibility

- [ ] Accordion headers focusable; expand/collapse via keyboard.
- [ ] Section headings and labels for screen readers.

## Related Patterns

- **Settings Form** — Grouped form with Cards instead of Accordion.
- **Wizard Dialog** — Multi-step in dialog with accordion.
- **Stepper Wizard** — Linear steps instead of collapsible sections.

## Design Decisions

**Decision**: Accordion for sections. **Rationale**: Reduces clutter; user controls disclosure. **Alternatives**: All expanded; wizard.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Accordion with one or more sections.
- [ ] Label + Input/Textarea/NumberInput in each section.
- [ ] Submit/Cancel at bottom; wire to validation and submit.
- [ ] Update registry if adding new instance.
