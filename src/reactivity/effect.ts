import { extend } from "../shared"

class ReactiveEffect {
  private _fn: any
  deps = []
  public scheduler: Function | undefined
  active = true
  onStop?: () => void

  constructor(fn: any, scheduler: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this as any
    return this._fn()
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
}

const targetMap = new Map()
export function track(target: any, key: any) {
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

  if(!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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

let activeEffect: any
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
