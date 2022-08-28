// ES5实现reduce方法

// reduce方法

Array.prototype.selfReduce = function (fn, initialValue) {
  let arr = Array.prototype.slice.call(this)
  let res = null
  let startIndex = 0
  // 如果initialValue为空
  if (!initialValue) {
    // 使用循环找到第一个非空的索引的元素和索引。
    for (let i = 0; i < arr.length; i++) {
      if (!arr.hasOwnProperty(i)) continue
      startIndex = i
      res = arr[i]
      break
    }
  } else {
    res = initialValue
  }

  // 注意这个i是从starIndex之后开始的
  for (let i = startIndex || 0; i < arr.length; i++) {
    // 跳过空单元的元素。
    if (!arr.hasOwnProperty(i)) continue
    // 把计算的值重新赋值给res
    res = fn.call(null, res, arr[i], i, this)
  }

  return res
}

Array.prototype.selfReduce ||
  Object.defineProperty(Array.prototype, 'selfReduce', {
    value: selfReduce,
    enumerable: false,
    configurable: true,
    writable: true
  })

let arr = [1, 2, 3, 4, 5]
console.log(
  arr.selfReduce((pre, cur) => {
    console.log('prev:', pre)
    return pre + cur
  })
)
