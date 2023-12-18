const express = require("express");
const { signup, signin } = require("../user/user-controller");
const { signupValidator } = require("../middlewares/auth-validator");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({
    data: "user list"
  })
});

router.post("/signup", signupValidator, signup);
router.post("/signin", signupValidator, signin);

module.exports = router;
