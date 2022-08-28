// 循环实现map
const selfMap = function (fn, context) {
  // 通过slice返回一个新的数组
  // 能将有length属性的对象转换为数组(特别。注意： 这个对象一定要有length属性)
  // 也就是说类数组也可以使用。
  let arr = Array.prototype.slice.call(this)
  let mappedArr = Array()
  for (let i = 0; i < arr.length; i++) {
    // 判断稀疏数组的情况
    if (!arr.hasOwnProperty(i)) continue
    mappedArr[i] = fn.call(context, arr[i], i, this)
  }
  return mappedArr
}


// reduce实现map
// 由于 reduce 会跳过空单元数组，所以这个 polyfill 无法处理空单元数组
const selfMap2 = function (fn, context) {
  // 把类数组转为数组
  let arr = Array.prototype.slice.call(this)
  return arr.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)]
  }, [])
}

// 把方法挂在到Array的Prototype上去。
Array.prototype.selfMap ||
  Object.defineProperty(Array.prototype, 'selfMap', {
    value: selfMap,
    enumerable: false,
    configurable: true,
    writable: true
  })
Array.prototype.selfMap2 ||
  Object.defineProperty(Array.prototype, 'selfMap2', {
    value: selfMap2,
    enumerable: false,
    configurable: true,
    writable: true
  })

let arr = ['z', 'h', , 'l']
// console.log(arr.selfMap((item) => item + '1'))
console.log(selfMap2.call({ 0: 'a', 1: 'b', length: 2 }, (item) => item + '1')) // map 方法同样支持类数组
