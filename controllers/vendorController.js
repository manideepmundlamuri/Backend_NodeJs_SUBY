const Vendor = require('../modles/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config()
const secretKey = process.env.whatIsYourName

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already Taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        })
        await newVendor.save();
        res.status(200).json({ message: "User Successfully registred" });
        console.log('Registred')
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "server error" })
    }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })
        res.status(200).json({ success: "user successful loggedIn", token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal error" })
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal error" })
    }
}

const getSingleVendorById = async (req,res)=>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            res.status(400).json({message:"vendor not Found"})
        }
        res.status(200).json({vendor})
    } catch (error) {
        
    }
}

module.exports = { vendorRegister, vendorLogin , getAllVendors , getSingleVendorById };