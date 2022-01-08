const { User } = require('../models/user_model');
const jwt =require('jsonwebtoken');
require('dotenv').config();

exports.checkToken = async (req, res, next) => {
try{
    if(req.headers["x-access-token"]){
        // verify token
        const accessToken  = req.headers["x-access-token"];
        const {_id,email,exp} = jwt.verify(accessToken, process.env.DB_SECRET);
        /* in generate token we had 
        userObj = {_id:.......,email:....}
        jwt.sign(userObj,process.env.D_SECRET,( expiresIn:'20s'))
        */

            // console.log(_id);
            // console.log(email);
            // console.log(exp);

            res.locals.DogCat = await User.findById('61d8a497117092e2b3e8e0a1');

/// only changing the last digit gives no user
//61d8a497117092e2b3e8e0a8
// this gives no user : 61d8a497117092e2b3e8e0a7
// '_id' o "_idhshsh" don't give no user they give bad token 


        next();
    } else{
        next()
    }
} catch(error) {
   return res.status(401).json({error:"Bad token" , errors:error});
}
}

exports.checkLoggedIn = async (req,res,next)=>{
    const user = res.locals.DogCat
    if(!user) return res.status(401).json({error:"No user. Please register in"})

    req.user = user;
    next();
}

