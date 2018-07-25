// 修饰方法
class User {
  @readonly
  getName() {
    return 'Hello,World'
  }
} 

function readonly(target,key,descriptor) {
  descriptor.writable = false
  console.log(descriptor.value);
  
  descriptor.value = 'function(){console.log("Hello,Value")}'
  console.log(descriptor.value);

  return descriptor
}

let u = new User()
// u.getName = '123'
// u.getName()