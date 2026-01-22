import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function _instanceof(instance: object, constructor: (...args: any[]) => any): boolean {
  if (typeof instance !== 'object' || instance === null) return false
  let proto = Object.getPrototypeOf(instance)
  while (proto) {
    if (proto === constructor.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

export function myNew(constructor: (...args: any[]) => any, ...args: any[]) {
  const newObj = Object.create(constructor.prototype)
  const result = constructor.apply(newObj, args)
  return typeof result === 'object' && result !== null ? result : newObj
}
