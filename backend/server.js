
const app=require("./app");
const connectDatabase=require('./config/database');
const cloudinary=require("cloudinary");

//config
if(process.env.NODE_ENV!=="PRODUCTION")
require("dotenv").config({path:"backend/config/config.env"});



process.on("uncaughtException",(err)=>{
    console.log(err.message);
    process.exit(1);
})


// connecting to the database
connectDatabase(); 

cloudinary.config({ 
    cloud_name: 'djjtp06xl', 
    api_key: '457491665775282', 
    api_secret: 's8l_yUVvD94hUiVnWJrqivU-1go' 
  });



 const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening on port ${process.env.PORT}`);
}) 



// unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(err.message);
    console.log("shutting down the server due to unhandled promise rejection");
      server.close(()=>{
          process.exit(1); 
      })
   
    
}) 



