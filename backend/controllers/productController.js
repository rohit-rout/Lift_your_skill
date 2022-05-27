const Product=require("../models/productModel");
const asynCatch =require("../middleware/catchAsynErrors.js");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures =require("../utils/ApiFeatures");



// get all products
exports.getAllProducts=  asynCatch(async(req,res,next)=>{
    // return next(new ErrorHandler(500,"bad request"));
    const resultPerPage=4;
    const totalProducts=await Product.countDocuments();
    const apiFeature=new ApiFeatures(Product.find(),req.query);
    apiFeature.search();
    apiFeature.filter();  
    
    let products=await apiFeature.query;
    const filterProductsCount=products.length;
    apiFeature.pagination(resultPerPage);
    products=await apiFeature.query.clone();
     
  res.status(200).json(
      {success:"true",
      products,
      totalProducts,
       resultPerPage,
       filterProductsCount
      } 
  )
}
)
// create product ---Admin
exports.createProduct=asynCatch(async(req,res,next)=>{
    req.body.user=req.user.id;
   const  product=await Product.create(req.body);
    res.status(201).json({
        success:"true",
        product
    })
}
)
// get single product details
exports.singleProduct=asynCatch(async(req,res,next)=>{
    const id = (req.params.id).trim();
    const product=await Product.findById(id);

    if(!product)
    return next(new ErrorHandler(404,"product not found"))

    res.status(200).json({
        success:true,
        product
    })
})
// update product ---Admin
exports.updateProduct=asynCatch(async(req,res,next)=>{
    const id = (req.params.id).trim();
    let product=await Product.findById(id);
      
    if(!product)
    return next(new ErrorHandler(404,"product not found"));
     
     product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

    res.status(200).json({
        success:true,
        product

    })
    
})

// delete product --admin
exports.deleteProduct=asynCatch(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product)
    return next(new ErrorHandler(404,"product not found"));

    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
    
})
//create new review or update the review.
exports.createReview=asynCatch(async(req,res,next)=>{
    const {comment,rating,productId}=req.body;
    
    const product=await Product.findById(productId);
    
    if(!product)
    return next(new ErrorHandler(404,"no product found"));
     
    const review={
       user:req.user.id,
       name:req.user.name,
       rating:Number(rating),
       comment
    }
    

    const isReviewed= product.reviews.find(rev=>rev.user.toString()===req.user.id.toString())

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString()===req.user.id.toString())
           { rev.rating=rating,rev.comment=comment;}
            
        });
    }else{
        product.reviews.push(review);
        product.numberOfReviews=product.reviews.length;
    }
    
    let avg=0;
    product.reviews.forEach(rev=>avg+=rev.rating)

    product.ratings=avg/product.numberOfReviews;

    
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
        message:"review done successfully"
    })

})

//get all reviews of a particular product
exports.getReviews = asynCatch(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });


//   delete review of a particular product --- admin

exports.deleteReview= asynCatch(async(req,res,next)=>{
       const product=await Product.findById(req.query.productId);
       if(!product)
       return next(new ErrorHandler(404,"product not found"));

     const updatedReviews=  product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString());
     
     product.reviews=updatedReviews;
     product.numberOfReviews=updatedReviews.length;
     let avg=0;
     product.reviews.forEach(rev=>avg+=rev.rating)
    
     product.ratings=product.numberOfReviews?avg/product.numberOfReviews:0;

     await product.save({validateBeforeSave:false});

     res.status(200).json({
         success:true,
         message:"review deleted",
     })
})


