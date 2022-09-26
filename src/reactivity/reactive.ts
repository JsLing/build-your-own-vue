import { mutableHandlers, readonlyHandlers } from './baseHandlers'

function createActiveObject(raw: any, baseHandlers: any) {
  return new Proxy(raw, baseHandlers)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__V_isReactive',
  IS_READONLY = '__V_isReadonly',
}

export function reactive(raw: any) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}
