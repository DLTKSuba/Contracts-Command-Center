import React, { type ReactNode, useState, useMemo } from 'react'
import clsx from 'clsx'
import { Icon } from './Icon'
import './Table.css'

export interface SortColumn {
  key: string
  label: string
  align?: 'left' | 'right'
}

export interface TableProps {
  headerVariant?: 'gray' | 'white' | 'none'
  striped?: boolean
  reorderable?: boolean
  grouped?: boolean
  className?: string
  filterBar?: ReactNode
  titleBarContent?: ReactNode
  titleBarIcons?: ReactNode
  actionBar?: ReactNode
  header?: ReactNode
  body?: ReactNode
  sortColumns?: SortColumn[]
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc' | null
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export function Table({
  headerVariant = 'gray',
  striped = false,
  reorderable = false,
  grouped = false,
  className = '',
  filterBar,
  titleBarContent,
  titleBarIcons,
  actionBar,
  header,
  body,
  sortColumns,
  sortColumn = null,
  sortDirection = null,
  onSort,
  onReorder,
}: TableProps): React.ReactElement {
  const hasFilterBar = filterBar != null
  const hasTitleBar = titleBarContent != null || titleBarIcons != null
  const hasActionBar = actionBar != null
  const useSortHeader = sortColumns != null && sortColumns.length > 0

  const tableClasses = clsx(
    'table',
    `table--header-${headerVariant}`,
    striped && 'table--striped',
    reorderable && 'table--reorderable',
    grouped && 'table--grouped',
    className
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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

  const gripColumnHeader = reorderable ? (
    <th key="grip" className="table__grip-column" scope="col" aria-label="Reorder" />
  ) : null

  const expandColumnHeader = grouped ? (
    <th key="expand" className="table__expand-column" scope="col" aria-label="Expand" />
  ) : null

  const tableHeader =
    useSortHeader ? (
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
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(rowId)) next.delete(rowId)
        else next.add(rowId)
        return next
      })
    }

    const expandCell = (row: React.ReactElement) => {
      if (hasChildren(row)) {
        const rowId = getRowId(row)
        if (!rowId) return <td key="expand" className="table__expand-cell" />
        const isExpanded = expandedIds.has(rowId)
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

    return (
      <tbody>
        {groupedRows.map((row, i) => {
          const rowId = getRowId(row)
          const depth = getDepth(row)
          const visible = isVisible(row, expandedIds)
          const cells = React.Children.toArray(row.props.children)
          const firstContentCell = cells[0]
          const existingStyle =
            firstContentCell && React.isValidElement(firstContentCell)
              ? ((firstContentCell as React.ReactElement).props?.style as Record<string, unknown>) ?? {}
              : {}
          const firstContentWithPadding =
            depth > 0 && firstContentCell && React.isValidElement(firstContentCell)
              ? React.cloneElement(firstContentCell as React.ReactElement, {
                  style: {
                    ...existingStyle,
                    paddingLeft: `calc(var(--space-4) * ${depth} + var(--space-4))`,
                  },
                })
              : firstContentCell
          const contentCells = [
            firstContentWithPadding,
            ...cells.slice(1),
          ]
          return React.cloneElement(row, {
            key: row.key ?? rowId ?? i,
            style: { ...(row.props?.style as object), display: visible ? undefined : 'none' },
          }, [expandCell(row), ...contentCells])
        })}
        {totalRows.map((row, i) =>
          React.cloneElement(row, {
            key: row.key ?? `total-${i}`,
          }, [expandCellPlaceholder, ...React.Children.toArray(row.props.children)])
        )}
      </tbody>
    )
  }

  return (
    <div className="table-wrapper">
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
        {reorderable && reorderableRows.length > 0
          ? renderReorderableBody()
          : grouped && groupedRows.length > 0
            ? renderGroupedBody()
            : body ?? (
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
            )}
      </table>
    </div>
  )
}
