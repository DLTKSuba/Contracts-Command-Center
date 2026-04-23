/** Position Costpoint Kanban card dropdowns with fixed coordinates so scroll/overflow parents cannot clip the menu. */

const GAP_PX = 4;
const MARGIN_PX = 8;

function readZDropdown(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--z-dropdown').trim();
  return v || '100';
}

export function syncKanbanCpFixedMenu(trigger: HTMLElement, menu: HTMLElement): void {
  const r = trigger.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.zIndex = readZDropdown();
  menu.style.marginTop = '0';
  menu.style.right = 'auto';
  menu.style.minWidth = `${Math.max(r.width, 10)}px`;
  menu.style.width = 'auto';
  menu.style.maxWidth = `min(${window.innerWidth - 2 * MARGIN_PX}px, 24rem)`;
  menu.style.left = `${r.left}px`;
  menu.style.top = `${r.bottom + GAP_PX}px`;

  const mr = menu.getBoundingClientRect();
  let top = r.bottom + GAP_PX;
  let left = r.right - mr.width;

  if (top + mr.height > window.innerHeight - MARGIN_PX) {
    const above = r.top - GAP_PX - mr.height;
    if (above >= MARGIN_PX) top = above;
  }
  if (left < MARGIN_PX) left = MARGIN_PX;
  if (left + mr.width > window.innerWidth - MARGIN_PX) {
    left = Math.max(MARGIN_PX, window.innerWidth - MARGIN_PX - mr.width);
  }

  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
}

export function clearKanbanCpFixedMenu(menu: HTMLElement): void {
  menu.style.removeProperty('position');
  menu.style.removeProperty('top');
  menu.style.removeProperty('left');
  menu.style.removeProperty('right');
  menu.style.removeProperty('bottom');
  menu.style.removeProperty('z-index');
  menu.style.removeProperty('margin-top');
  menu.style.removeProperty('min-width');
  menu.style.removeProperty('width');
  menu.style.removeProperty('max-width');
}

export function bindKanbanCpMenuScrollSync(): void {
  const w = window as Window & { __harmonyKanbanCpMenuScroll?: boolean };
  if (w.__harmonyKanbanCpMenuScroll) return;
  w.__harmonyKanbanCpMenuScroll = true;

  const syncAll = () => {
    document.querySelectorAll('.kanban-card-cp .dropdown.is-open').forEach((dd) => {
      const t = dd.querySelector('.dropdown__trigger');
      const m = dd.querySelector('.dropdown__menu');
      if (t instanceof HTMLElement && m instanceof HTMLElement) {
        syncKanbanCpFixedMenu(t, m);
      }
    });
  };

  window.addEventListener('scroll', syncAll, true);
  window.addEventListener('resize', syncAll);
}
