import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobNum: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Order history
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // User's reviews
});

const User = mongoose.model("User", userSchema);

export default User;
