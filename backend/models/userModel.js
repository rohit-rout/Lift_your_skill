const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email:{
       type: String,
       required:[true,"please enter your email"],
       unique:true,
       validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password should be more than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
        type:String,
        required:true
        },
        url:{
        type:String,
        required:true
        }

    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
       type:Date,
       default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    this.password=await bcrypt.hash(this.password,10);
   next();
})
userSchema.methods.comparePassword= async function(password){
  return await bcrypt.compare(password,this.password);
  
}
userSchema.methods.createJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE_TIME
    });   
}
userSchema.methods.resetPassword=function(){
const resetToken=crypto.randomBytes(20).toString("hex");

// update and create hash
this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetPasswordExpire=Date.now() +15*60*1000;
return resetToken;

}


module.exports=mongoose.model("users",userSchema);