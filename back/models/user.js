import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique ID generation

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 }, // Add unique ID field with default value
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobNum: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  dob: { type: Date, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;