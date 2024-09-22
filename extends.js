// 1.组合式继承
// --------------------- 1.1 原型链继承 ----------------------
// 原型链继承缺点:
// 1. 每个实例对引用类型属性的修改都会被其他的实例共享
// 2. 在创建Child实例的时候，无法向Parent传参。这样就会使Child实例没法自定义自己的属性（名字）
// function Person() {
//   this.names = ['hzg']
// }

// Person.prototype.say = () => {
//   console.log('name is hzg');
// };

// function Child() {
// }

// Child.prototype = new Person();
// Child.prototype.constructor = Child

// var arzhChild2 = new Child()
// arzhChild2.names.push('arzh2')
// console.log(arzhChild2.names) //[ 'arzh', 'arzh1', 'arzh2' ]

// var arzhChild3 = new Child()
// arzhChild3.names.push('arzh3')
// console.log(arzhChild3.names) //[ 'arzh', 'arzh1', 'arzh2', 'arzh3' ]

// -------------------------- 1.2 构造函数继承 ----------------------------
function Parent() {
  this.names = ['arzh','arzh1']
}

function Child() {
  Parent.call(this)
}
// 优点:
// 1. 解决了每个实例对引用类型属性的修改都会被其他的实例共享的问题
// 2. 子类可以向父类传参
// 缺点:
// 1. 无法复用父类的公共函数
// 2. 每次子类构造实例都得执行一次父类函数

// --------------------------- 1.3 组合式继承 ---------------------------
// 优点:
// 1. 解决了每个实例对引用类型属性的修改都会被其他的实例共享的问题
// 2. 子类可以向父类传参
// 3. 可实现父类方法复用

// 缺点:
// 1. 需执行两次父类构造函数，第一次是Child.prototype = new Parent(),第二次是Parent.call(this, name)造成不必要的浪费

function Parent(name) {
  this.name = name
  this.body = ['foot','hand']
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

// 2. 寄生组合式继承
// 2.1 原型式继承
// 复制传入的对象到创建对象的原型上，从而实现继承
// 缺点: 同原型链继承一样，每个实例对引用类型属性的修改都会被其他的实例共享
function createObj(o) {
  function F(){}
  F.prototype = o;
  return new F();
}
var person = {
  name : 'arzh',
  body : ['foot','hand']
}
var person1 = createObj(person)
var person2 = createObj(person)

console.log(person1) //arzh
person1.body.push('head') 
console.log(person2) //[ 'foot', 'hand', 'head' ]

//