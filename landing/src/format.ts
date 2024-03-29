// based on https://github.com/near/near-api-js/blob/6e36ba2c3eb896cd72b5da8690d703cc5b70f693/src/utils/format.ts

import { BN } from './bn.js'

/**
 * Exponent for calculating how many indivisible units are there in one NEAR. See {@link NEAR_NOMINATION}.
 */
export const NEAR_NOMINATION_EXP = 24

/**
 * Number of indivisible units in one NEAR. Derived from {@link NEAR_NOMINATION_EXP}.
 */
export const NEAR_NOMINATION = new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10))

// Pre-calculate offests used for rounding to different number of digits
const ROUNDING_OFFSETS: BN[] = []
const BN10 = new BN(10)
for (let i = 0, offset = new BN(5); i < NEAR_NOMINATION_EXP; i++, offset = offset.mul(BN10)) {
  ROUNDING_OFFSETS[i] = offset
}

/**
 * Convert account balance value from internal indivisible units to NEAR. 1 NEAR is defined by {@link NEAR_NOMINATION}.
 * Effectively this divides given amount by {@link NEAR_NOMINATION}.
 *
 * @param balance decimal string representing balance in smallest non-divisible NEAR units (as specified by {@link NEAR_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in Ⓝ
 */
export function formatNearAmount(balance: string, decimals: number = NEAR_NOMINATION_EXP): string {
  const balanceBN = new BN(balance, 10)
  //   if (fracDigits !== NEAR_NOMINATION_EXP) {
  //     // Adjust balance for rounding at given number of digits
  //     const roundingExp = NEAR_NOMINATION_EXP - fracDigits - 1;
  //     if (roundingExp > 0) {
  //       balanceBN.iadd(ROUNDING_OFFSETS[roundingExp]);
  //     }
  //   }

  balance = balanceBN.toString() as string
  const wholeStr = balance.substring(0, balance.length - decimals) || '0'
  const fractionStr = balance
    .substring(balance.length - decimals)
    .padStart(decimals, '0')
    .substring(0, decimals)

  return trimTrailingZeroes(`${formatWithCommas(wholeStr)}.${fractionStr}`)
}

/**
 * Convert human readable NEAR amount to internal indivisible units.
 * Effectively this multiplies given amount by {@link NEAR_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in NEAR.
 * @returns The parsed yoctoⓃ amount or null if no amount was passed in
 */
export function parseNearAmount(
  amt?: string,
  decimals: number = NEAR_NOMINATION_EXP
): string | null {
  if (!amt) {
    return null
  }
  amt = cleanupAmount(amt)
  const split = amt.split('.')
  const wholePart = split[0]
  const fracPart = split[1] || ''
  if (split.length > 2 || fracPart.length > decimals) {
    throw new Error(`Cannot parse '${amt}' as NEAR amount`)
  }
  return trimLeadingZeroes(wholePart + fracPart.padEnd(decimals, '0'))
}

/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
function cleanupAmount(amount: string): string {
  return amount.replace(/,/g, '').trim()
}

/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value: string): string {
  return value.replace(/\.?0*$/, '')
}

/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
function trimLeadingZeroes(value: string): string {
  value = value.replace(/^0+/, '')
  if (value === '') {
    return '0'
  }
  return value
}

/**
 * Returns a human-readable value with commas
 * @param value A value that may not contain commas
 * @returns string A value with commas
 */
function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2')
  }
  return value
}
