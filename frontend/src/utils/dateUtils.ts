/**
 * Date formatting utilities for examination slot timings and schedules.
 */

/**
 * Formats a slot's date string or Date object into a readable display string
 * e.g., "Today, 21 Oct 2026", "Tomorrow, 22 Oct 2026", or "23 Oct 2026".
 */
export function formatSlotDate(dateVal?: string | Date | null): string {
  if (!dateVal) {
    const now = new Date();
    return `Today, ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  if (isToday) return `Today, ${formatted}`;
  if (isTomorrow) return `Tomorrow, ${formatted}`;
  return formatted;
}

/**
 * Compact date format e.g. "21 Oct" or "Today"
 */
export function formatSlotDateShort(dateVal?: string | Date | null): string {
  if (!dateVal) {
    return 'Today';
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  if (isToday) return `Today, ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  if (isTomorrow) return `Tomorrow, ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

