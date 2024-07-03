const Vendor = require('../modles/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.whatIsYourName
const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "vendor Not Found" });
        }
        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "internal server error" });
    }
}

module.exports = verifyToken;