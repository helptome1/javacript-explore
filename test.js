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
