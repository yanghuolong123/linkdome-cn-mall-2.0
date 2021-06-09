export const numberFormat = (val) => {
  if (typeof (val) === 'number') {
    return val.toLocaleString()
  } else return val
}
