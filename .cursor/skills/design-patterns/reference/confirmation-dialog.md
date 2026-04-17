---
name: Confirmation Dialog
product: cross-product
category: dialogs
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Confirmation Dialog

> **Product**: cross-product | **Category**: dialogs | **Status**: draft

## Problem Statement

Users need to confirm destructive or irreversible actions (delete, overwrite, discard, publish) before they are executed. Without confirmation, a single misclick can cause data loss or unintended side effects. The pattern must make the consequence clear and offer a clear yes/no choice without overwhelming the user.

## Solution

A small modal dialog that states the action and its consequence, with a primary action (e.g. Delete, Discard) and a secondary/cancel action (e.g. Cancel). An optional icon (e.g. warning) reinforces severity. The dialog traps focus and requires an explicit choice before closing.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [X]                                                         │
│  ┌───┐  Title (e.g. "Delete item?")                         │
│  │ ! │  Short description of consequence                    │
│  └───┘  (e.g. "This cannot be undone.")                     │
│                                                              │
│                    [Cancel]  [Delete]                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Dialog
├── DialogHeader (optional close button)
├── DialogContent
│   ├── Icon (optional, e.g. warning)
│   ├── DialogTitle
│   ├── DialogDescription (optional)
│   └── DialogFooter
│       ├── Button (variant: secondary) — Cancel
│       └── Button (variant: danger or primary) — Confirm
└── (backdrop)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Dialog container | Yes | Modal overlay with backdrop; traps focus |
| Title | Yes | Short question or action name (e.g. "Delete project?") |
| Description | No | One line explaining consequence |
| Icon | No | Warning or danger icon for destructive actions |
| Cancel button | Yes | Dismisses without performing action |
| Confirm button | Yes | Performs the action and closes dialog |

## Usage Guidelines

### When to Use

- Before destructive actions (delete, remove, overwrite, discard)
- Before irreversible actions (publish, submit, archive)
- When the action affects shared or critical data
- When the user might have triggered the action by mistake

### When NOT to Use

- For non-destructive choices → Use inline controls or a non-modal choice
- For multi-step or form flows → Use Form Dialog or Wizard Dialog
- For simple acknowledgments (no real choice) → Use Toast or inline message
- When undo is available and sufficient → Prefer undo over confirmation

## Variants

### Destructive (danger)

**Use when**: Action permanently removes or overwrites data.

**Differences from base**:
- Confirm button uses danger variant (e.g. red)
- Optional warning icon
- Copy emphasizes irreversibility

### Neutral confirmation

**Use when**: Action is significant but not destructive (e.g. "Leave page?", "Switch view?").

**Differences from base**:
- Confirm button uses primary or default variant
- No warning icon; tone is informative

## Implementation

### Component Dependencies

```typescript
// Harmony components (verify imports from @deltek/harmony-components or project alias)
import { Dialog } from '@/components/ui/dialog';  // or Harmony Dialog
import { Button } from '@/components/ui/button';  // or Harmony Button
import { Icon } from '@/components/ui/icon';      // or Harmony Icon
```

### Props/Configuration

*Verify against Harmony Dialog and Button component docs when Harmony root is available.*

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls dialog visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when dialog opens/closes |
| `title` | `string` | - | Dialog title (e.g. "Delete item?") |
| `description` | `string` | - | Optional description of consequence |
| `confirmLabel` | `string` | - | Confirm button label (e.g. "Delete") |
| `cancelLabel` | `string` | "Cancel" | Cancel button label |
| `variant` | `'danger' \| 'primary'` | `'primary'` | Confirm button variant for destructive vs neutral |
| `onConfirm` | `() => void \| Promise<void>` | - | Called when user confirms |
| `onCancel` | `() => void` | - | Optional; called when user cancels |

### Integration Points

**Entry Point**: Triggered by user action (e.g. click "Delete" in toolbar or row menu).

**State Management**: Parent holds `open` boolean; sets to `true` when opening, `false` on cancel or after confirm.

**Data Flow**: On confirm, parent runs the destructive action (e.g. API call), then closes dialog. Optional loading state on confirm button while request is in progress.

### Reference Implementation

**Primary Example**: Implement using Harmony Dialog + Button. No shared path in this repo — use Harmony docs for Dialog/Button API.

```typescript
// Key structure — adapt to Harmony Dialog/Button props
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <Icon name="warning" aria-hidden />
    <DialogTitle>{title}</DialogTitle>
    {description && <DialogDescription>{description}</DialogDescription>}
    <DialogFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>{cancelLabel}</Button>
      <Button variant={variant} onClick={handleConfirm}>{confirmLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Accessibility

- [ ] Keyboard navigation: Focus trapped within dialog; Escape closes (cancel). Tab cycles through Cancel and Confirm only.
- [ ] Screen reader: Dialog has role="dialog", aria-labelledby for title, aria-describedby for description. Confirm action announced.
- [ ] Focus management: Focus moves to first focusable element (or confirm button) on open; returns to trigger on close.
- [ ] Color contrast: Danger button and any warning icon meet contrast requirements; do not rely on color alone for meaning.

## Related Patterns

- **Form Dialog** - Use when user must enter data before confirming (e.g. type "Delete" to confirm).
- **Wizard Dialog** - Use for multi-step flows; confirmation may be the final step.
- **Toast / Notification** - Use for non-blocking success/error feedback after the action.

## Design Decisions

### Decision: Modal and two explicit actions

**Context**: User must not perform destructive action by accident.

**Decision**: Use a modal dialog with Cancel and Confirm; no single-click confirm in the primary view.

**Rationale**: Prevents accidental submission; forces a moment of reflection.

**Alternatives Considered**: Inline undo (good for reversible actions); single "Are you sure?" link (weaker, easy to miss).

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Quick Reference

**File to copy**: Use Harmony Dialog and Button; no single reference file in this repo.

**Key modifications needed**:
1. Set Dialog `open`/`onOpenChange` from parent state.
2. Wire Confirm button to `onConfirm` and then close dialog.
3. Use danger variant for destructive confirm; primary for neutral.
4. Add loading state on Confirm if action is async.

### Checklist for New Implementation

- [ ] Follow anatomy structure (title, optional description, Cancel + Confirm).
- [ ] Include both Cancel and Confirm buttons.
- [ ] Use danger variant for destructive actions.
- [ ] Verify accessibility (focus trap, Escape, ARIA).
- [ ] Test integration (open from trigger, confirm/cancel close dialog and run or skip action).
- [ ] Update registry with new instance if adding a new pattern entry.
