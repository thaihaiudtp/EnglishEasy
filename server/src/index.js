const express = require('express');
const app = express();
const port = 7021;
const connect = require('./db');
const router = require('./routes/index');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
app.use(cookieParser());
app.use(cookieSession({
    maxAge: (30 * 24 * 60 * 60 * 1000),
    keys: "token"
}));
app.use(passport.initialize());
app.use(passport.session());
require('./partport');
dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
connect.connectDB();
router(app);
app.get('/', (req, res) => {
    res.send(req.user);
})
app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get('/auth/google/callback', passport.authenticate('google', { session: false }), 
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Xác thực thất bại" });
    }
    const { user, token } = req.user;
    res.cookie('accessToken', token, { httpOnly: true, secure: false});
   // secure: true nếu sử dụng HTTPS
    res.redirect('http://localhost:3000/');
  }
);

  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})