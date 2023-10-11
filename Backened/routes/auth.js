const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "qwertyu";
//Route1. create a user using post /api/auth/createuser no login required
router.post(
  "/createuser",
  [
    //validations
    body("name", "Name must be greater than 3").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Min length should be 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    let success=false;
    //if all validations are right
    if (result.isEmpty()) {
      try {
        //check whether the email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({success, error: "Sorry a user with this email already exists" });
        }
        //if user not found create user
        success=true;
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });
        //payload of the returned token
        const data  = {
          user:{
            id:user.id
          }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        res.json({success,authToken});
      } catch (error) {
        //if any problem in creating user respond with error status 500
        console.error(error.message);
        res.status(500).send(success,"some error occured");
      }
    } else {
      //if validations contaians a error
      //if there are errors return the errorrs
      res.send({success, errors: result.array() });
    }
  }
);
//Route 2. Authenticate a user using post /api/auth/login no login required
router.post(
  "/login",
  [
    //validations
    body("email", "Enter a valid email").isEmail(),
    body("password", "Min length should be 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false;
    const result = validationResult(req);
    //if all validations are right
    if (!result.isEmpty()) {
      res.status(400).send({ success,errors: result.array() });
    }
    const {email,password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success,error:"Email not registered"});
      }
      //comparing password
      const passComp = await bcrypt.compare(password,user.password);
      if(!passComp){
        return res.status(400).json({success,error:"Incorrect password Please try again"});
      }
      const data  = {
        user:{
          id:user.id
        }
      }
      //verifying and extracting token
      const authToken = jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success,"Internal server error");
    }
    })
    //Route 3. fetch a user using post /api/auth/getuser login required
    router.post("/getuser",fetchuser, async (req, res) => {
      try {
          const userId = req.user.id;
          const user = await User.findById(userId).select("-password");
          res.send(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error"); 
      }
    })
module.exports = router;
