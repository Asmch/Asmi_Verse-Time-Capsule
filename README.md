# 🚀 AsmiVerse - Digital Time Capsule Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Create, store, and unlock digital time capsules with messages, photos, and videos for future delivery.**

## 🚀 Live Demo
[Asmiverse](https://asmiversetc.vercel.app/)

## 🌟 Features

- **🔐 Secure Authentication** - NextAuth.js with JWT tokens
- **📝 Time Capsule Creation** - Create capsules with custom unlock dates
- **📁 File Upload** - Support for images, videos, and documents via Cloudinary
- **📧 Email Notifications** - Automated delivery when capsules unlock
- **👥 Admin Panel** - User and capsule management
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion
- **🔒 Password Protection** - Optional password protection for capsules
- **📊 Real-time Updates** - Live notifications and status updates

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **NextAuth.js** - Authentication
- **bcrypt** - Password hashing

### **Services**
- **Cloudinary** - File storage and CDN
- **Nodemailer** - Email sending
- **Socket.io** - Real-time communication

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MongoDB database
- Cloudinary account
- Email service (SMTP or Resend)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/asmiverse.git
   cd asmiverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_password
   EMAIL_FROM=your_email
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### **For Users**

1. **Sign Up/Login**
   - Create an account or log in with existing credentials
   - Verify your email address

2. **Create a Time Capsule**
   - Choose between Event Capsule or Custom Capsule
   - Fill in recipient details and unlock date
   - Add your message and optional media files
   - Set optional password protection

3. **Manage Your Capsules**
   - View all your created capsules
   - Edit or delete capsules before they unlock
   - Track delivery status

### **For Admins**

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin`

2. **Manage Users**
   - View all registered users
   - Ban/unban users
   - Grant admin privileges

3. **Manage Capsules**
   - View all capsules in the system
   - Delete inappropriate content
   - Monitor delivery status

## 🏗️ Project Structure

```
asmiverse/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin endpoints
│   │   ├── auth/          # Authentication
│   │   ├── Capsules/      # Capsule management
│   │   └── upload/        # File upload
│   ├── components/        # Reusable components
│   ├── Create/           # Capsule creation page
│   ├── admin/            # Admin dashboard
│   └── my_capsules/      # User capsules page
├── models/               # Mongoose models
├── lib/                  # Utility libraries
├── context/              # React context providers
├── helpers/              # Helper functions
└── public/               # Static assets
```

## 🔧 API Documentation

### **Authentication Endpoints**

#### `POST /api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### **Capsule Endpoints**

#### `POST /api/Capsules`
Create a new time capsule.

**Request Body:**
```json
{
  "title": "Birthday Message",
  "message": "Happy Birthday!",
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "timeLock": "2024-12-31T00:00:00.000Z",
  "password": "optional_password"
}
```

#### `GET /api/Capsules`
Get all capsules for the authenticated user.

**Response:**
```json
{
  "success": true,
  "capsules": [
    {
      "_id": "capsule_id",
      "title": "Birthday Message",
      "recipientName": "Jane Doe",
      "recipientEmail": "jane@example.com",
      "timeLock": "2024-12-31T00:00:00.000Z",
      "isDelivered": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### **Admin Endpoints**

#### `GET /api/admin/stats`
Get dashboard statistics (admin only).

**Response:**
```json
{
  "success": true,
  "totalUsers": 150,
  "totalCapsules": 300,
  "newUsers": 25,
  "newCapsules": 50
}
```

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### **Environment Variables for Production**

```env
# Database
MONGODB_URI=your_production_mongodb_uri

# Authentication
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
EMAIL_FROM=your_email
```

## 🧪 Testing

### **Run Tests**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### **Test Coverage**
```bash
npm run test:coverage
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [MongoDB](https://www.mongodb.com/) for the flexible database
- [Cloudinary](https://cloudinary.com/) for file storage
- [NextAuth.js](https://next-auth.js.org/) for authentication

## 📞 Support

- **Email**: asmitachoudhary08@gmail.com
- **GitHub**: [Asmch](https://github.com/Asmch)
- **Issues**: [GitHub Issues](https://github.com/Asmch/asmiverse/issues)
- **LinkedIn**: [Asmita Kumari](https://www.linkedin.com/in/asmita-x/)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered content moderation
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Advanced scheduling options

---

**Made with ❤️ by Asmita**

[![GitHub stars](https://img.shields.io/github/stars/Asmch/asmiverse?style=social)](https://github.com/Asmch/asmiverse)
[![GitHub forks](https://img.shields.io/github/forks/Asmch/asmiverse?style=social)](https://github.com/Asmch/asmiverse)
[![GitHub issues](https://img.shields.io/github/issues/Asmch/asmiverse)](https://github.com/Asmch/asmiverse/issues)
