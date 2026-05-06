import { Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTempFilters, applyFilters, fetchCompanies } from '../redux/slices/companySlice';
import { logout } from '../redux/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { tempFilters } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);

  const handleSearchChange = (e) => {
    dispatch(updateTempFilters({ search: e.target.value }));
  };

  const handleSearchSubmit = () => {
    dispatch(applyFilters());
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 h-16 flex items-center">
      <div className="w-full px-6 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-8 h-8 rounded-full bg-[#9333ea] flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex items-center text-xl font-medium tracking-tight">
            <span className="text-gray-700">Review</span>
            <span className="text-[#9333ea] font-bold mx-0.5">&</span>
            <span className="text-black font-black uppercase tracking-tighter">Rate</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl px-12">
          <div className="relative w-full">
            <input 
              type="text" 
              value={tempFilters.search}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="Search..." 
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-[#9333ea] transition-all text-sm"
            />
            <div 
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={handleSearchSubmit}
            >
              <Search className="w-5 h-5 text-[#9333ea]" />
            </div>
          </div>
        </div>

        {/* Right: Auth Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                  {user.fullName.charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-700 hidden md:block">
                  {user.fullName}
                </span>
              </div>
              <button 
                onClick={() => dispatch(logout())}
                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/signup" className="text-[15px] font-bold text-gray-700 hover:text-[#9333ea] transition-colors">
                SignUp
              </Link>
              <Link to="/login" className="text-[15px] font-bold text-gray-700 hover:text-[#9333ea] transition-colors">
                Login
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
