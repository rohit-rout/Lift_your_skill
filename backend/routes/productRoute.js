
const express=require("express");
const {isAuthenticated,authenticateRoles}=require("../middleware/auth");
const {getAllProducts,
      createProduct,
      deleteProduct,
      updateProduct,
      singleProduct,
      createReview,
      getReviews,
      deleteReview} = require("../controllers/productController");

const app=express();

const router=express.Router();

router.route('/products').get(getAllProducts);
router.route('/admin/product/new').post(isAuthenticated,authenticateRoles("admin"),createProduct);
router.route('/admin/product/:id').put(isAuthenticated,authenticateRoles("admin"),updateProduct).
delete(isAuthenticated,authenticateRoles("admin"),deleteProduct);
router.route('/product/review').post(isAuthenticated,createReview);
router.route('/singleProduct/:id').get(singleProduct);
router.route('/product/reviews/all').get(getReviews);
router.route('/product/review/remove').get(isAuthenticated,authenticateRoles("admin"),deleteReview);
module.exports=router;

