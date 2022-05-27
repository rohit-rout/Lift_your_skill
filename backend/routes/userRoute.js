const express=require("express");
const router=express.Router();
const {isAuthenticated,authenticateRoles}=require("../middleware/auth");
const {registerUser,
       getAllUsers,
       loginUser,
       logoutUser,
       forgetPassword,
       updatePassword,
       updateUserRole,
       getSingleUser,
       deleteUser,
       updateProfile,
       meUser}=require("../controllers/userController");

router.route("/register").post(registerUser);
router.route("/admin/users").get(isAuthenticated,authenticateRoles("admin"),getAllUsers);
router.route("/login").post(loginUser);
router.route("/me").get(isAuthenticated,meUser);
// router.route("/forgetPassword").post(forgetPassword);  NOT WORKING RIGHT NOW,
router.route("/user/update/Password").put(isAuthenticated,updatePassword);
router.route("/user/update/profile").put(isAuthenticated,updateProfile);
router.route("/admin/user/:id").get(isAuthenticated,authenticateRoles("admin"),getSingleUser);
router.route("/admin/update/role/:id").put(isAuthenticated,authenticateRoles("admin"),updateUserRole);
router.route("/admin/delete/user/:id").delete(isAuthenticated,authenticateRoles("admin"),deleteUser);


router.route("/logout").get(logoutUser);
module.exports=router;