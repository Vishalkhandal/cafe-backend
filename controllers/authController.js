const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateAccessToken } = require('../utils/jwt');

const registerUser = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User with this email already exists" });

        const hashedPassword = await hashPassword(password); 

        const user = new User({ name, email, password: hashedPassword, address });
        await user.save();

        res.status(201).json({
            msg: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' })
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const accessToken = generateAccessToken(user._id);
        console.log("accessToken is generated", accessToken);
        
        res.status(200).json({
            msg: 'Logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            accessToken: accessToken,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}