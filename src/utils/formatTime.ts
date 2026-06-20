export function formatRelativeTime(isoString: string): string {
  try {
    const target = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - target.getTime();

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    if (diff < minute) return '刚刚';
    if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)}小时前`;
    if (diff < month) return `${Math.floor(diff / day)}天前`;
    if (diff < year) return `${Math.floor(diff / month)}个月前`;
    return `${Math.floor(diff / year)}年前`;
  } catch {
    return isoString;
  }
}

export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function nowISO(): string {
  return new Date().toISOString();
}
