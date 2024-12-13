const express = require("express");
const { authenticateUser } = require("../middlewares/authMIddleware");
const { addReview, updateReview,deleteReview,viewReviews } = require("../controllers/review.controller");

const router = express.Router();

router.post("/", authenticateUser, addReview);
router.put("/:id", authenticateUser, updateReview);
router.delete('/:id',authenticateUser,deleteReview)
router.get('/:propertyId',viewReviews)

module.exports = router;