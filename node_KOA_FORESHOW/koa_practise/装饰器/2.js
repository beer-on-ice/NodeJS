// 修饰类

@setProp
class User {}

function setProp(target) {
  console.log(target);
  target.age = 30
}

console.log(User.age);

// 修饰类（参数）

@setProps(20)
class Users {}

function setProps(value) {
  return function(target) {
    target.age = value
  }
}

console.log(Users.age);
