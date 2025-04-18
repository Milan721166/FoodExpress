const mongoose = require('mongoose');

const resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    resturantType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNum: {
        type: Number,
        required: true
    }

});


const Resturant = new mongoose.model('Resturant', resturantSchema);
module.exports = Resturant;