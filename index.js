const express = require('express');
const mongoose = require('mongoose');
const vendorRouter = require('./Routes/vendorRoutes');
const bodyParser = require('body-parser');
const frimRouter = require('./Routes/firmRouter');
const productRouter = require('./Routes/productRouter');
const cors = require('cors');
const path = require('path');
const myApp = express();
const PORT = 5000;

myApp.use(bodyParser.json())
myApp.get('/home', (req, res) => {
    res.send("<h2>this is home page </h2>")
})

mongoose.connect("mongodb://localhost:27017/SUBY");
const db = mongoose.connection;
db.on('error', () => { console.log('DB is not connected') });
db.once('open', () => { console.log("DB is connected") });

myApp.use('/vendor', vendorRouter);
myApp.use('/firm', frimRouter);
myApp.use('/product', productRouter)
myApp.use('/uploads', express.static('uploads'))
myApp.listen(PORT, () => {
    console.log(`server is running in ${PORT}`);
})