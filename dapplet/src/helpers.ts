import BigNumber from 'bignumber.js'

export function sum(...values: string[]): string {
  let _sum = new BigNumber('0')

  for (const v of values) {
    const _a = new BigNumber(_sum)
    const _b = new BigNumber(v)
    _sum = _a.plus(_b)
  }

  return _sum.toFixed()
}

export function sub(a: string, b: string): string {
  return new BigNumber(a).minus(new BigNumber(b)).toFixed()
}

export function div(a: string, b: string): string {
  return new BigNumber(a).div(new BigNumber(b)).toFixed()
}

export function mul(a: string, b: string): string {
  return new BigNumber(a).multipliedBy(new BigNumber(b)).toFixed()
}

export function lte(a: string, b: string): boolean {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.lte(_b)
}

export function gte(a: string, b: string): boolean {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.gte(_b)
}

export function equals(a: string, b: string): boolean {
  const _a = new BigNumber(a)
  const _b = new BigNumber(b)
  return _a.isEqualTo(_b)
}

export function toFixedString(a: string, fractionDigits: number): string {
  return Number(a).toFixed(fractionDigits)
}

export function getMilliseconds(seconds: number): number {
  return seconds * 1000
}

export function groupBy<T>(xs: T[], key: string): { [group_key: string]: T[] } {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export function toPrecision(value: string, precision: number): string {
  return new BigNumber(value).toPrecision(precision)
}

export function zerofyEmptyString(value: string): string {
  return value === '' ? '0' : value
}
