const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authMIddleware");
const {
  createProperty,
  updateProperty,
  deleteProperty,
  searchMyProperties,
  searchProperties,
  viewProperty,
} = require("../controllers/property.controller");



router.post("/", authenticateUser, createProperty);
router.put("/:id", authenticateUser, updateProperty);
router.get('/search',searchProperties)
router.get("/me",authenticateUser,searchMyProperties);
router.delete("/:id",authenticateUser,deleteProperty);
router.get("/:id",viewProperty);

module.exports = router;
