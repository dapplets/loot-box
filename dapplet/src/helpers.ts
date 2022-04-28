import BigNumber from 'bignumber.js';

export function sum(...values: string[]): string {
  let _sum = new BigNumber('0');

  for (const v of values) {
    const _a = new BigNumber(_sum);
    const _b = new BigNumber(v);
    _sum = _a.plus(_b);
  }

  return _sum.toFixed();
}

export function lte(a: string, b: string): boolean {
  const _a = new BigNumber(a);
  const _b = new BigNumber(b);
  return _a.lte(_b);
}

export function gte(a: string, b: string): boolean {
  const _a = new BigNumber(a);
  const _b = new BigNumber(b);
  return _a.gte(_b);
}

export function equals(a: string, b: string): boolean {
  const _a = new BigNumber(a);
  const _b = new BigNumber(b);
  return _a.isEqualTo(_b);
}

export function toFixedString(a: string, fractionDigits: number): string {
  return Number(a).toFixed(fractionDigits);
}

export function getMilliseconds(seconds: number): number {
  return seconds * 1000;
}


// /**
//  * Decorator for async methods caching promises until it's not fulfilled.
//  * Prevents execution of multiple promises at the same time.
//  */
//  export function CacheMethod() {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const symbol = Symbol();
//     const originMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//       const me = this as any;
//       if (!me[symbol]) {
//         const result = originMethod.bind(me)(...args);
//         if (result instanceof Promise) {
//           me[symbol] = result;
//         } else {
//           throw new Error("CachePromise decorator must be applied on async method.");
//         }
//       }
//       return me[symbol];
//     }
//     return descriptor;
//   };
// }