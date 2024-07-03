const Firm = require('../modles/Firm');
const Vendor = require('../modles/Vendor');
const multer = require('multer');

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the original extension to the filename
    }
});

// Initialize upload
const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(401).json({ message: "Vendor not found" });
        }
        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendor._id
        })
        const savedfirm = await firm.save();
        vendor.firm.push(savedfirm);
        await vendor.save();
        res.status(200).json({ message: "Firm registred successfully" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "internal server error" })
    }
}

const deleteFirmByID = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deleteFirm = await Firm.findByIdAndDelete(firmId);
        if (!deleteFirm) {
            res.status(400).json({ message: "No Record Found" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "internal server error" })
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm] ,deleteFirmByID}

