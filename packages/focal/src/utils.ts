import { equals as structEq } from './equals'
export { equals as structEq } from './equals'

export const DEV_ENV = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

export function setKey<T extends Object, K extends keyof T>(k: K, v: T[K], o: T): T {
  if (k in o && structEq(v, o[k])) {
    return o
  } else {
    // Faster to use Object.assign and friends in modern JS engines.
    // Object.create needed to preserve the instance's prototype.
    const copy: T = Object.create(o)
    Object.assign(copy, o)
    copy[k] = v
    return copy
  }
}

/**
 * 'Conserve' a value's identity if its structure doesn't change.
 */
function conserve<T>(x: T, y: T): T {
  return structEq(x, y) ? y : x
}

/**
 * Make a fold function's behaviour conservative in its input value's
 * identity.
 */
export function conservatively<T, U>(fn: ((y: T, c0: U) => U)) {
  return (y: T, c0: U) => conserve(fn(y, c0), c0)
}

export function findIndex<T>(xs: T[], p: (x: T) => boolean): number {
  for (let i = 0; i < xs.length; i++) {
    if (p(xs[i])) return i
  }
  return -1
}

export function warning(message: string) {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('[Focal]: ' + message) // tslint:disable-line no-console
  }

  // Throw a dummy error so it's possible to enter debugger with
  // 'break on all exceptions'.
  try { throw new Error(message) } catch (_) { /* no-op */ }
}

export type Option<T> = T | undefined
