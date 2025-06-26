import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  resturantType: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  mobileNum: { type: Number, required: true },
  username: { type: String, required: true, unique: true }, // NEW
  password: { type: String, required: true }, // NEW
});

const Resturant = mongoose.model("Resturant", resturantSchema);

export default Resturant;
