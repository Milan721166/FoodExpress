// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   // id: { type: String, unique: true, required: true }, // Add unique ID field
//   userName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   mobNum: { type: String, required: true },
//   password: { type: String, required: true },
//   address: { type: String },
//   dob: { type: Date, required: true },
// });


// const User = mongoose.model('User', userSchema);

// module.exports = User;




const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique ID generation

const userSchema = new mongoose.Schema({
  // id: { type: String, unique: true, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobNum: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  dob: { type: Date, required: true },
});

// // Automatically generate a unique ID before saving
// userSchema.pre('save', function (next) {
//   if (!this.id) {
//     this.id = uuidv4();
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;