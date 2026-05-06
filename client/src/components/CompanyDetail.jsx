import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../redux/slices/reviewSlice';
import { updateCompanyStats } from '../redux/slices/companySlice';
import { Star, MapPin, Plus, ArrowLeft, Building2, Cpu, Globe, Zap, Rocket, Shield, Briefcase, Activity, Award } from 'lucide-react';
import Header from './Header';
import ReviewCard from './ReviewCard';
import AddReviewModal from './AddReviewModal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const iconsMap = {
  Building2, Cpu, Globe, Zap, Rocket, Shield, Briefcase, Activity, Award
};

const CompanyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: reviews, status, sort: reviewSort } = useSelector((state) => state.reviews);
  const [company, setCompany] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleAddReviewClick = () => {
    if (!user) {
      toast.error('Please login to add a review');
      navigate('/login');
    } else {
      setIsReviewModalOpen(true);
    }
  };

  const fetchCompany = React.useCallback(async () => {
    try {
      const response = await api.get(`/companies/${id}`);
      setCompany(response.data);
      dispatch(updateCompanyStats({
        companyId: id,
        rating: response.data.rating,
        reviews: response.data.reviews
      }));
    } catch (err) {
      console.error('Failed to fetch company details');
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchCompany();
    dispatch(fetchReviews({ companyId: id, sort: reviewSort }));
  }, [id, dispatch, fetchCompany, reviewSort]);

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    import('../redux/slices/reviewSlice').then(m => {
      dispatch(m.setReviewSort(newSort));
    });
  };

  if (!company) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const IconComponent = iconsMap[company.iconName] || Building2;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-10">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Companies</span>
        </Link>

        {/* Company Header Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 mb-12 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full translate-x-32 -translate-y-32 opacity-50 blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-2xl overflow-hidden ${company.bgColor || 'bg-indigo-600'}`}>
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <IconComponent size={64} strokeWidth={2.5} />
                )}
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{company.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{company.location}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-gray-900">{company.rating || 0}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(company.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-400">
                    {company.reviews || 0} Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Founded on {company.foundedOn}
              </span>
              <button 
                onClick={handleAddReviewClick}
                className="px-8 py-3 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Review
              </button>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">About</h3>
            <p className="text-gray-600 leading-relaxed max-w-4xl italic">
              "{company.description}"
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[40px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gray-50">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                Reviews <span className="text-purple-600 ml-1">{reviews.length}</span>
              </h2>
              <p className="text-sm text-gray-400 font-medium">Read what our users say about this company</p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-500 whitespace-nowrap">Sort by:</label>
              <div className="relative">
                <select 
                  value={reviewSort}
                  onChange={handleSortChange}
                  className="h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 font-bold text-sm cursor-pointer bg-white shadow-sm appearance-none min-w-[140px]"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Highest Rating</option>
                  <option>Lowest Rating</option>
                  <option>Most Helpful</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            ) : status === 'succeeded' ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No reviews yet. Be the first one!</p>
              </div>
            ) : (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AddReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        companyId={id}
        onSuccess={fetchCompany}
      />
    </div>
  );
};

export default CompanyDetail;
