/**
 * Re-export component types for library consumers.
 * Add type re-exports here when components export public APIs.
 */
export type { SortColumn, TableProps } from './Table'
export type {
  KanbanViewBoard,
  KanbanViewColumn,
  KanbanViewCardField,
  KanbanViewCardFields,
  KanbanViewColorRules,
  KanbanViewConfig,
  KanbanColorMode,
} from '../../types/kanban-view-config'
export { KANBAN_BOARD_DEFAULTS, EXAMPLE_KANBAN_VIEW_JSON } from '../../types/kanban-view-config'
