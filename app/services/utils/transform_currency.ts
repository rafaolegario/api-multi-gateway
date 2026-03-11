export function toCents(value: number): number {
  return Math.round(value * 100)
}

export function fromCents(valueInCents: number): number {
  return valueInCents / 100
}
