// 新建 test.js

// 引入我们的 MyPromise.js
const MyPromise = require('./promise')
const promise = new MyPromise((resolve, reject) => {
  resolve('succ')
})

promise
  .then()
  .then()
  .then((value) => console.log(value))

// promise的静态调用。
MyPromise.resolve()
  .then(() => {
    console.log(0)
    return MyPromise.resolve(4)
  })
  .then((res) => {
    console.log(res)
  })
