const express=require("express");
const { newOrder,
        getSingleOrder,
        myOrders,
        getAllOrders, 
        updateOrderStatus,
        deleteOrder} = require("../controllers/orderController");
const {isAuthenticated,authenticateRoles}=require("../middleware/auth");
const router=express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);
router.route("/order/my").get(isAuthenticated,myOrders);
router.route("/admin/all/order").get(isAuthenticated,authenticateRoles("admin"),getAllOrders);
router.route("/admin/order/:id").get(isAuthenticated,authenticateRoles("admin"),getSingleOrder)
.put(isAuthenticated,authenticateRoles("admin"),updateOrderStatus)
.delete(isAuthenticated,authenticateRoles("admin"),deleteOrder);


module.exports=router;