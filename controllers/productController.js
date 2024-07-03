const Firm = require('../modles/Firm');
const Product = require('../modles/Product');
const multer = require('multer');
const mongoose = require('mongoose')

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

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        let firmId = req.params.firmId;
        firmId = firmId.trim()
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ message: "Invalid firmId format" });
        }
        console.log('Firm ID:', firmId);
        console.log('Firm ID type:', typeof firmId);

        const firm = await Firm.findById(firmId).populate('products');
        console.log('Request body:', req.body); // Log the request body
        console.log('Firm ID:', firmId); // Log the firm ID
        console.log('Image:', image); // Log the image file name
        if (!firm) {
            return res.status(400).json({ message: "Firm Not Found" });
        }
        const product = new Product({
            productName, price: parseInt(price), category, bestSeller: bestSeller === 'true', description, image, firm: firm._id
        })
        console.log('New products :', product);
        const savedProduct = await product.save()
        firm.products.push(savedProduct._id);
        await firm.save();
        res.status(200).json(savedProduct)

        // --------------------------

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "internal server error" })
    }
}

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            res.status(400).json({ message: "Firm not found" })
        }
        const restaruntName = firm.firmName;
        const products = await Product.find({ firm: firmId })
        res.status(200).json({ restaruntName, products })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "internal server error" })
    }
}

const deleteProductById = async(req, res)=>{
    try {
        const productId = req.params.productId
        const deteleProduct = await Product.findByIdAndDelete(productId);
        if(!deteleProduct){
            res.status(400).json({message:"No Record Found"});
        }

    } catch (error) {
         console.log(error.message);
        res.status(500).json({ message: "internal server error" })
    }
}
module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm ,deleteProductById}