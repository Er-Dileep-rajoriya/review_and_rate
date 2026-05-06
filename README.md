# Review & Rate 🌟

A premium, full-stack application for reviewing and rating companies. Built with a focus on modern aesthetics, secure authentication, and robust data management.

## ✨ Features

### 🔐 Secure Authentication
- **User Signup & Login**: Secure account creation and session management using JWT (JSON Web Tokens).
- **Password Protection**: Industry-standard password hashing using `bcryptjs`.
- **Authenticated Actions**: Critical actions like adding companies, posting reviews, and liking content are strictly gated behind authentication.

### 🏢 Company Management
- **Add Company**: Users can add companies with details like name, location, city, founding date, and a logo.
- **Edit Company**: Company owners can update their company details through a sleek modal interface.
- **Delete Company**: Owners have the authority to remove their companies (and all associated reviews).
- **Dynamic Assets**: Automatic generation of professional placeholder icons and background colors if a logo is not provided.

### 💬 Review & Interaction System
- **Detailed Reviews**: Authenticated users can post ratings and textual reviews.
- **Ownership Control**: Users can delete their own reviews.
- **Helpful (Like) System**: 
  - Toggle-based "Helpful" voting.
  - One-vote-per-user enforcement to prevent multi-like spam.
  - Live count updates.
- **Live Stats**: Automatic calculation of average ratings and total review counts for each company.

### 🔍 Advanced Search & Filter
- **Global Search**: Search companies by name or description.
- **City Filter**: Narrow down companies by their specific city location.
- **Smart Sorting**: Sort companies by Name (A-Z), Rating (Highest first), or Review Count.
- **Infinite Scroll**: Seamless pagination for a smooth browsing experience.

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19 (Vite)
- **State Management**: Redux Toolkit (Slices & Thunks)
- **Styling**: Tailwind CSS 4 (Premium Glassmorphism & Modern UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API Client**: Axios

### Backend
- **Core**: Node.js & Express 5
- **Database**: MongoDB with Mongoose
- **Storage**: AWS S3 (for Company Logos)
- **Authentication**: JWT & BcryptJS
- **File Handling**: Multer & Multer-S3

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance
- AWS Account (for S3 storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   ```
   Run the server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
personal/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components & Modals
│   │   ├── redux/         # State Management (Slices)
│   │   ├── api/           # Axios Configuration
│   │   └── App.jsx        # Routing & Main Entry
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Business Logic
│   │   ├── models/        # Database Schemas
│   │   ├── routes/        # API Endpoints
│   │   ├── middleware/    # Auth & Error Handling
│   │   └── config/        # S3 & DB Config
```

---

## 🛡️ Security & Best Practices
- **Middleware Protection**: `protect` middleware ensures sensitive routes are only accessible with a valid JWT.
- **Data Sanitization**: Frontend and backend validation to prevent malicious inputs and data leaks.
- **Ownership Verification**: Backend checks `req.user.id` against resource owner IDs for all Update/Delete operations.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views.

Developed with ❤️ by Dileep Rajoriya
