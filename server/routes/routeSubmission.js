const submissionController = require("../controllers/submissionController")
const router = require("express").Router()

router.get("/", submissionController.findAllSubmission)
router.get("/:id", submissionController.findOneSubmission)
router.post("/", submissionController.addOneSubmission)
router.get("/sumission-user/:id", submissionController.findSubmissionOfUser)

module.exports = router;