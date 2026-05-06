import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  Star, 
  Building2, 
  Cpu, 
  Globe, 
  Zap, 
  Rocket, 
  Shield, 
  Briefcase, 
  Activity, 
  Award,
  Edit,
  Trash2
} from 'lucide-react';
import { deleteCompany } from '../redux/slices/companySlice';
import toast from 'react-hot-toast';

const iconsMap = {
  Building2,
  Cpu,
  Globe,
  Zap,
  Rocket,
  Shield,
  Briefcase,
  Activity,
  Award
};

const CompanyCard = ({ company, onEdit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const IconComponent = iconsMap[company.iconName] || Building2;

  const isOwner = user && company.user && (String(company.user) === String(user._id) || String(company.user) === String(user.id));

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this company? All reviews will be lost.')) {
      dispatch(deleteCompany(company._id));
      toast.success('Company deleted successfully');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-50 flex items-start gap-6 relative group hover:shadow-xl transition-all">
      
      {/* Logo Container */}
      <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg overflow-hidden ${company.bgColor || 'bg-indigo-600'}`}>
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
        ) : (
          <IconComponent size={48} strokeWidth={2.5} />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-3">
             <h3 className="text-xl font-bold text-gray-900 truncate">{company.name}</h3>
             {isOwner && (
               <div className="flex gap-2 transition-opacity ml-2">
                  <button 
                    onClick={(e) => { e.preventDefault(); onEdit(company); }}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    title="Edit Company"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Company"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
             )}
          </div>
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
            {company.dateLabel || 'Founded on'} {company.foundedOn}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{company.location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{company.rating || 0}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(company.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {company.reviews || 0} Reviews
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="self-end shrink-0">
        <Link 
          to={`/company/${company._id}`}
          className="px-5 py-2 bg-[#333] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors whitespace-nowrap block"
        >
          Detail Review
        </Link>
      </div>

    </div>
  );
};

export default CompanyCard;
