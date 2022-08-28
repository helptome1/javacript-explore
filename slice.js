// slice方法的实现原理。
Array.prototype.slice2 = function (start, end) {
  var result = new Array()
  start = start || 0
  end = end || this.length // this指向调用的对象，当用了call后，能够改变this的指向，也就是指向传进来的对象，这是关键
  for (var i = start; i < end; i++) {
    result.push(this[i])
  }
  return result
}

console.log([1,2,3].slice2(1))