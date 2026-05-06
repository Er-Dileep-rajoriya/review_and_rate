import express from 'express';
import { getCompanyReviews, addReview, likeReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:companyId', getCompanyReviews);
router.post('/:id/like', protect, likeReview);
router.delete('/:id', protect, deleteReview);

export default router;
