const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    // Let's Validate the Data
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exist');

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new User 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try{
        const createdUser = await user.save();
        res.send({user: user._id});
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/login', async (req, res) => {
    // Let's Validate the Data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email does not exist');

    // Check Password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


module.exports = router;