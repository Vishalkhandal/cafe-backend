const User = require('../models/User');

// Create User
const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User by ID (from token)
const getUser = async (req, res) => {
    try {
        console.log("req.user:", req.user); 
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: No user in request' });
        }
        const user = await User.findById(req.user.id); // Use id from token
        if (!user) return res.status(404).json({ error: 'User not found' });
        console.log("User Found: ", user);
        res.status(200).json({
            message: `Welcome to the protected route, ${user.name}!`,
            userId: user._id,
            userEmail: user.email,
            user,
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}