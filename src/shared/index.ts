export const extend = Object.assign

export const isObject = (val: any) => {
  return val !== null && typeof val === 'object'
}

export const isChange = (val: any, newVal: any) => !Object.is(val, newVal)
