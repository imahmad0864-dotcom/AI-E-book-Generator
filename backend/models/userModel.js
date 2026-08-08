const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "password must be 8 characters long"],
        select: false
    }
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("users", userSchema);

module.exports = User;