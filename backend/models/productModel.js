const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
  name:{
      type:String,
      required:[true,"please enter the name of the product"],
      trim:true
  },
  price:{
     type:Number,
     required:[true,"please enter the price"],
     maxlength:[8,"cannot exceed 8 characters"]
  },
  description:{
      type:String,
      required:[true,"please enter product description"]
  },
  ratings:{
      type:Number,
      default:0
  },
  catagory:{
      type:String,
      required:[true,"plase enter the catagory"]
  },
  images:[
      {
          public_id:{
           type:String,
           required:true,
          },
          url:{
            type:String,
            required:true,
          }
      }
  ],
  stocks:{
    type:Number,
    required:[true,"plese enter product stocks"],
    maxlength:[4,"cannot exceed 4 characters"],
    default:1
  },
   numberOfReviews:{
    type:Number,
    default:0
   },
   reviews:[
       {  
           user:{
               type:mongoose.Schema.Types.ObjectId,
               ref:"users",
               required:true,
           },
           name:{
               type:String,
               required:true,
           },
           rating:{
               type:Number,
               required:true,
           },
           comment:{
               type:String,
               required:true,
           }

       }
   ],
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required:true,
   },
   createdAt:{
       type:Date,
       default:Date.now,
   }

})


module.exports=mongoose.model('products',productSchema)