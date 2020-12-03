const express = require("express");
const router = express.Router();
const passport = require("passport");

const IndexController = require("../controllers/index");
const authCheck = require("../helpers/passport/authCheck");

router.route("/").get(authCheck.authCheck, IndexController.getIndex);
//router.route("/").get(IndexController.getIndex);
router
  .route("/login")
  .get(IndexController.getLogin)
  .post(IndexController.postLogin);

router.route("/logout").get(authCheck.authCheck, IndexController.logout);
router.route("/settings").get(authCheck.authCheck, IndexController.settings);

module.exports = router;
