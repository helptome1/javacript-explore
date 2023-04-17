// 先定义三个常量表示状态，状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    // 初始化状态
    this.initValue()
    // 初始化this
    this.initBind()
    executor(this.resolve, this.reject)
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null // 终值
    this.PromiseState = 'pending' // 状态
    this.onFulfilledCallbacks = [] // 成功回调
    this.onRejectedCallbacks = [] // 失败回调
  }

  resolve(val) {
    if (this.PromiseState === PENDING) {
      this.PromiseState = FULFILLED
      this.PromiseResult = val
      // 3. 判断成功回调是否存在，如果存在就调用
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(val)
      }
    }
  }

  reject(reason) {
    if (this.PromiseState === PENDING) {
      this.PromiseState = REJECTED
      this.PromiseResult = reason
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => reason

    // 返回一个新的 Promise 对象，以便链式调用
    const thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromsie = (cb) => {
        // cb == res => new Promise((resolve, reject) => reject(2 * res))
        try {
          const x = cb(this.PromiseResult)
          if (x === thenPromise) {
            // 不能返回自身哦
            throw new Error('不能返回自身。。。')
          }
          if (x instanceof MyPromise) {
            // 如果返回值是Promise
            // 如果返回值是promise对象，返回值为成功，新promise就是成功
            // 如果返回值是promise对象，返回值为失败，新promise就是失败
            // 谁知道返回的promise是失败成功？只有then知道
            x.then(resolve, reject)
          } else {
            // 非Promise就直接成功
            resolve(x)
          }
        } catch {
          reject(e)
        }
      }

      if (this.PromiseState === FULFILLED) {
        resolvePromsie(onFulfilled)
      } else if (this.PromiseState === REJECTED) {
        resolvePromsie(onRejected)
      } else if (this.PromiseState === PENDING) {
        // 如果当前状态是 pending，状态改变时，将 onFulfilled 和 onRejected 函数存储起来
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })

    return thenPromise
  }
}

// const test3 = new Promise((resolve, reject) => {
//   resolve(100) // 输出 状态：成功 值： 200
//   // reject(100) // 输出 状态：成功 值：300
// }).then(res => 2 * res, err => 3 * err)
//   .then(res => console.log('成功', res), err => console.log('失败', err))


const test4 = new MyPromise((resolve, reject) => {
  resolve(100) // 输出 状态：失败 值：200
  // reject(100) // 输出 状态：成功 值：300
  // 这里可没搞反哦。真的搞懂了，就知道了为啥这里是反的
}).then(res => new MyPromise((resolve, reject) => reject(2 * res)), err => new Promise((resolve, reject) => resolve(3 * err)))
  .then(res => console.log('成功', res), err => console.log('失败', err))

