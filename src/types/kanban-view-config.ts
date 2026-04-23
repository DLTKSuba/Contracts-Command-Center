/**
 * Costpoint Kanban view configuration (JSON-aligned, MVP Phase 1).
 * Maps to kanbanView.* in the product spec; host apps load from structured storage.
 */

/** Board-level settings from kanbanView.board */
export interface KanbanViewBoard {
  groupingField: string
  minimumColumnWidth?: number
  cardHeight?: number
  maximumCardHeight?: number
  maximumCardWidth?: number
}

/** Per-column definition from kanbanView.columns[n] */
export interface KanbanViewColumn {
  value: string
  displayLabel: string
  headerColor?: {
    light: string
    dark: string
  }
}

/** One of five card field slots from kanbanView.cardFields.fields */
export interface KanbanViewCardField {
  position: 1 | 2 | 3 | 4 | 5
  fieldName: string
  enabled: boolean
  styleId?: string
}

export interface KanbanViewCardFields {
  titleFieldName: string
  fields: KanbanViewCardField[]
}

/** Conditional color rules: attribute -> fieldName -> fieldValue -> mode colors */
export type KanbanColorMode = { light: string; dark: string }

export interface KanbanViewColorRules {
  cardBackground?: Record<string, Record<string, KanbanColorMode>>
  headerBackground?: Record<string, Record<string, KanbanColorMode>>
  graphicalElement?: Record<string, Record<string, KanbanColorMode>>
}

/** Top-level kanbanView object */
export interface KanbanViewConfig {
  name: string
  description?: string
  board: KanbanViewBoard
  columns: KanbanViewColumn[]
  cardFields: KanbanViewCardFields
  colorRules?: KanbanViewColorRules
}

/** Default numeric fallbacks (spec §2) */
export const KANBAN_BOARD_DEFAULTS = {
  minimumColumnWidth: 200,
  cardHeight: 200,
  maximumCardHeight: 400,
  maximumCardWidth: 450,
} as const

/**
 * Example JSON for documentation and tests (stringified snippet).
 * Not loaded at runtime by the design system.
 */
export const EXAMPLE_KANBAN_VIEW_JSON = `{
  "name": "Projects",
  "description": "MVP Kanban",
  "board": {
    "groupingField": "status",
    "minimumColumnWidth": 200,
    "cardHeight": 200,
    "maximumCardHeight": 400,
    "maximumCardWidth": 450
  },
  "columns": [
    { "value": "open", "displayLabel": "Open", "headerColor": { "light": "#EDF0F6", "dark": "#37424D" } },
    { "value": "closed", "displayLabel": "Closed", "headerColor": { "light": "#E8F4FC", "dark": "#2D3B47" } }
  ],
  "cardFields": {
    "titleFieldName": "name",
    "fields": [
      { "position": 1, "fieldName": "code", "enabled": true, "styleId": "emphasis" },
      { "position": 2, "fieldName": "owner", "enabled": true, "styleId": "default" },
      { "position": 3, "fieldName": "unused", "enabled": false },
      { "position": 4, "fieldName": "due", "enabled": true, "styleId": "default" },
      { "position": 5, "fieldName": "notes", "enabled": true, "styleId": "multiline" }
    ]
  },
  "colorRules": {
    "cardBackground": {
      "priority": { "High": { "light": "#FEF2F2", "dark": "#3D2A2E" } }
    }
  }
}`
