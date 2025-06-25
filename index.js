require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const productController = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cors({origin: 'http://localhost:5173', credentials: true}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productController);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});