import { isChange, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImp {
  private _value: any
  private _rawValue: any
  public dep: any
  public _v_isRef = true

  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep)
    }
    return this._value
  }

  set value(newValue) {
    if (isChange(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value: any) {
  return new RefImp(value)
}

export function isRef(ref: any) {
  return !!ref._v_isRef
}

export function unRef(ref: any) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRef: any) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    },
  })
}
