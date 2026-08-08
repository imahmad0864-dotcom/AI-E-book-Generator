const User = require('../models/userModel.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign-up controller
const signup = async (req,res) => {
    // taking email password and name
    const {name, email, password} = req.body;

    // checkomg if they are filled
    if(!name || !email || !password) {
        return res.send("email,password and name are required").status(400);
    };

    // creating a user
    const user = await User.create({name, email, password});
    return res.json({
        success: true,
        message: "created successfully"
    }).status(200);
};

// login controller
const login = async (req,res) => {

    // takimg email password from req
    const {email, password} = req.body;

    // checking email, password
    if(!email || !password) {
        return res.send("email and password are required").status(400);
    };

    // checking if user exist
    const user = await User.findOne({email: email}).select('+password');
    if(!user){
        return res.send("user not found").status(400);
    };

    // matching passsword
    const hashedpassword = user.password;
    const isMatched = await bcrypt.compare(password, hashedpassword);
    if(!isMatched) {
        return res.send("password does not match").status(400);
    };

    // generate jwt token
    const payload = {id: user.id, name: user.name};
    const token = jwt.sign(payload,process.env.JWT_SECRET_TOKEN,{expiresIn: '1h'});
    return res.json({
        success: true,
        token: token
    }).status(200);
};

module.exports = { signup, login };