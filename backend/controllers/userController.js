const User = require("../models/userModel");
const asynCatch = require("../middleware/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const validator = require("validator");
const cloudinary = require("cloudinary");

//register user
exports.registerUser = asynCatch(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  req.body.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
  const user = await User.create(req.body);

  sendToken(user, res, 201);
});



//login user
exports.loginUser = asynCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler(401, "Please Enter Email & Password"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler(401, "wrong email id and password"));

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return next(new ErrorHandler(401, "wrong email id and password"));

  sendToken(user, res, 200);
});

// Logout User
exports.logoutUser = asynCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// my details
exports.meUser = asynCatch((req, res, next) => {
  const user = req.user;
  if (!user) {
    next(new ErrorHandler(404, "please login"));
  }

  res.status(200).json({
    success: true,
    user
  });
})
// change user password
exports.updatePassword = asynCatch(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const isMatched = await user.comparePassword(oldPassword);

  if (newPassword != confirmPassword)
    return next(new ErrorHandler(400, "confirm password does not matched"));
  if (!isMatched)
    return next(new ErrorHandler(400, "old password is incorrect"));
  if (newPassword.length < 8)
    return next(
      new ErrorHandler(400, "please enter password more than7 character")
    );
  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  sendToken(user, res, 200);
});

// update user profile

exports.updateProfile = asynCatch(async (req, res, next) => {
  if (!validator.isEmail(req.body.email))
    return next(new ErrorHandler(404, "this is not a valid email id"));
    if(!req.user)
    return next(new ErrorHandler(404,"please login "))


  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    user,
    success: true,
  });
});

// get all users --- admin
exports.getAllUsers = asynCatch(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user,
  });
});

// Get single user ---admin
exports.getSingleUser = asynCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorHandler(400, `User does not exist with Id: ${req.params.id}`)
    );

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role  --- admin

exports.updateUserRole = asynCatch(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(400, `user not found with id :${req.params.id}`)
    );

  user.role = role;

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    user,
  });
});
// delete a user ---admin
exports.deleteUser = asynCatch(async (req, res, next) => {
  const id = req.params.id.trim();
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler(400, `User does not exist with Id: ${id}`));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// forgot password     NOT  WORKING RIGHT  NOW
// exports.forgetPassword=asynCatch(async(req,res,next)=>{
//     const {email}=req.body;
//     const user=await User.findOne({email}).select("+password");

//     if(!user)
//     return next(404,"user not found");

//    const token= user.resetPassword();
//    await user.save({validateBeforeSave:false});
//    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${token}`;

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
//   console.log("working till here");
//   try{
//        await sendEmail({
//          email:user.email,
//          subject:"Ecommerce password recovery",
//          message
//        })
//        res.status(200).json({
//          success:true,
//          message:"mail sent successfully"
//        })
//     }
//     catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;

//       await user.save({ validateBeforeSave: false });

//       return next(new ErrorHandler(500,error.message));
//     }
// })
