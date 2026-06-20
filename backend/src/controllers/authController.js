const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const token = await authService.registerUser(name, email, password);
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.loginUser(email, password);
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
};