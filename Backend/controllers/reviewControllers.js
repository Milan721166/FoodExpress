import Review from "../models/review.js";
import Order from "../models/orders.js";
import User from "../models/user.js";

// Add a review (only if user bought the product)
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product, order, rating, comment } = req.body;

    // Check if the order belongs to the user and contains the product
    const foundOrder = await Order.findOne({
      _id: order,
      user: userId,
      "products.product": product,
    });
    if (!foundOrder) {
      return res
        .status(400)
        .json({ message: "You can only review products you have bought." });
    }

    const review = new Review({
      user: userId,
      product,
      order,
      rating,
      comment,
    });
    await review.save();

    // Add review to user's reviews
    await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a review (only if owned by user)
export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateFields = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true }
    );
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized." });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a review (only if owned by user)
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const review = await Review.findOneAndDelete({ _id: id, user: userId });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized." });
    }
    // Remove review from user's reviews
    await User.findByIdAndUpdate(userId, { $pull: { reviews: id } });

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
