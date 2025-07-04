// js 实现函数重载   (TypeScript已经可以支持函数重载声明)    

/*
    函数链式调用实现函数重载
*/

function addMethod(object, name, fn) {
    let old = object[name]
    object[name] = function(){
        if(fn.length === arguments.length){
            console.log("this is arguments",arguments)
            return fn.apply(this,arguments)
        }else if(old){
            console.log("this is old",old)
            return old.apply(this,arguments)
        }else{
            throw new Error("No matching method found")
        }
    }
}


// examples
const user = {
    name : 'user',
    gender : 'male',
    age : 20
}

// 使用addMethod函数进行函数重载，相当于将各个函数链接在一起（类似链表）
addMethod(user,'getName', function(){                   // old = undefined
    console.log("user name is " + this.name)
})

addMethod(user,'getName', function(gender){             // old = function() {console.log("user name is " + this.name)}
    console.log("user name is " + this.name + " and gender is " + gender) 
})

addMethod(user, 'getName', function(gender,age){       // old = function(gender){console.log("user name is " + this.name + " and gender is " + gender)}
    console.log("user name is " + this.name + " and gender is " + gender + " and age is " + age)
})


// 每次调用getName时，都会从后往前寻找到参数个数匹配的函数
user.getName()         //先调用到 function(gender,age)，参数个数不匹配往回寻找到 function(gender)，参数个数仍不匹配，往回寻找到 function()，参数个数匹配，调用 function()
user.getName('male')   //先调用到 function(gender,age)，参数个数不匹配往回寻找到 function(gender)，参数个数匹配，调用 function(gender)
user.getName('male',20, false) //先调用到 function(gender,age)，参数个数匹配，调用 function(gender,age)

