
const express = require("express");
const { authenticateUser } = require("../middlewares/authMIddleware");
const { currentUser, signup, login, logout,updateProfile, resetPassword } = require("../controllers/user.controller");

const router = express.Router();


router.get("/current-user",authenticateUser,currentUser)

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",authenticateUser,logout)

router.put('/profile',authenticateUser,updateProfile)
router.post('/reset-password',resetPassword)


module.exports = router;