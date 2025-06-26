import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resturant",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
