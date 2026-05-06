import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Upload, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCompany } from '../redux/slices/companySlice';
import toast from 'react-hot-toast';

const AddCompanyModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    foundedOn: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Saving...');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('logo', file);

    try {
      await dispatch(addCompany(data)).unwrap();
      toast.success('Company created!', { id: loadingToast });
      onClose();
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Error', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', city: '', foundedOn: '', description: '' });
    setFile(null);
    setPreview(null);
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
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-y-auto no-scrollbar max-h-[92vh] pt-8 pb-10 px-10"
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

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 mt-2">Add Company</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex items-center gap-6 mb-2">
                <div 
                  onClick={() => !loading && fileInputRef.current.click()}
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 bg-gray-50 shrink-0 overflow-hidden"
                >
                  {preview ? <img src={preview} alt="Logo" className="w-full h-full object-cover" /> : <Upload className="text-gray-400" />}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Company name</label>
                  <input
                    required
                    disabled={loading}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter..."
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-[15px]"
                  />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Description</label>
                <textarea
                  required
                  disabled={loading}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about the company..."
                  className="w-full min-h-[80px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 text-[15px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g. Indore"
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Founded</label>
                  <input
                    required
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.foundedOn}
                    onChange={(e) => setFormData({...formData, foundedOn: e.target.value})}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:border-purple-500 text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Location</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Full Address"
                    className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-200 text-[15px] focus:outline-none focus:border-purple-500"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Save Company'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCompanyModal;
