const express = require("express");
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes')

const app = express();
const port = 3000;

connectDB();

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});