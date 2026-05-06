import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateCompany } from '../redux/slices/companySlice';
import toast from 'react-hot-toast';

const EditCompanyModal = ({ isOpen, onClose, company }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    foundedOn: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        location: company.location || '',
        city: company.city || '',
        foundedOn: company.foundedOn || '',
        description: company.description || ''
      });
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Updating company...');

    try {
      await dispatch(updateCompany({
        id: company._id,
        data: formData
      })).unwrap();
      
      toast.success('Company updated successfully! ✨', { id: loadingToast });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Error updating company', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            <div className="absolute top-0 left-0 w-24 h-24 -translate-x-3 -translate-y-3 pointer-events-none overflow-hidden rounded-tl-[40px]">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#9333ea] to-[#4f46e5] rounded-full"></div>
            </div>

            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-1 text-gray-900 hover:opacity-70 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-center text-gray-900 mb-8 mt-2">Edit Company</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Company Name</label>
                <input
                  required
                  disabled={loading}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-300 disabled:bg-gray-50 text-[15px] font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Description</label>
                <textarea
                  required
                  disabled={loading}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about the company..."
                  className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-300 text-[15px] font-medium resize-none disabled:bg-gray-50 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g. Indore"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[15px] font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Founded</label>
                  <input
                    required
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.foundedOn}
                    onChange={(e) => setFormData({...formData, foundedOn: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[15px] font-medium focus:outline-none focus:border-purple-500 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase tracking-[0.1em]">Full Location</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Full Address"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 text-[15px] font-medium focus:outline-none focus:border-purple-500"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Company Details'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditCompanyModal;
