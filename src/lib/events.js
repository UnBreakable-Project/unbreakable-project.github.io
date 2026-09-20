export function eventIsUpcoming(date, now = new Date()) {
  if (!date) return false;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return date >= today;
}

export function formatEventDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
