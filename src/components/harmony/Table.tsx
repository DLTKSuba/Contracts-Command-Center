import React, { type ReactNode, useState, useMemo } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Table.css'

export interface SortColumn {
  key: string
  label: string
  align?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
}

export interface TableProps {
  headerVariant?: 'gray' | 'white' | 'none'
  /** High-density Command Center table (grid, default striped, border selection). */
  variant?: 'default' | 'commandCenter'
  striped?: boolean
  reorderable?: boolean
  grouped?: boolean
  /**
   * When `grouped` is true, parent `data-row-id` values to start expanded (e.g. show child rows on first paint).
   * Matches the wrapper attribute `data-grouped-default-expanded` in Astro.
   */
  groupedDefaultExpandedRowIds?: string[]
  /**
   * With `onGroupedExpandedRowIdsChange`, grouped row expansion is controlled (e.g. wire Collapse/Expand all in the app).
   * Pass the current set of expanded parent `data-row-id` values; omit both for internal state.
   */
  groupedExpandedRowIds?: string[]
  onGroupedExpandedRowIdsChange?: (rowIds: string[]) => void
  className?: string
  filterBar?: ReactNode
  titleBarContent?: ReactNode
  titleBarIcons?: ReactNode
  actionBar?: ReactNode
  /** Toolbar above the table (e.g. Collapse / As of date) when `variant` is `commandCenter`. */
  commandCenterToolbar?: ReactNode
  /**
   * Docked panel beside the table (e.g. `CommandCenterPanel`). Renders in a grid so the panel top aligns
   * with the table header; the command center toolbar row sits above the table only.
   */
  commandCenterAside?: ReactNode
  header?: ReactNode
  body?: ReactNode
  sortColumns?: SortColumn[]
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc' | null
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void
  onFilterClick?: (columnKey: string) => void
  /** `data-row-id` on each body row. Used with `variant="commandCenter"` to toggle selection. */
  selectedRowId?: string | null
  onRowSelect?: (rowId: string | null) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export function Table({
  headerVariant = 'gray',
  variant = 'default',
  striped = false,
  reorderable = false,
  grouped = false,
  groupedDefaultExpandedRowIds,
  groupedExpandedRowIds,
  onGroupedExpandedRowIdsChange,
  className = '',
  filterBar,
  titleBarContent,
  titleBarIcons,
  actionBar,
  commandCenterToolbar,
  commandCenterAside,
  header,
  body,
  sortColumns,
  sortColumn = null,
  sortDirection = null,
  onSort,
  onFilterClick,
  selectedRowId = null,
  onRowSelect,
  onReorder,
}: TableProps): React.ReactElement {
  const isCommandCenter = variant === 'commandCenter'
  const hasFilterBar = filterBar != null
  const hasTitleBar = titleBarContent != null || titleBarIcons != null
  const hasActionBar = actionBar != null
  const hasCommandCenterToolbar = isCommandCenter && commandCenterToolbar != null
  const hasCommandCenterAside = isCommandCenter && commandCenterAside != null
  const useCommandCenterDock = isCommandCenter && hasCommandCenterAside
  const useSortHeader = sortColumns != null && sortColumns.length > 0
  const useCommandCenterHeader = isCommandCenter && useSortHeader
  const effectiveStriped = isCommandCenter ? striped !== false : striped

  const tableClasses = clsx(
    'table',
    isCommandCenter ? 'table--command-center' : `table--header-${headerVariant}`,
    effectiveStriped && 'table--striped',
    reorderable && 'table--reorderable',
    grouped && 'table--grouped',
    className
  )

  const wrapperClasses = clsx(
    'table-wrapper',
    isCommandCenter && 'table-wrapper--command-center',
    hasCommandCenterToolbar && 'table-wrapper--has-command-center-toolbar',
    hasCommandCenterAside && 'table-wrapper--has-command-center-aside'
  )

  const { reorderableRows, totalRows, groupedRows } = useMemo(() => {
    if (!body || !React.isValidElement(body)) {
      return { reorderableRows: [], totalRows: [], groupedRows: [] }
    }
    const children = React.Children.toArray((body as React.ReactElement).props?.children ?? [])
    const allRows = children.filter(
      (c): c is React.ReactElement => React.isValidElement(c) && (c as React.ReactElement).type === 'tr'
    )
    const totals = allRows.filter(
      (r) => (r.props?.className as string)?.includes?.('table-row--total')
    )
    const rows = allRows.filter(
      (r) => !(r.props?.className as string)?.includes?.('table-row--total')
    )
    return {
      reorderableRows: reorderable ? rows : [],
      totalRows: totals,
      groupedRows: grouped ? rows : [],
    }
  }, [reorderable, grouped, body])

  const [rowOrder, setRowOrder] = useState<number[]>(() =>
    reorderableRows.map((_, i) => i)
  )
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(groupedDefaultExpandedRowIds ?? [])
  )

