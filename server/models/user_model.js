
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();


const userSchema = mongoose.Schema
({
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        validate:(value)=>{
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
    }
},
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:['User', 'admin'],
        default:'User'
    },
    firstname:{
        type:String,
        maxLenngth: 100,
        trim: true,
    },
    lastname:{},
    age:{
        type: Number,
    },
    date:{
        type: Date,
        default: Date.now
    }
},{
    timestamps: true,
    collection: "player"
});

userSchema.pre('save',async function(next){
    let UUser = this;
    if (UUser.isModified('password')){
        /// hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(UUser.password, salt);
        UUser.password = hash;
    }
    next();
})

userSchema.methods.generateToken = function(){
    let user = this;
    const userObj = {_id:user._id.toHexString(),email:user.email}
    const token = jwt.sign(userObj,process.env.DB_SECRET,{expiresIn:'1d'})
    return token;
}
userSchema.methods.comparePassword =async function(candidatePassword){
    let user = this;
    const match = await bcrypt.compare(candidatePassword, user.password)
    return match;
}

userSchema.statics.emailTaken = async function (email){
    const yuser = await this.findOne({email});
    return !!yuser;
}


const User = mongoose.model('User', userSchema);
module.exports = { User }