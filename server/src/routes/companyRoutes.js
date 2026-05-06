import express from 'express';
import { getCompanies, createCompany, getCompanyById, updateCompany, deleteCompany } from '../controllers/companyController.js';
import upload from '../config/s3.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCompanies)
  .post(protect, upload.single('logo'), createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

export default router;
