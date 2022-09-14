// promise

// 先定义三个常量表示状态，状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // new MyPromise(executor)时会传入一个函数executor
  // executor接收两个函数，一个是成功的回调resolve, 一个是失败的回调reject
  constructor(executor) {
    // 1. executor 是一个执行器，进入会立即执行，
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象

  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 存储成功回调函数
  // onFulfilledCallback = null
  onFulfilledCallbacks = []
  // 存储失败回调函数
  // onRejectedCallback = null
  onRejectedCallbacks = []

  // 2. executor执行时把resolve传递过去，执行时传入参数value
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status == PENDING) {
      // 更改成功后的状态
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value

      // 3. 判断成功回调是否存在，如果存在就调用
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 更改失败后的状态
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason

      // reject里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  // 4. 当实例调用promise.then时执行函数。
  then(onFulfilled, onRejected) {
    // return一个新的promise，实现链式调用。
    const promise2 = new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        /**创建一个微任务等待 promise2 完成初始化, 以便判断then方法是否返回了自身。
         *  const p1 = promise.then(value => {
              console.log(value)
              return p1
            })
         */

        queueMicrotask(() => {
          // 获取成功回调函数的执行结果，并且把值返回
          const x = onFulfilled(this.value)
          // 传入 resolvePromise 集中处理
          // resolvePromise 集中处理，将 promise2 传入
          resolvePromise(promise2, x, resolve, reject)
        })
      } else if (this.status === REJECTED) {
        // 调用失败回调，并且把原因返回
        onRejected(this.reason)
      } else if (this.status === PENDING) {
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来。
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })

    return promise2
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  // 处理then方法中返回自身的bug
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  // 判断x是不是 MyPromise 实例对象,
  // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
  if (x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise
