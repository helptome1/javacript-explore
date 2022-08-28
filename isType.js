const isType = (type) => (target) => `[object ${type}]` === Object.prototype.toString.call(target)

// const isType = (type) => {
//   return (target) => {
//      return `[object ${type}]` === Object.prototype.toString.call(target)
//   }
// }
// 注意selfIsArray = 一个函数，就是isType返回的这个函数。所以isType('Array')执行后
const selfIsArray = isType('Array')

Array.selfIsArray ||
  Object.defineProperty(Array, 'selfIsArray', {
    value: selfIsArray,
    enumerable: false,
    configurable: true,
    writable: true
  })

console.log(selfIsArray([])) // true
