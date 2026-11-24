export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function ageFrom(iso: string, today = new Date()) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;
  let age = today.getFullYear() - year;
  const currentMonth = today.getMonth() + 1;
  if (currentMonth < month || (currentMonth === month && today.getDate() < day)) age -= 1;
  return age;
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}
