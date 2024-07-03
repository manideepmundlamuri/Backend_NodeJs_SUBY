const express = require('express');
const mongoose = require('mongoose');
const vendorRouter = require('./Routes/vendorRoutes');
const bodyParser = require('body-parser');
const frimRouter = require('./Routes/firmRouter');
const productRouter = require('./Routes/productRouter');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')
const myApp = express();
const PORT = process.env.PORT || 5000;
dotenv.config()
myApp.use(bodyParser.json())
myApp.get('/', (req, res) => {
    res.send("<h2>this is home page </h2>")
})
const uri = process.env.MONGODB_URI;


mongoose.connect(uri).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

myApp.use('/vendor', vendorRouter);
myApp.use('/firm', frimRouter);
myApp.use('/product', productRouter)
myApp.use('/uploads', express.static('uploads'))
myApp.listen(PORT, () => {
    console.log(`server is running in ${PORT}`);
})