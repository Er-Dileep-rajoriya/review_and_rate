import Company from '../models/Company.js';

// @desc    Get all companies with pagination, search and filter
// @route   GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { search, city, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'Name') sortQuery = { name: 1 };
    if (sort === 'Rating') sortQuery = { rating: -1 };
    if (sort === 'Reviews') sortQuery = { reviews: -1 };

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      companies,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a company
// @route   POST /api/companies
export const createCompany = async (req, res) => {
  try {
    const { name, location, city, foundedOn, description } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }
    
    let logoUrl = req.file ? req.file.location : null;

    if (!logoUrl) {
      const dummyLogos = [
        'https://cdn-icons-png.flaticon.com/512/281/281764.png', 
        'https://cdn-icons-png.flaticon.com/512/1067/1067256.png', 
        'https://cdn-icons-png.flaticon.com/512/2111/2111450.png', 
        'https://cdn-icons-png.flaticon.com/512/616/616490.png', 
        'https://cdn-icons-png.flaticon.com/512/2535/2535560.png'
      ];
      logoUrl = dummyLogos[Math.floor(Math.random() * dummyLogos.length)];
    }

    const colors = ['bg-[#1a234e]', 'bg-[#2d8a1c]', 'bg-[#f47b1f]', 'bg-[#9333ea]', 'bg-[#4f46e5]', 'bg-[#0891b2]', 'bg-[#e11d48]'];
    const icons = ['Building2', 'Cpu', 'Globe', 'Zap', 'Rocket', 'Shield', 'Briefcase', 'Activity', 'Award'];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const company = await Company.create({
      name,
      location,
      city,
      foundedOn,
      description,
      logoUrl,
      user: req.user.id,
      bgColor: randomColor,
      iconName: randomIcon
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check ownership
    if (company.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only update your own companies' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check ownership
    if (company.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own companies' });
    }

    await company.deleteOne();
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
