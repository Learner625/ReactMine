const express = require('express');
const { checkLoggedIn } = require('../../middleware/auth.js');
let router = express.Router();
require('dotenv').config();

const { User } = require('../../models/user_model.js');

router.route("/register").post(async (req,res)=>{
    try{
    /// 1 check if email
        if(await User.emailTaken(req.body.email)){
            return res.status(400).json({message:'Sorry email taken'
        })
    }
    /// 2 Creating the model ( hash password )
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });
    /// 3 generate token
        const token = user.generateToken()
        const doc = await user.save();
    /// send email

    /// save... send token with cookie
    res.cookie('x-access-token', token)
    .status(200).send(getUserProps(doc));
    } catch(error){
        res.status(400).json({message:'Error', error: error})
        console.log(error)
    }
})

router.route("/signin").post(async (req,res)=>{
    try{
    /// Find Email
    const user = await User.findOne({email:req.body.email});
    if(!user){return (res.status(400).json({message:"Bad email"}))}

    /// Compare Password
    const compare = await user.comparePassword(req.body.password);
    if(!compare){return (res.status(400).json({message:"Bad Password"}))}

    /// Geneate Token
    const token = user.generateToken();

    //  Send Response
    res.cookie("x-access-token", token).status(200).send(getUserProps(user));
    }
    catch(error){
        res.status(400).json({message:"Bad"});
    }
})

router.route("/profile").get(checkLoggedIn, async ( req,res )=>{
    console.log(req.user)
    res.status(200).send("ok");

})
const getUserProps = (userx) =>{
   return (
       { 
    _id: userx._id,
    email: userx.email,
    password: userx.password,
    role: userx.role,
    firstname: userx.firstname,
    lastname: userx.lastname,
    age: userx.age,
    date: userx.date,
    }
    )
}

module.exports = router;