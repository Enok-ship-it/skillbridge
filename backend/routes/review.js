// reviews.js — Handles post-swap ratings and reviews

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const protect = require('../middleware/auth');

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { revieweeId, swapId, rating, comment } = req.body;

    const review = await Review.create({
      reviewer: req.userId,
      reviewee: revieweeId,
      swapId,
      rating,
      comment
    });

    // Recalculate average rating for the reviewee
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(avgRating * 10) / 10,  // Round to 1 decimal
      totalReviews: allReviews.length
    });

    res.status(201).json({
      success: true,
      message: "Review submitted! Thanks for the feedback ⭐",
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/reviews/:userId
router.get('/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;