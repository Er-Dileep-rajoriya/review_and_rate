import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  logoUrl: {
    type: String,
    default: null
  },
  foundedOn: {
    type: String,
    required: [true, 'Founded date is required']
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  bgColor: {
    type: String,
    default: 'bg-indigo-600'
  },
  iconName: {
    type: String,
    default: 'Building2'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
