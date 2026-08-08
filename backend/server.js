require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db.js");
const cors = require('cors');

// routes
const authRoute = require('./routes/authRoute.js')
const createRoute = require('./routes/createRoute.js')

const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

// cross server origin
app.use(cors({
    origin: 'http://localhost:5173'
}))

connectDB();

app.get('/', (req,res) => {
    res.send("Working");
});

app.use("/api/auth", authRoute);
app.use("/api", createRoute);

app.listen(port, () => {
    console.log("example server running on port: ", port)
})