const express = require("express");
const { signupUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// logi route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

module.exports = router;
