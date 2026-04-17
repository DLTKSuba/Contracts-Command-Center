---
name: harmony-ux-principles
description: UX principles for design critique, cognitive load analysis, and usability guidance. Use when reviewing designs, auditing usability, or providing feedback on interaction patterns.
---

# Harmony UX Principles

Apply these principles when critiquing designs, analyzing cognitive load, or providing usability feedback. These are universal UX guidelines that complement Harmony component-specific rules.

For Harmony-specific component rules and accessibility, use the harmony-usage-rules skill.

---

## Cognitive Load

### Element Density
- **7±2 interactive elements** per visual group is the comfort threshold (Miller's Law)
- Flag when a single view significantly exceeds this
- Recommend: grouping, progressive disclosure, or collapsible sections

### Information Density
- If users must read everything to understand what to do → too dense
- Scannability matters: headers, visual hierarchy, whitespace
- Dense data displays (tables, dashboards) need clear entry points

---

## Progressive Disclosure

### When to Apply
- Forms with **10+ fields** → use steps, sections, or accordions
- Features with **multiple modes** → show primary mode first, reveal others on demand
- Complex configuration → start with smart defaults, allow customization

### How to Implement
- Default to simplified view
- "Show more" / "Advanced options" for power users
- Stepper or wizard for multi-stage tasks
- Collapsible sections for reference content

### Anti-pattern
- Don't hide critical information
- Don't require clicks to see content users need immediately

---

## Cross-Reference Friction

### The Problem
- User enters value in Section A
- User needs that value to complete Section B
- User must scroll/navigate back to see it
- Cognitive load increases, errors increase

### Symptoms to Flag
- Calculations that depend on values from other sections
- Forms where later fields reference earlier choices
- Multi-step flows where context from step 1 matters in step 5

### Fixes
- **Sticky summaries**: Keep running totals visible
- **Inline context**: Show referenced values where they're needed
- **Smart defaults**: Pre-fill based on earlier inputs
- **Side-by-side layouts**: When two things must be compared

---

## Clear Entry Points

### The Principle
- Users should know **where to start** within 5 seconds
- One clear primary action per view
- Visual hierarchy guides the eye

### Symptoms to Flag
- No obvious first step
- Multiple equal-weight buttons/actions competing
- User asks "What do I do first?"

### Fixes
- Single primary button (use Harmony `variant="primary"`)
- Secondary actions visually subordinate
- Empty states with clear call-to-action
- Numbered steps or visual flow indicators

---

## Visible System Status

### Save State
- Users must know if their work is saved
- Options: auto-save indicator ("All changes saved"), explicit save button, or both
- **Never** leave users wondering if they'll lose work

### Progress Indication
- Multi-step flows: show current step and total steps
- Long operations: loading indicators with context ("Calculating totals...")
- Background processes: status visible without blocking UI

### Feedback
- Actions should have visible results
- Success/error states clearly communicated
- Don't leave users wondering "Did that work?"

---

## Error Prevention Over Error Messages

### Prefer Constraints
- Disable invalid options rather than allowing then rejecting
- Input masks for formatted data (phone, date)
- Smart defaults that reduce decisions
- Confirmation for destructive actions

### When Errors Occur
- Explain **what** went wrong
- Explain **how** to fix it
- Keep user's input (don't clear the form)
- Position error messages near the problem

---

## Learnability vs. Efficiency

### For Infrequent Users
- Prioritize discoverability
- Labels over icons alone
- Guidance and tooltips
- Sensible defaults

### For Power Users
- Keyboard shortcuts
- Bulk actions
- Customizable views
- "Expert mode" option

### When Both Matter
- Default to learnable, offer efficiency features
- Don't sacrifice learnability for power-user optimization
- Consider: Will this be delegated to junior staff?

---

## Application

When reviewing a design:

1. **Count interactive elements** — Is cognitive load reasonable?
2. **Check for cross-reference friction** — Do users need to remember or scroll?
3. **Identify the entry point** — Is it obvious where to start?
4. **Verify system status** — Is save state and progress visible?
5. **Look for error-prone flows** — Could constraints prevent mistakes?
6. **Consider the user's frequency** — Is this a daily task or occasional?

Flag issues with specific recommendations tied to these principles.
