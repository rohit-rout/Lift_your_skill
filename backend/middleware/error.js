
const ErrorHandler=require("../utils/errorHandler");
exports.errorMiddleware=(err,req,res,next)=>{
    
    err.message = err.message || "Internal Server Error";
      err.statusCode=err.statusCode|| 500;

      if(err.name==="CastError"){
          const message=`resource not found ${err.path}`
        err=  new ErrorHandler(err.statusCode,message);
      }

   // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(400,message);
  }

    
  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(400,message);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(400,message);
  }

      res.status(err.statusCode).json({
          success:"false",
          message:err.message
      });

};

