export function countdownParts(target, now = Date.now()) {
  const end = Date.parse(target);
  if (!Number.isFinite(end)) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const total = Math.max(0, Math.floor((end - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}
