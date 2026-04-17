---
name: Stepper Wizard
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Stepper Wizard

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to complete a linear multi-step process (e.g. onboarding, import, setup) with clear progress and one step visible at a time. They must be able to move forward and back without losing data.

## Solution

A Dialog containing a Stepper (Step components) and the current step's content (Label, Input, Button). Next/Back buttons advance or go back; final step has Submit. Progress indicator shows step N of M.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [X]  Setup wizard                                           │
│  ●───●───○───○   Step 2 of 4                                │
├─────────────────────────────────────────────────────────────┤
│  Step 2 content                                             │
│  Label: [Input                    ]                         │
│  Label: [Input                    ]                         │
├─────────────────────────────────────────────────────────────┤
│ [Back]                    [Next] or [Submit]                │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Dialog
├── DialogHeader
├── Stepper
│   ├── Step 1, Step 2, ... Step N
├── Content (current step) — Label, Input, Button
└── DialogFooter — Button (Back), Button (Next | Submit)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Stepper | Yes | Visual progress; current step |
| Step content | Yes | Form or content for current step |
| Back | Yes | Previous step (except step 1) |
| Next/Submit | Yes | Next step or submit on last step |

## Usage Guidelines

### When to Use

- Linear flow with 2+ steps (e.g. import: upload → map → confirm)
- When progress indicator is important
- When one step at a time reduces overwhelm

### When NOT to Use

- Non-linear or optional sections → Use Wizard Dialog (accordion)
- Single step → Use Form Dialog
- Very long flow → Consider full-page steps

## Implementation

### Component Dependencies

```typescript
import { Dialog } from '@/components/ui/dialog';
import { Stepper, Step } from '@/components/ui/stepper';
import { Label, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dialog, Stepper, Step, Label, Input, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Stepper | currentStep, steps[]; onStepChange or internal state. |
| Step content | Render per step index; persist form state across steps. |
| Submit | On last step; submit all collected data. |

## Accessibility

- [ ] Step indicator announced; Back/Next focusable.
- [ ] Focus moves to step content when step changes.

## Related Patterns

- **Wizard Dialog** — Accordion-based multi-section; non-linear.
- **Form Dialog** — Single-step form in dialog.
- **Import Dialog** — May use stepper for upload → map → confirm.

## Design Decisions

**Decision**: Linear stepper in dialog. **Rationale**: Clear progress; enforces order. **Alternatives**: Accordion wizard; full-page stepper.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Dialog with Stepper and Step components.
- [ ] Current step content; Back/Next/Submit in footer.
- [ ] Persist step data; submit on last step.
- [ ] Update registry if adding new instance.
