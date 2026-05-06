import Review from '../models/Review.js';
import Company from '../models/Company.js';

// @desc    Get reviews for a specific company
// @route   GET /api/reviews/:companyId
export const getCompanyReviews = async (req, res) => {
  try {
    const { sort } = req.query;
    let sortBy = { createdAt: -1 }; // Default: Newest

    if (sort === 'Oldest') sortBy = { createdAt: 1 };
    if (sort === 'Highest Rating') sortBy = { rating: -1 };
    if (sort === 'Lowest Rating') sortBy = { rating: 1 };
    if (sort === 'Most Helpful') sortBy = { likesCount: -1 };

    const reviews = await Review.find({ company: req.params.companyId }).sort(sortBy);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review for a company
// @route   POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { companyId, subject, reviewText, rating } = req.body;

    const review = await Review.create({
      company: companyId,
      user: req.user.id,
      fullName: req.user.fullName,
      subject,
      reviewText,
      rating: Number(rating)
    });

    // Update Company stats
    const allReviews = await Review.find({ company: companyId });
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;

    await Company.findByIdAndUpdate(companyId, {
      rating: Number(avgRating.toFixed(1)),
      reviews: totalReviews
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Like a review
// @route   POST /api/reviews/:id/like
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const alreadyLiked = review.likedBy.includes(req.user.id);

    if (alreadyLiked) {
      review.likedBy = review.likedBy.filter(id => id.toString() !== req.user.id.toString());
    } else {
      review.likedBy.push(req.user.id);
    }
    
    review.likesCount = review.likedBy.length;
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    const companyId = review.company;
    await review.deleteOne();

    // Update Company stats
    const allReviews = await Review.find({ company: companyId });
    const totalReviews = allReviews.length;
    let avgRating = 0;
    if (totalReviews > 0) {
      avgRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;
    }

    await Company.findByIdAndUpdate(companyId, {
      rating: Number(avgRating.toFixed(1)),
      reviews: totalReviews
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
