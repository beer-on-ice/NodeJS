
// 让bark变为只读属性
function readonly (target, key, descriptor) {
  console.log(target);
  descriptor.writable = false
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

pig.bark = '123'

console.log(pig.bark())
