const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken')
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshTokenv } = require('../utils/jwt');

const registerUser = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await hashPassword(password); // <-- Rename variable

        const user = new User({ name, email, password: hashedPassword, address });
        await user.save();

        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Parse REFRESH_TOKEN_EXPIRATION_TIME from env
        let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days
        const exp = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
        if (exp) {
            const match = exp.match(/^(\d+)([dh])$/i);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                if (unit === 'd') {
                    expiresAt = new Date(Date.now() + value * 24 * 60 * 60 * 1000);
                } else if (unit === 'h') {
                    expiresAt = new Date(Date.now() + value * 60 * 60 * 1000);
                }
            }
        }

        const refreshTokenDoc = new RefreshToken({
            user: user._id,
            token: newRefreshToken,
            expiresAt,
        });

        await refreshTokenDoc.save();

        res.status(201).json({
            msg: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                password: user.password
            },
            accessToken,
            refreshToken: newRefreshToken
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
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Parse REFRESH_TOKEN_EXPIRATION_TIME from env
        let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days
        const exp = process.env.REFRESH_TOKEN_EXPIRATION_TIME;
        if (exp) {
            const match = exp.match(/^(\d+)([dh])$/i);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                if (unit === 'd') {
                    expiresAt = new Date(Date.now() + value * 24 * 60 * 60 * 1000);
                } else if (unit === 'h') {
                    expiresAt = new Date(Date.now() + value * 60 * 60 * 1000);
                }
            }
        }

        await RefreshToken.findOneAndUpdate(
            { user: user._id, },
            {
                token: newRefreshToken,
                expiresAt
            },
            { upsert: true, new: true }
        )

        res.status(200).json({
            msg: 'Logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        // Remove the refresh token from the database
        await RefreshToken.findOneAndDelete({ token: refreshToken });

        res.status(200).json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}