const express = require("express");
const router = express.Router();
var passport = require("passport");

const UserController = require("../controllers/users");
const authCheck = require("../helpers/passport/authCheck");

router.route("/").get(authCheck.authCheckAdmin,UserController.users);
router.route("/profile/:username").get(authCheck.authCheck,UserController.usersProfile);
router.route("/updateInfo").post(authCheck.authCheck,UserController.updateInfo);
router.route("/updateInfo/:id").post(authCheck.authCheck,UserController.updateInfo);
router.route("/removeUser/:id").post(authCheck.authCheck,UserController.removeUser);
router.route("/updatePassword").post(authCheck.authCheck,UserController.updatePassword);
router.route("/resetPassword/:id").post(authCheck.authCheck,UserController.resetPassword);
router.route("/updateProfilPhoto").post(authCheck.authCheck,UserController.updateProfilPhoto);
router.route("/userAdd").get(authCheck.authCheckAdmin,UserController.userAdd).post(authCheck.authCheckAdmin,UserController.postUserAdd);


module.exports = router;
