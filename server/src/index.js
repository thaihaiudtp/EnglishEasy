const express = require('express');
const app = express();
const port = 7021;
const connect = require('./db');
const router = require('./routes/index');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connect.connectDB();
router(app);
app.get('/', (req, res) => {
    res.send('Server is running on port 7021');
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})