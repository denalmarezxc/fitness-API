const express = require ('express');
const UserModel = require('../model/UserModel');
const bcrypt = require("bcrypt");
const auth = require('../auth.js');
const { errorHandler } = auth;


module.exports.registerUser = (req, res) => {
    // Checks if the email is in the right format
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email' });
    }
    // Checks if the password has at least 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters' });
    } else {
        // Check if email already exists
        UserModel.findOne({ email: req.body.email })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).send({ message: 'Email is already registered' });
                } else {
                    // If email is unique, create a new user
                    let newUser = new UserModel({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10)
                    });

                    return newUser.save()
                        .then((result) => res.status(201).send({ message: 'Registered Successfully', user: result }))
                        .catch(error => errorHandler(error, req, res));
                }
            })
            .catch(error => errorHandler(error, req, res));
    }
};


// Log-in user
module.exports.loginUser = (req, res) => {
    if (req.body.email.includes('@')) {
        return UserModel.findOne({ email: req.body.email })
            .then(result => {
                if (result === null) {
                    // Return 404 for no email found
                    return res.status(404).send({ message: 'No email found' });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(200).send({ access: auth.createAccessToken(result) });
                    } else {
                        return res.status(401).send({ message: 'Email and password do not match' });
                    }
                }
            })
            .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid Email' });
    }
};

// Get user details
module.exports.getProfile = (req, res) => {
    return UserModel.findById(req.user.id)
        .select('-password') // Exclude the password field
        .then(user => {
            if (!user) {
                // Return 404 for user not found
                return res.status(404).send({ message: 'User not found' });
            } else {
                return res.status(200).send({ user });
            }
        })
        .catch(error => errorHandler(error, req, res));
};