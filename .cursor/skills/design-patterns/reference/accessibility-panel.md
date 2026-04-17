---
name: Accessibility Panel
product: cross-product
category: forms
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Accessibility Panel

> **Product**: cross-product | **Category**: forms | **Status**: draft

## Problem Statement

Users need to adjust accessibility settings: profiles (Seizure safe, Vision impaired, ADHD friendly, Cognitive disability, Keyboard navigation, Blind users/Screen reader), font sizing, line height, letter spacing, color (Dark/Light/High contrast, saturation, monochrome), and background/text color pickers. Reference: Harmony Functionality page 29.

## Solution

A ShellPanel on the right with accessibility profiles (selectable), RangeInput sliders for font size, line height, letter spacing, Toggle and RangeInput for color (Dark/Light/High contrast, saturation, monochrome), and color pickers for background and text. Button to reset or apply.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Main content                      │ Accessibility       │
│                                   │ Profile: [Seizure safe] [Vision] ... │
│                                   │ Font size    [====●===]              │
│                                   │ Line height  [===●====]              │
│                                   │ Letter space [==●=====]              │
│                                   │ Color: [Dark][Light][High contrast]  │
│                                   │ Saturation   [======●=]              │
│                                   │ [Background] [Text] (pickers)        │
│                                   │ [Reset] [Apply]                      │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── Profile options (Seizure safe, Vision impaired, ADHD friendly, Cognitive, Keyboard, Blind/Screen reader)
├── RangeInput (font size, line height, letter spacing)
├── Toggle / RangeInput (Dark/Light/High contrast, saturation, monochrome)
├── Color pickers (background, text)
└── Button (Reset, Apply)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel (Harmony 29) |
| Profiles | Yes | Seizure safe, Vision, ADHD, Cognitive, Keyboard, Blind/Screen reader |
| Sliders | Yes | Font size, line height, letter spacing |
| Color | Yes | Dark/Light/High contrast, saturation, monochrome |
| Color pickers | Yes | Background and text |
| Reset/Apply | Yes | Reset to defaults or apply |

## Usage Guidelines

### When to Use

- In-app accessibility settings (Harmony 29)
- When users need to tune contrast, motion, typography, colors
- Compliance or user preference

### When NOT to Use

- OS-level only → No panel
- Fixed theme → No customization panel
- Minimal a11y → Link to docs or simple toggle

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { Toggle } from '@/components/ui/toggle';
import { RangeInput } from '@/components/ui/range-input';
import { Button } from '@/components/ui/button';
// Color picker: verify from Harmony or custom.
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, Toggle, RangeInput, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Profiles | Apply preset (e.g. Vision impaired sets contrast + font). |
| Sliders | Map to CSS vars or theme; persist per user. |
| Color | Theme (dark/light/high contrast), saturation, monochrome. |
| Pickers | Override background/text; store and apply. |

## Accessibility

- [ ] Panel and all controls keyboard accessible; labels for sliders.
- [ ] Changes apply live or on Apply; avoid flashing (seizure profile).

## Related Patterns

- **Contextual Toolbar** — Accessibility icon opens this panel.
- **Settings Form** — General settings; this is a11y-specific.
- **Environment / System Switcher** — Dark mode may be there or here.

## Design Decisions

**Decision**: Right panel with profiles, sliders, color options, pickers. **Rationale**: Harmony Functionality page 29. **Alternatives**: Modal; separate settings page.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with profiles (Seizure, Vision, ADHD, Cognitive, Keyboard, Blind).
- [ ] RangeInput for font, line height, letter spacing; color options and pickers.
- [ ] Reset and Apply; persist and apply to theme.
- [ ] Update registry if adding new instance.
