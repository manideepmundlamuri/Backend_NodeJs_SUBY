const productController = require('../controllers/productController');
const express = require('express');
const router = express.Router();

router.post('/add-products/:firmId', productController.addProduct)
router.get('/:firmId/products', productController.getProductByFirm)
router.delete('/:productId',productController.deleteProductById);
router.get('/upload/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-type', 'image.jpg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})
module.exports = router;