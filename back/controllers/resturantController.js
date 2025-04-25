import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resturant from '../models/resturant.js';

dotenv.config();

export const getAllResturant = async (req, res) => {
  try {
    const resturants = await Resturant.find();
    res.status(200).json(resturants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createNewResturant = async (req, res) => {
  try {
    const { name, location, image, resturantType, email, mobileNum } = req.body;

    // Validate required fields
    if (!name || !location || !image || !resturantType || !email || !mobileNum) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new restaurant
    const resturant = new Resturant({
      name,
      location,
      image,
      resturantType,
      email,
      mobileNum,
    });

    const savedResturant = await resturant.save();
    res.status(201).json(savedResturant);
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};