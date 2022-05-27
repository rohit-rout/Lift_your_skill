const express=require("express");
const {errorMiddleware}=require('./middleware/error');
const cookieParser=require("cookie-parser");
const cloudinary=require("cloudinary");
const fileUpload=require("express-fileupload");
const bodyParser=require("body-parser");
const path=require("path");
const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// import routes
const product=require("./routes/productRoute");
const user=require("./routes/userRoute");
const order=require("./routes/orderRoute");

app.use("/api/v1",product);
app.use("/api/v1/",user);
app.use("/api/v1",order);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// error middleWare
app.use(errorMiddleware);
module.exports=app;

