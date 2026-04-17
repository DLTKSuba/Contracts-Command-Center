---
name: Tabbed Content
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Tabbed Content

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need to switch between multiple views or sections within the same page without navigating away. Each view has distinct content (e.g. Summary, Details, History).

## Solution

A TabStrip at the top of the content area with tab labels; selecting a tab shows the corresponding content (often in a Card). Only one tab's content is visible at a time.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [Summary] [Details] [History] [Attachments]                 │
├─────────────────────────────────────────────────────────────┤
│ Card / content for selected tab                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
TabStrip
├── Tab (Summary), Tab (Details), Tab (History), ...
└── (content panel)
    └── Card or content per tab
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| TabStrip | Yes | Tab labels; active tab indicated |
| Content area | Yes | Renders content for active tab |
| Card (optional) | No | Wraps tab content |

## Usage Guidelines

### When to Use

- 2–5 sibling views on the same page (e.g. Summary, Details, History)
- When URL or state can reflect active tab for deep-linking
- Content area only; not global nav

### When NOT to Use

- Primary app navigation → Use sidebar or top nav
- Many tabs → Consider dropdown or list
- Single view → No tabs needed

## Implementation

### Component Dependencies

```typescript
import { TabStrip } from '@/components/ui/tab-strip';
import { Card } from '@/components/ui/card';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony TabStrip, Card when Harmony root is available.*

| Area | Notes |
|------|--------|
| TabStrip | tabs[], activeTab, onTabChange. |
| Content | Render content[activeTab] or lazy-load per tab. |

## Accessibility

- [ ] Tabs in tablist; arrow keys switch tabs; panel has aria-labelledby.
- [ ] Active tab has selected state.

## Related Patterns

- **Bottom Tab Navigation** — Tabs in bottom bar (open documents).
- **Expanded Menu with Filters** — Left sidebar with tabs (All, Tab 2, Tab 3).
- **Widget Dashboard** — May use sections instead of tabs.

## Design Decisions

**Decision**: TabStrip in page content. **Rationale**: Standard in-page switching. **Alternatives**: Accordion; single scroll.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] TabStrip with tab labels; bind active tab to state.
- [ ] Content area for active tab; optional Card wrapper.
- [ ] Update registry if adding new instance.