  const isGroupedExpandControlled = Boolean(
    grouped && onGroupedExpandedRowIdsChange
  )
  const effectiveExpandedIds = useMemo(
    () =>
      isGroupedExpandControlled
        ? new Set(groupedExpandedRowIds ?? [])
        : expandedIds,
    [isGroupedExpandControlled, groupedExpandedRowIds, expandedIds]
  )

  React.useEffect(() => {
    setRowOrder(reorderableRows.map((_, i) => i))
  }, [reorderableRows.length])

  function getSortIcon(key: string) {
    if (sortColumn !== key) return 'chevron-up-down'
    return sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'
  }

  function getAriaSort(key: string): 'ascending' | 'descending' | undefined {
    if (sortColumn !== key) return undefined
    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  function getSortButtonLabel(key: string, label: string) {
    if (sortColumn !== key) return `Sort by ${label}`
    return `Sort by ${label} ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
  }

  function handleSortClick(columnKey: string) {
    if (!onSort) return
    const nextDirection: 'asc' | 'desc' =
      sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(columnKey, nextDirection)
  }

  function handleFilterClick(columnKey: string) {
    onFilterClick?.(columnKey)
  }

  const gripColumnHeader = reorderable ? (
    <th key="grip" className="table__grip-column" scope="col" aria-label="Reorder" />
  ) : null

  /** Default grouped tables: separate narrow expand column. Command Center + grouped: chevron is inside the Project ID cell. */
  const inlineGroupedExpand = grouped && isCommandCenter
  const expandColumnHeader = grouped && !inlineGroupedExpand ? (
    <th key="expand" className="table__expand-column" scope="col" aria-label="Expand" />
  ) : null

  const tableHeader =
    useCommandCenterHeader ? (
      <thead>
        <tr>
          {gripColumnHeader}
          {expandColumnHeader}
          {sortColumns!.map((col) => {
            const sortable = col.sortable !== false
            const filterable = col.filterable !== false
            return (
              <th
                key={col.key}
                scope="col"
                className={col.align === 'right' ? 'text-right' : 'text-left'}
                aria-sort={getAriaSort(col.key)}
              >
                <div className="table__cc-header">
                  <span className="table__cc-header-label">{col.label}</span>
                  <div className="table__cc-header-actions" role="group" aria-label={col.label}>
                    {sortable && (
                      <button
                        type="button"
                        className="table__cc-header-btn"
                        aria-label={getSortButtonLabel(col.key, col.label)}
                        onClick={() => handleSortClick(col.key)}
                      >
                        <Icon name={getSortIcon(col.key)} size="sm" />
                      </button>
                    )}
                    {filterable && (
                      <button
                        type="button"
                        className="table__cc-header-btn"
                        aria-label={`Filter ${col.label}`}
                        onClick={() => handleFilterClick(col.key)}
                      >
                        <Icon name="funnel" size="sm" />
                      </button>
                    )}
                  </div>
                </div>
              </th>
            )
          })}
        </tr>
      </thead>
    ) : useSortHeader ? (
      <thead>
        <tr>
          {gripColumnHeader}
          {expandColumnHeader}
          {sortColumns!.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={col.align === 'right' ? 'text-right' : 'text-left'}
              aria-sort={getAriaSort(col.key)}
            >
              <button
                type="button"
                className="table__sort-header"
                aria-label={getSortButtonLabel(col.key, col.label)}
                onClick={() => handleSortClick(col.key)}
              >
                {col.label}
                <Icon name={getSortIcon(col.key)} size="sm" />
              </button>
            </th>
          ))}
        </tr>
      </thead>
    ) : header != null ? (
      header
    ) : (
      <thead>
        <tr>
          {gripColumnHeader}
          {expandColumnHeader}
          <th scope="col">Name</th>
          <th scope="col">Status</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
    )

  function renderReorderableBody(): ReactNode {
    if (reorderableRows.length === 0) return body

    const handleDragStart = (index: number) => (e: React.DragEvent) => {
      setDraggedIndex(index)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
    }

    const handleDragEnd = () => {
      setDraggedIndex(null)
      setDragOverIndex(null)
    }

    const handleDragOver = (index: number) => (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDragOverIndex(index)
    }

    const handleDragLeave = () => {
      setDragOverIndex(null)
    }

    const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
      e.preventDefault()
      setDragOverIndex(null)
      if (draggedIndex === null || draggedIndex === toIndex) return
      const newOrder = [...rowOrder]
      const [movedRowIndex] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(toIndex, 0, movedRowIndex)
      setRowOrder(newOrder)
      onReorder?.(movedRowIndex, toIndex)
    }

    const orderedRows = rowOrder.map((orderIdx) => reorderableRows[orderIdx])
    const gripCell = (
      <td key="grip" className="table__grip-cell">
        <button
          type="button"
          className="table__grip-handle"
          aria-label="Drag to reorder"
        />
      </td>
    )

    return (
      <tbody>
        {orderedRows.map((row, displayIndex) => {
          const logicalIndex = rowOrder[displayIndex]
          const rowWithGrip = React.cloneElement(row, {
            key: row.key ?? logicalIndex,
            draggable: true,
            className: clsx(
              row.props?.className,
              draggedIndex === displayIndex && 'table-row--dragging',
              dragOverIndex === displayIndex && 'table-row--drag-over'
            ),
            onDragStart: handleDragStart(displayIndex),
            onDragEnd: handleDragEnd,
            onDragOver: handleDragOver(displayIndex),
            onDragLeave: handleDragLeave,
            onDrop: handleDrop(displayIndex),
          }, [gripCell, ...React.Children.toArray(row.props.children)])
          return rowWithGrip
        })}
        {totalRows.map((row, i) =>
          React.cloneElement(row, {
            key: row.key ?? `total-${i}`,
          }, [
            <td key="grip" className="table__grip-cell table__grip-cell--placeholder" aria-hidden />,
            ...React.Children.toArray(row.props.children),
          ])
        )}
      </tbody>
    )
  }

  const MAX_DEPTH = 4

  function getRowId(row: React.ReactElement): string | null {
    return (row.props as Record<string, unknown>)['data-row-id'] as string | null
  }
  function hasChildren(row: React.ReactElement): boolean {
    return !!(row.props as Record<string, unknown>)['data-has-children']
  }
  function getParentId(row: React.ReactElement): string | null {
    return (row.props as Record<string, unknown>)['data-parent-id'] as string | null
  }
  function getDepth(row: React.ReactElement): number {
    const d = parseInt(String((row.props as Record<string, unknown>)['data-depth'] || '0'), 10)
    return Math.min(Math.max(d, 0), MAX_DEPTH)
  }

  function isVisible(row: React.ReactElement, expIds: Set<string>): boolean {
    const parentId = getParentId(row)
    if (!parentId) return true
    if (!expIds.has(parentId)) return false
    const parentRow = groupedRows.find((r) => getRowId(r) === parentId)
    return parentRow ? isVisible(parentRow, expIds) : false
  }

  function renderGroupedBody(): ReactNode {
    if (groupedRows.length === 0) return body

    const toggleExpanded = (rowId: string) => {
      if (isGroupedExpandControlled) {
        const next = new Set(groupedExpandedRowIds ?? [])
        if (next.has(rowId)) next.delete(rowId)
        else next.add(rowId)
        onGroupedExpandedRowIdsChange?.(Array.from(next))
      } else {
        setExpandedIds((prev) => {
          const s = new Set(prev)
          if (s.has(rowId)) s.delete(rowId)
          else s.add(rowId)
          return s
        })
      }
    }

    const expandCell = (row: React.ReactElement) => {
      if (hasChildren(row)) {
        const rowId = getRowId(row)
        if (!rowId) return <td key="expand" className="table__expand-cell" />
        const isExpanded = effectiveExpandedIds.has(rowId)
        return (
          <td key="expand" className="table__expand-cell">
            <button
              type="button"
              className={clsx('table__expand-btn', isExpanded && 'table__expand-btn--expanded')}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              aria-expanded={isExpanded}
              onClick={() => toggleExpanded(rowId)}
            >
              <span className="table__expand-icon" aria-hidden />
            </button>
          </td>
        )
      }
      return <td key="expand" className="table__expand-cell" />
    }

    const expandCellPlaceholder = (
      <td key="expand" className="table__expand-cell table__expand-cell--placeholder" aria-hidden />
    )

    const applyCommandCenterSelect = isCommandCenter && onRowSelect

    function linkifyCommandCenterProjectId(
      firstCell: React.ReactElement<HTMLTableCellElement>
    ): ReactNode {
      const { children: raw } = firstCell.props
      if (raw == null) return null
      if (typeof raw === 'string' || typeof raw === 'number') {
        return (
          <a
            className="text-link"
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {raw}
          </a>
        )
      }
      if (React.isValidElement(raw) && raw.type === 'a') {
        const a = raw as React.ReactElement<{
          className?: string
          href?: string
          onClick?: (e: React.MouseEvent) => void
        }>
        return React.cloneElement(a, {
          className: clsx('text-link', a.props.className),
        })
      }
      return <span className="table__cc-project-id-text">{(raw as React.ReactNode)}</span>
    }

    function buildCommandCenterInlineProjectIdCell(
      firstCell: React.ReactElement,
      row: React.ReactElement
    ) {
      const rId = getRowId(row)
      const depth = getDepth(row)
      const isChild = getParentId(row) != null
      const fp = firstCell.props as {
        className?: string
        style?: React.CSSProperties
      }
      const existingStyle = (fp.style as Record<string, unknown>) ?? {}
      const canToggle = hasChildren(row) && rId != null
      const leftNode = isChild ? (
        <span className="table__cc-inline-expand-gutter" aria-hidden />
      ) : canToggle ? (
        <span className="table__cc-inline-expand">
          <button
            type="button"
            className={clsx('table__expand-btn', rId && effectiveExpandedIds.has(rId) && 'table__expand-btn--expanded')}
            aria-label={rId && effectiveExpandedIds.has(rId) ? 'Collapse row' : 'Expand row'}
            aria-expanded={rId != null && effectiveExpandedIds.has(rId)}
            onClick={rId ? () => toggleExpanded(rId) : undefined}
          >
            <span className="table__expand-icon" aria-hidden />
          </button>
        </span>
      ) : (
        <span className="table__cc-inline-expand" aria-hidden>
          <span className="table__expand-icon table__expand-icon--cc-leaf" />
        </span>
      )

      return React.cloneElement(
        firstCell,
        {
          className: clsx('table__cc-project-id-cell', fp.className),
          style: {
            ...existingStyle,
            ...(depth > 0
              ? { paddingLeft: `calc(var(--space-4) * ${depth} + var(--space-4))` }
              : {}),
          },
        } as React.TdHTMLAttributes<HTMLTableCellElement>,
        <div className="table__cc-project-id-inner">
          {leftNode}
          {linkifyCommandCenterProjectId(firstCell as React.ReactElement<HTMLTableCellElement>)}
        </div>
      )
    }

    function buildCommandCenterTotalFirstCell(firstCell: React.ReactElement) {
      const fp = firstCell.props as { className?: string; style?: object }
      return React.cloneElement(
        firstCell,
        {
          className: clsx('table__cc-project-id-cell', fp.className),
        } as React.TdHTMLAttributes<HTMLTableCellElement>,
        <div className="table__cc-project-id-inner">
          <span className="table__cc-inline-expand-gutter" aria-hidden />
          {linkifyCommandCenterProjectId(firstCell as React.ReactElement<HTMLTableCellElement>)}
        </div>
      )
    }

    return (
      <tbody>
        {groupedRows.map((row, i) => {
          const rowId = getRowId(row)
          const depth = getDepth(row)
          const visible = isVisible(row, effectiveExpandedIds)
          const cells = React.Children.toArray(row.props.children)
          const firstContentCell = cells[0]
          const existingStyle =
            firstContentCell && React.isValidElement(firstContentCell)
              ? ((firstContentCell as React.ReactElement).props?.style as Record<string, unknown>) ?? {}
              : {}
          const firstContentWithPadding =
            !inlineGroupedExpand && depth > 0 && firstContentCell && React.isValidElement(firstContentCell)
              ? React.cloneElement(firstContentCell as React.ReactElement, {
                  style: {
                    ...existingStyle,
                    paddingLeft: `calc(var(--space-4) * ${depth} + var(--space-4))`,
                  },
                })
              : firstContentCell
          const firstForInline =
            inlineGroupedExpand && firstContentCell && React.isValidElement(firstContentCell)
              ? buildCommandCenterInlineProjectIdCell(firstContentCell, row)
              : null
          const trChildren = inlineGroupedExpand
            ? firstForInline
              ? [firstForInline, ...cells.slice(1)]
              : cells
            : [expandCell(row), firstContentWithPadding, ...cells.slice(1)]
          const prevOnClick = (row.props as { onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void })
            .onClick
          const useCc = applyCommandCenterSelect && rowId != null
          return React.cloneElement(
            row,
            {
              key: row.key ?? rowId ?? i,
              style: { ...(row.props?.style as object), display: visible ? undefined : 'none' },
              onClick: useCc
                ? (e: React.MouseEvent<HTMLTableRowElement>) => {
                    prevOnClick?.(e)
                    if (e.defaultPrevented) return
                    const t = e.target as HTMLElement
                    if (t.closest('button, a, input, select, textarea, [data-cc-ignore]')) return
                    onRowSelect?.(rowId)
                  }
                : prevOnClick,
              className: clsx(
                (row.props as { className?: string }).className,
                useCc && rowId != null && selectedRowId === rowId && 'table-row--command-center-selected'
              ),
            } as React.HTMLAttributes<HTMLTableRowElement>,
            trChildren
          )
        })}
        {totalRows.map((row, i) => {
          if (inlineGroupedExpand) {
            const cells = React.Children.toArray(row.props.children) as React.ReactElement[]
            const [first, ...rest] = cells
            if (!first || !React.isValidElement(first)) {
              return React.cloneElement(row, { key: row.key ?? `total-${i}` }, cells)
            }
            return React.cloneElement(
              row,
              { key: row.key ?? `total-${i}` },
              [buildCommandCenterTotalFirstCell(first), ...rest]
            )
          }
          return React.cloneElement(
            row,
            { key: row.key ?? `total-${i}` },
            [expandCellPlaceholder, ...React.Children.toArray(row.props.children)]
          )
        })}
      </tbody>
    )
  }

  function renderCommandCenterInteractiveBody(): ReactNode {
    if (!isCommandCenter || !onRowSelect || !body || !React.isValidElement(body)) {
      return null
    }
    if ((body as React.ReactElement).type !== 'tbody') {
      return null
    }
    const rows = React.Children.toArray((body as React.ReactElement).props.children) as React.ReactElement[]
    return (
      <tbody>
        {rows.map((row, i) => {
          if (!React.isValidElement(row) || row.type !== 'tr') return row
          const id = (row.props as { 'data-row-id'?: string })['data-row-id']
          const isSel = id != null && id === selectedRowId
          const prevOnClick = (row.props as { onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void })
            .onClick
          return React.cloneElement(
            row,
            {
              key: row.key ?? i,
              onClick: (e: React.MouseEvent<HTMLTableRowElement>) => {
                prevOnClick?.(e)
                if (e.defaultPrevented) return
                const t = e.target as HTMLElement
                if (t.closest('button, a, input, select, textarea, [data-cc-ignore]')) return
                if (id != null) onRowSelect(id)
              },
              className: clsx(
                (row.props as { className?: string }).className,
                isSel && 'table-row--command-center-selected'
              ),
            } as React.HTMLAttributes<HTMLTableRowElement>
          )
        })}
      </tbody>
    )
  }

  const bodyContent = (() => {
    if (reorderable && reorderableRows.length > 0) {
      return renderReorderableBody()
    }
    if (grouped && groupedRows.length > 0) {
      return renderGroupedBody()
    }
    const ccBody = renderCommandCenterInteractiveBody()
    if (ccBody != null) {
      return ccBody
    }
    return body ?? (
      <tbody>
        <tr>
          <td>Project A</td>
          <td>Active</td>
          <td>Feb 10, 2025</td>
        </tr>
        <tr>
          <td>Project B</td>
          <td>Completed</td>
          <td>Feb 8, 2025</td>
        </tr>
        <tr>
          <td>Project C</td>
          <td>Draft</td>
          <td>Feb 12, 2025</td>
        </tr>
      </tbody>
    )
  })()

  const mainInner = (
    <>
      {hasFilterBar && <div className="table__filter-bar">{filterBar}</div>}
      {hasTitleBar && (
        <div className="table__title-bar">
          <div className="table__title-bar-content">
            {titleBarContent}
            {titleBarIcons != null && <div className="table__title-bar-icons">{titleBarIcons}</div>}
          </div>
        </div>
      )}
      {hasActionBar && <div className="table__action-bar">{actionBar}</div>}
      <table className={tableClasses}>
        {tableHeader}
        {bodyContent}
      </table>
    </>
  )

  return (
    <div className={wrapperClasses} data-table-variant={isCommandCenter ? 'commandCenter' : undefined}>
      {useCommandCenterDock ? (
        <div
          className={clsx(
            'command-center-canvas',
            hasCommandCenterToolbar ? 'command-center-canvas--with-toolbar' : 'command-center-canvas--no-toolbar'
          )}
        >
          {hasCommandCenterToolbar && (
            <>
              <div className="command-center-canvas__toolbar">
                <div className="table__command-center-toolbar">{commandCenterToolbar}</div>
              </div>
              <div className="command-center-canvas__spacer" aria-hidden="true" />
            </>
          )}
          <div className="command-center-canvas__main">{mainInner}</div>
          <div className="command-center-canvas__aside">{commandCenterAside}</div>
        </div>
      ) : (
        <>
          {hasCommandCenterToolbar && (
            <div className="table__command-center-toolbar">{commandCenterToolbar}</div>
          )}
          {mainInner}
        </>
      )}
    </div>
  )
}
