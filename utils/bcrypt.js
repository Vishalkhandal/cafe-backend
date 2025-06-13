const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

const comparePassword = async(plainPassword, hashPassword) => {
    return bcrypt.compare(plainPassword, hashPassword);
}

module.exports = {hashPassword, comparePassword}