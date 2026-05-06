import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../redux/slices/reviewSlice';
import toast from 'react-hot-toast';

const AddReviewModal = ({ isOpen, onClose, companyId, onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    subject: '',
    reviewText: ''
  });

  const getRatingLabel = (val) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Satisfied';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading('Saving review...');

    try {
      await dispatch(createReview({
        ...formData,
        rating,
        companyId
      })).unwrap();
      
      toast.success('Review added successfully! 🚀', { id: loadingToast });
      if (onSuccess) onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Error saving review', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ subject: '', reviewText: '' });
    setRating(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-y-auto no-scrollbar max-h-[92vh] pt-10 pb-10 px-10"
          >
            {/* Decorative Shape */}
            <div className="absolute top-0 left-0 w-28 h-28 -translate-x-3 -translate-y-3 pointer-events-none overflow-hidden rounded-tl-[40px]">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#9333ea] to-[#4f46e5] rounded-full"></div>
              <div className="absolute top-0 left-12 w-16 h-16 bg-[#c084fc] rounded-full opacity-30"></div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-1 text-gray-900 hover:opacity-70 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">Add Review</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                Posting as <span className="text-purple-600">{user?.fullName}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Subject</label>
                <input
                  required
                  disabled={loading}
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Review subject (e.g. Great Work Environment)"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-300 disabled:bg-gray-50 text-[15px] font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Your Experience</label>
                <textarea
                  required
                  disabled={loading}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                  placeholder="Share your detailed experience..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-300 text-[15px] font-medium resize-none disabled:bg-gray-50 leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-black text-gray-900">Overall Rating</h3>
                  <span className="text-sm font-black text-purple-600 px-3 py-1 bg-purple-50 rounded-full">
                    {getRatingLabel(hover || rating) || 'Select Stars'}
                  </span>
                </div>
                <div className="flex justify-between px-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="transition-transform active:scale-90"
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHover(val)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star 
                        size={38}
                        className={`${val <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit My Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddReviewModal;
