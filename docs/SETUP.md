# 🚀 AsmiVerse Setup Guide

## 📋 Prerequisites

Before setting up AsmiVerse, make sure you have the following installed:

### **Required Software**
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB** (local or cloud)

### **Required Accounts**
- **MongoDB Atlas** (free tier available)
- **Cloudinary** (free tier available)
- **Email Service** (Gmail SMTP, Resend, or similar)

---

## 🛠️ Step-by-Step Setup

### **Step 1: Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/yourusername/asmiverse.git

# Navigate to project directory
cd asmiverse

# Install dependencies
npm install
# or
yarn install
```

### **Step 2: Set Up MongoDB**

#### **Option A: MongoDB Atlas (Recommended)**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Free tier)

2. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Clusters" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

#### **Option B: Local MongoDB**

```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Connection string for local MongoDB
mongodb://localhost:27017/asmiverse
```

### **Step 3: Set Up Cloudinary**

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for a free account

2. **Get Credentials**
   - Go to your Dashboard
   - Copy your Cloud Name, API Key, and API Secret

### **Step 4: Set Up Email Service**

#### **Option A: Gmail SMTP**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

#### **Option B: Resend (Recommended)**

1. **Create Resend Account**
   - Go to [Resend](https://resend.com/)
   - Sign up for a free account
   - Verify your domain or use their test domain

2. **Get API Key**
   - Go to API Keys in your dashboard
   - Create a new API key

### **Step 5: Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asmiverse?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Email (Resend) - Alternative
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
```

### **Step 6: Generate NextAuth Secret**

```bash
# Generate a secure secret
openssl rand -base64 32
# or use an online generator
```

### **Step 7: Run the Application**

```bash
# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Configuration Options

### **Database Configuration**

The application uses Mongoose for MongoDB connection. You can customize the connection in `lib/dbConnect.tsx`:

```typescript
// Add connection options
const options = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

await mongoose.connect(MONGODB_URI, options);
```

### **File Upload Configuration**

Customize file upload settings in `app/api/upload/route.ts`:

```typescript
// File size limit (default: 10MB)
const maxFileSize = 10 * 1024 * 1024;

// Allowed file types
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'application/pdf'
];
```

### **Email Configuration**

Customize email templates in `helpers/emailService.ts`:

```typescript
// Email template customization
const emailTemplate = `
  <div style="font-family: Arial, sans-serif;">
    <h1>Your Time Capsule is Ready!</h1>
    <p>Hello ${recipientName},</p>
    <p>You have received a time capsule from ${senderName}.</p>
    <a href="${unlockUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none;">
      Unlock Your Capsule
    </a>
  </div>
`;
```

---

## 🧪 Testing the Setup

### **1. Test Database Connection**

Create a test API endpoint to verify database connection:

```typescript
// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: 'Database connected!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
```

### **2. Test File Upload**

Try uploading a file through the Create Capsule page to verify Cloudinary integration.

### **3. Test Email**

Use the test email endpoint to verify email configuration:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test email from AsmiVerse"
  }'
```

---

## 🚀 Production Deployment

### **Deploy to Vercel**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

### **Environment Variables for Production**

```env
# Update NEXTAUTH_URL for production
NEXTAUTH_URL=https://yourdomain.com

# Use production MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asmiverse?retryWrites=true&w=majority

# Use production email settings
EMAIL_FROM=noreply@yourdomain.com
```

### **Custom Domain Setup**

1. **Add Custom Domain in Vercel**
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## 🔒 Security Considerations

### **Environment Variables**
- Never commit `.env.local` to version control
- Use different secrets for development and production
- Rotate secrets regularly

### **Database Security**
- Use strong passwords for database users
- Restrict network access to your database
- Enable MongoDB Atlas security features

### **File Upload Security**
- Validate file types and sizes
- Scan uploaded files for malware
- Use secure URLs for file access

### **Authentication Security**
- Use strong NextAuth secrets
- Enable HTTPS in production
- Implement rate limiting

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Database Connection Failed**
```bash
# Check MongoDB URI format
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asmiverse?retryWrites=true&w=majority

# Verify network access in MongoDB Atlas
# Check if username/password are correct
```

#### **2. File Upload Not Working**
```bash
# Verify Cloudinary credentials
# Check file size limits
# Ensure file type is allowed
```

#### **3. Email Not Sending**
```bash
# Check SMTP credentials
# Verify email service settings
# Check spam folder
```

#### **4. Authentication Issues**
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
# Clear browser cookies and cache
```

### **Debug Mode**

Enable debug mode for more detailed error messages:

```env
# Add to .env.local
DEBUG=true
NODE_ENV=development
```

### **Logs**

Check application logs:

```bash
# Development logs
npm run dev

# Production logs (Vercel)
# Check Vercel dashboard for function logs
```

---

## 📞 Support

If you encounter issues during setup:

1. **Check the FAQ** in the main README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

### **Useful Commands**

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

---

## 🎉 Next Steps

After successful setup:

1. **Create your first user account**
2. **Test capsule creation**
3. **Explore the admin panel**
4. **Customize the UI/UX**
5. **Add additional features**

Happy coding! 🚀 