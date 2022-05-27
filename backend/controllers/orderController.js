const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const asynCatch=require("../middleware/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");



// create new order
exports.newOrder=asynCatch(async(req,res,next)=>{


   const order= await Order.create({...req.body,user:req.user.id})
    res.status(200).json({
        success:true,
        message:"order created",
        order
    })
})

// get Single Order    ---admin
exports.getSingleOrder = asynCatch(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user","name email ");
  
    if (!order) {
      return next(new ErrorHandler(404,"Order not found with this Id"));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });
// get logged in user details
  exports.myOrders = asynCatch(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    if(!orders)
    next(new ErrorHandler(404,"you have not ordered anything yet :("))
  
    res.status(200).json({
      success: true,
      orders,
    });
  });


  // get all Orders -- Admin
exports.getAllOrders = asynCatch(async (req, res, next) => {
    const orders = await Order.find();
  
    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });

  //update order status     ---admin
  exports.updateOrderStatus=asynCatch(async(req,res,next)=>{
      const order=await Order.findById(req.params.id);
      if (!order) 
        return next(new ErrorHandler(404,"Order not found with this Id"));

        if(order.orderStatus==="Delivered")
        return next(new ErrorHandler(400,"order is already delivered"));
         if(order.orderStatus==="processing")
        order.orderItems.forEach(async(ord)=>{await updateStocks(ord.product,ord.quantity)});


        order.orderStatus=req.body.status;
        if(req.body.status==="Delivered")
         order.deliveredAt=Date.now();
         
         await order.save({validateBeforeSave:false});

         res.status(200).json({
             success:true
         })
      
  })
  const updateStocks=asynCatch(async(productId,quantity)=>{
     const product=await  Product.findById(productId);

     product.stocks-=quantity;
     await product.save({validateBeforeSave:false});

  })

//   delete a order   ---admin
  exports.deleteOrder = asynCatch(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHander("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
  });