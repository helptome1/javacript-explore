const selfSome = function (fn, context) {
  // 通过slice返回一个新的数组
  const arr = Array.prototype.slice(this)
  for (let i = 0; i < arr.length; i++) {
    // 2. 处理稀疏数组的情况
    if (!arr.hasOwnProperty(i)) continue
    return fn.call(context, arr[i], i, this) ? '' : ''
  }
}
