import { extend } from '../shared'

let activeEffect: any
let shouldTrack: any

class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  deps = []
  active = true // stop 状态
  onStop?: () => void

  constructor(fn: any, scheduler: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this as any

    const result = this._fn()

    shouldTrack = false

    return result
  }

  stop() {
    if (this.active) {
      clearupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function clearupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new Map()
export function track(target: any, key: any) {
  if (!isTracking()) return

  // target -> key -> dep
  let depMap = targetMap.get(target)
  if (!depMap) {
    depMap = new Map()
    targetMap.set(target, depMap)
  }

  let dep = depMap.get(key)
  if (!dep) {
    dep = new Set()
    depMap.set(key, dep)
  }

  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target: any, key: any) {
  const depMap = targetMap.get(target)
  const dep = depMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn: any, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)

  _effect.run()
  const runner: any = _effect.run.bind(_effect)

  runner.effect = _effect

  return runner
}

export function stop(runner: any) {
  runner.effect.stop()
}
