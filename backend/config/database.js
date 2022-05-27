const mongoose=require("mongoose");

const database=()=>{mongoose.connect(process.env.DB_URL).then((data)=>{
   console.log("mongo db connected "+data.connection.host);
})
 
}
module.exports=database;