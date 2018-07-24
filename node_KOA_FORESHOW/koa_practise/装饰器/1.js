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

// 让bark变为只读属性
function readonly (target, key, descriptor) {
  console.log(target);
  
  descriptor.writeable = false
  return descriptor
}

let pig = new Dog('xiaohei', 'wangwang')

pig.bark = '123'

console.log(pig.bark())
