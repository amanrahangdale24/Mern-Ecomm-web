const express = require('express');
const router = express.Router();
const userModel = require('../db/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult, body } = require('express-validator');


router.post('/register',
    body('name').trim().isLength({ min: 5 }),
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 3 }),
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({
                error: "Invalid entries",
                status: false  // we will use this status on frontend 
            })
        }

        try {
            const { name, email, password, role } = req.body;


            // check we should have only one admin 
            const data = req.body;
            const adminUser = await userModel.findOne({ role: 'admin' });

            if (data.role === 'admin' && adminUser) {
                return res.status(403).json({
                    error: "You can not register as admin"
                })
            }


            const hashPass = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                name,
                email,
                password: hashPass,
                role
            })

            res.status(200).json({
                message: "user registered successfully",
                status: true
            });
        } catch (error) {
            res.status(403).json({
                error: "this email is already regitered",
                status: false
            })
        }

    })



router.post('/login',
    body('email').trim().isLength({ min: 12 }),
    body('password').trim().isLength({ min: 3 }),
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({
                error: "Invalid entries"
            })
        }

        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({
                email: email
            })

            if (!user) {
                return res.status(404).json({
                    message: "Invalid email or password"
                })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(404).json({
                    message: "Invalid email or password"
                })
            }


            // if everyThing matched 

            const token = jwt.sign({
                userId: user._id,
                password: user.password,
                role: user.role
            }, process.env.SECRET_KEY,{expiresIn:'1d'})

            
            
            res.cookie('token', token); 
            console.log(token);
            res.status(200).json({message: "login successfully",status:true})

        } catch (error) {
            res.status(403).json({ error: "error occured while login" , status:false})
        }
    }
)

module.exports = router; 