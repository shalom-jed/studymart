const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const registerUser = async (name, email, password) => {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userRepository.createUser({
        name,
        email,
        passwordHash,
    });

    return generateToken(newUser.id);
};

const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    return generateToken(user.id);
};

module.exports = {
    registerUser,
    loginUser,
};