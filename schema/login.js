var mongoose=require('mongoose')

var userschema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

var login=mongoose.model('login',userschema)
module.exports=login