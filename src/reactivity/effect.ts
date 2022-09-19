class ReactiveEffect {
  private _fn: any

  constructor(fn: any) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new Map()
export function tarck(target: any, key: any) {
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

  dep.add(activeEffect)
}

export function trigger(target:any, key:any) {
  const depMap = targetMap.get(target)
  const dep = depMap.get(key)

  for (const effect of dep) {
    effect.run()
  }
}

let activeEffect: any
export function effect(fn: any) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
