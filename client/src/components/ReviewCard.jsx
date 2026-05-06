import React from 'react';
import { Star, ThumbsUp, Share2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { likeReview, deleteReview } from '../redux/slices/reviewSlice';
import toast from 'react-hot-toast';

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isLiked = review.likedBy?.includes(user?._id);
  const isOwner = review.user && (review.user === user?._id || review.user === user?.id);
  const likesCount = review.likesCount || 0;

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like a review');
      navigate('/login');
      return;
    }
    dispatch(likeReview(review._id));
    if (isLiked) {
       toast.success('Removed helpful vote', { icon: '👎', duration: 1500 });
    } else {
       toast.success('Helpful!', { icon: '👍', duration: 1500 });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!', { icon: '🔗', duration: 1500 });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(review._id));
      toast.success('Review deleted');
    }
  };

  return (
    <div className="py-8 border-b border-gray-100 last:border-0 group relative">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 font-black text-lg shrink-0">
          {review.fullName?.charAt(0) || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-600 transition-colors">
                {review.fullName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {review.createdAt ? format(new Date(review.createdAt), 'dd MMM yyyy') : 'Recently'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 font-medium">{review.subject}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-0.5 px-2 py-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              
              {isOwner && (
                <button 
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pl-16">
        <p className="text-gray-600 text-[15px] leading-relaxed">
          {review.reviewText}
        </p>

        <div className="flex items-center gap-6 mt-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 text-xs font-bold transition-all group/btn ${isLiked ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
          >
            <div className={`p-2 rounded-lg transition-colors ${isLiked ? 'bg-purple-100' : 'bg-gray-50 group-hover/btn:bg-purple-50'}`}>
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-purple-600' : ''}`} />
            </div>
            <span>{likesCount} Helpful</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors group/btn"
          >
            <div className="p-2 rounded-lg bg-gray-50 group-hover/btn:bg-purple-50 transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
