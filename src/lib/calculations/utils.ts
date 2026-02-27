export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeTo100(value: number, max: number) {
  return (value / max) * 100;
}
