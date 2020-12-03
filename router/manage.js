const express = require("express");
const { route } = require(".");
const router = express.Router();


const ManageController = require("../controllers/manage");
const AuthCheck = require("../helpers/passport/authCheck");


router.route("/manageHomework").get(AuthCheck.authCheckAdmin, ManageController.getManageHomeworkPage);
router.route("/addHomework").get(AuthCheck.authCheckAdmin, ManageController.getAddHomeworkPage)
                            .post(AuthCheck.authCheckAdmin, ManageController.postAddHomework);
router.route("/editHomework/:id").get(AuthCheck.authCheckAdmin, ManageController.getEditHomeworkPage)
                                .post(AuthCheck.authCheckAdmin, ManageController.postEditHomework);



router.route("/analysisUser").get(AuthCheck.authCheckAdmin, ManageController.getAnalysisUserPage);

router.route("/manageHomework/uploadDocumentHomework/:id").post([AuthCheck.authCheckAdmin], ManageController.uploadDocumentHomework);


module.exports = router;
