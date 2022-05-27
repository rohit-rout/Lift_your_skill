const asynCatch=require("../middleware/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");
const jwt=require('jsonwebtoken');
const User =require("../models/userModel");

exports.isAuthenticated=asynCatch(async(req,res,next)=>{
    const token=req.cookies.token;
    if(!token)
   return  next(new ErrorHandler(401,"please login before excessing this resource"));

   const decoded_data=  jwt.verify(token,process.env.JWT_SECRET_KEY);
//    console.log(decoded_data);
  
   const user=await User.findById(decoded_data.id);
   req.user=user;
    next();
})

exports.authenticateRoles=(...roles)=>{
     return async(req,res,next)=>{
         
         if(roles.includes(req.user.role))
         next();
         else
        return next(new ErrorHandler(401,"user is not allowed to this route"));
     }
}