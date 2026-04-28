function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function formatMeetTime(meetAt: string): string {
  const d = new Date(meetAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  );
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  if (dayDiff === 0) return `오늘 ${time}`;
  if (dayDiff === 1) return `내일 ${time}`;
  if (dayDiff === -1) return `어제 ${time}`;
  if (dayDiff > 1 && dayDiff <= 6) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${days[d.getDay()]}요일 ${time}`;
  }
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${time}`;
}
