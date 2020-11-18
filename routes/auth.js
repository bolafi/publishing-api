const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth");

const {
  register,
  login,
  logout,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
