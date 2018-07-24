// 让bark变为只读属性
function readonly (target, key, descriptor) {
  descriptor.writeable = false
  return descriptor
}

class Dog {
  constructor (name, voice) {
    this.name = name
    this.voice = voice
  }
  @readonly
  bark () {
    return `${this.name} say ${this.voice}`
  }
}

let pig = new Dog('xiaohei', 'wangwang')
console.log(pig.bark())
