const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username:{type:String,require:true,trim:true},
    email:{type:String,require:true,unique:true,  trim: true,lowercase: true},
    password:{type:String,require:true,minlength: 6,}

})

const User = mongoose.model('UserSchema',userSchema)
module.exports = User;