const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const Resturant = require("../models/resturant.js");


const getAllResturant = async (req, res) => {
    try {
        const resturant = await Resturant.find();
        res
            .status(200)
            .json(resturant);
    } catch (err) {
        console.log('Error to fetching resturant data', err);
        res
            .status(500)
            .json({ message: 'An internal server error to fetching the resturant data' });
    }
};

//create a new resturant 

const createNewResturant = async (req, res) => {
    try {
        const {
            name,
            location,
            image,
            resturantType,
            email,
            mobileNum,
        } = req.body;
        const resturant = new Resturant({ name, location, image, resturantType, email, mobileNum, password });
        await resturant.save();
        res
            .status(201)
            .json(resturant);
    } catch (err) {
        console.error('Error adding resturant', err);
        res
            .status(500)
            .json({ message: 'An internal server error to insert the resturant' });
    }
};

module.exports = {
    getAllResturant,
    createNewResturant
}