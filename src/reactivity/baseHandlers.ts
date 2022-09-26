import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'
// 只创建一次
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target: any, key: any) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    } else if (key === ReactiveFlags.IS_READONLY) {
      return true
    }

    const res = Reflect.get(target, key)
    // 依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target: any, key: any, value: any) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)

    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target: any, key: any, value: any) {
    console.warn(`key ${key} set 失败 因为 target 是 readonly`)
    return true
  },
}
