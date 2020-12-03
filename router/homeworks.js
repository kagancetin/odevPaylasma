const express = require("express");
const { route } = require(".");
const router = express.Router();

const HomeworkController = require("../controllers/homeworks");
const authCheck = require("../helpers/passport/authCheck");

router.route("/").get(authCheck.authCheck, HomeworkController.getHomeworksPage);
router.route("/downloadDocumentHomework/:id").post(authCheck.authCheck, HomeworkController.downloadDocumentHomework);
router.route("/completeHomework/:id").post(authCheck.authCheck, HomeworkController.completeHomework);
module.exports = router;