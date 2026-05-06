import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { fetchCompanies } from './redux/slices/companySlice';
import { setUser } from './redux/slices/authSlice';
import api from './api/axios';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import CompanyCard from './components/CompanyCard';
import AddCompanyModal from './components/AddCompanyModal';
import EditCompanyModal from './components/EditCompanyModal';
import CompanyDetail from './components/CompanyDetail';
import Signup from './components/Signup';
import Login from './components/Login';

const Home = ({ onAddCompanyClick, onEditCompanyClick }) => {
  const dispatch = useDispatch();
  const { items, status, hasMore, page, filters } = useSelector((state) => state.companies);
  const observer = useRef();

  const lastCompanyElementRef = useCallback(node => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchCompanies({ 
          page: page + 1,
          search: filters.search,
          city: filters.city,
          sort: filters.sort
        }));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [status, hasMore, page, dispatch, filters]);

  useEffect(() => {
    dispatch(fetchCompanies({ 
      page: 1,
      search: filters.search,
      city: filters.city,
      sort: filters.sort
    }));
  }, [dispatch, filters]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <FilterBar onAddCompany={onAddCompanyClick} />

        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-gray-400 mb-2">
            Result Found: {items.length}
          </p>
          
          {items.map((company, index) => (
            <div 
              key={company._id} 
              ref={index === items.length - 1 ? lastCompanyElementRef : null}
            >
              <CompanyCard company={company} onEdit={onEditCompanyClick} />
            </div>
          ))}

          {status === 'loading' && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {items.length === 0 && status === 'succeeded' && (
             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No companies found matching your search.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleAddCompanyClick = () => {
    if (!user) {
      toast.error('Please login to add a company');
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEditCompanyClick = (company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch(setUser(response.data.data.user));
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onAddCompanyClick={handleAddCompanyClick} 
              onEditCompanyClick={handleEditCompanyClick}
            />
          } 
        />
        <Route path="/company/:id" element={<CompanyDetail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <AddCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <EditCompanyModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCompany(null);
        }}
        company={editingCompany}
      />
    </>
  );
};

export default App;
