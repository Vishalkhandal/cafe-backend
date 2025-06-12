const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "7d" }
    );
};

// userSchema.methods.verifyToken = function (token) {
//     return jwt.verify(
//         token,   
//         process.env.JWT_SECRET || "secret_key",
//         (error, decodedData) => {
//             if (error) {
//                 console.error('Token verification failed:', error.message);
//             } else {
//                 console.log('Decoded user data:', decodedData);
//             }
//         }
//     )
// }

userSchema.statics.verifyToken = function (token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "secret_key");
    } catch (error) {
        throw new Error("Token verification failed");
    }
};


module.exports = mongoose.model("User", userSchema);
