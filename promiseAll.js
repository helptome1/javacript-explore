// 实现一个promiseAll
// 1. Promise.all 的返回值是一个新的 Promise 实例。
// 2. Promise.all 接受一个可遍历的数据容器，容器中每个元素都应是 Promise 实例。咱就是说，假设这个容器就是数组。
// 3. 数组中每个 Promise 实例都成功时（由pendding状态转化为fulfilled状态），Promise.all 才成功。这些 Promise 实例所有的 resolve 结果会按照原来的顺序集合在一个数组中作为 Promise.all 的 resolve 的结果。
// 4. 数组中只要有一个 Promise 实例失败（由pendding状态转化为rejected状态），Promise.all 就失败。Promise.all 的 .catch() 会捕获到这个 reject。

// 测试用例
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("p1 延时3秒");
    resolve('p1 延时3秒')
  }, 3000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("p2 延时1秒");

    resolve('p2 延时1秒')
  }, 1000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("p3 延时2秒");

    resolve('p3 延时2秒')
  }, 2000)
})

const p4 = Promise.reject('p4 rejected')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p5 rejected 延时1.5秒')
  }, 1500)
})
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

// ------------------------ 实现promiseAll ----------
Promise.MyAll = function (promises) {
  let arr = []
  let count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      // 用resolve包裹一下，防止item不是promise
      Promise.resolve(item).then((res) => {
        arr[index] = res
        count++
        if (count === promises.length) resolve(arr)
      }, reject)
    })
  })
}
// 所有 Promsie 都成功
// Promise.MyAll([p1, p2, p3])
//   .then(res => console.log("p1,p2,p3 res", res))
//   .catch(err => console.log(err)) // 2秒后打印 [ 'p1', 'p2 延时一秒', 'p3 延时两秒' ]

// 一个 Promise 失败
// Promise.MyAll([p1, p2, p4])
//   .then((res) => console.log('p1,p2,p4', res))
//   .catch((err) => console.log('p1,p2,p4', err)) // p4 rejected

// Promise.MyAll([p1, p2, p5])
//   .then(res => console.log(res))
//   .catch(err => console.log("p1,p2,p5", err)) // 1.5秒后打印 p5 rejected 延时1.5秒

// 两个失败的 Promise
// Promise.MyAll([p1, p4, p5])
//   .then(res => console.log(res))
//   .catch(err => console.log("p1,p4,p5", err)) // p4 rejected

// ----------------------------- 实现promise.race ---------------
Promise.MyRace = function (promises) {
  return new Promise((resolve, reject) => {
    // 这里不需要使用索引，只要能循环出每一项就行
    for (const item of promises) {
      Promise.resolve(item).then(resolve, reject)
    }
  })
}

Promise.race([p1,p2,p3]).then(res=> {
  console.log(res)
})