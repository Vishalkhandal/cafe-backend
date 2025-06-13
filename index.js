require('dotenv').config();
const express = require("express");
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes')

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});