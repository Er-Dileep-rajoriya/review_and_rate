import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTempFilters, applyFilters, fetchCompanies, setSort } from '../redux/slices/companySlice';

const FilterBar = ({ onAddCompany }) => {
  const dispatch = useDispatch();
  const { tempFilters } = useSelector((state) => state.companies);

  const handleCityChange = (e) => {
    dispatch(updateTempFilters({ city: e.target.value }));
  };

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  const handleFindCompany = () => {
    dispatch(applyFilters());
  };

  return (
    <div className="py-8">
      <div className="flex items-end justify-between gap-4">
        
        {/* Left: City & Buttons */}
        <div className="flex items-end gap-6 flex-1">
          {/* City Input */}
          <div className="w-[380px]">
            <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Select City</label>
            <div className="relative">
              <input 
                type="text" 
                value={tempFilters.city}
                onChange={handleCityChange}
                onKeyDown={(e) => e.key === 'Enter' && handleFindCompany()}
                placeholder="Indore, Madhya Pradesh, India" 
                className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 text-sm"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
            </div>
          </div>

          {/* Find Company Button */}
          <button 
            onClick={handleFindCompany}
            className="h-10 px-8 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white text-sm font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap shadow-md"
          >
            Find Company
          </button>

          {/* Add Company Button */}
          <button 
            onClick={onAddCompany}
            className="h-10 px-8 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>

        {/* Right: Sort Section */}
        <div className="shrink-0">
          <label className="block text-sm font-medium text-gray-500 mb-1 ml-1">Sort:</label>
          <div className="relative">
            <select 
              value={tempFilters.sort}
              onChange={handleSortChange}
              className="h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500 appearance-none font-bold text-sm cursor-pointer shadow-sm bg-white min-w-[140px]"
            >
              <option>Name</option>
              <option>Rating</option>
              <option>Reviews</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

      </div>
      <div className="border-b border-gray-100 mt-8"></div>
    </div>
  );
};

export default FilterBar;
