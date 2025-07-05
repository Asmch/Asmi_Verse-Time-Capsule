#!/bin/bash

# AsmiVerse Deployment Script
echo "🚀 Starting AsmiVerse deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one based on .env.example"
    echo "📝 Required environment variables:"
    echo "   - MONGODB_URI"
    echo "   - NEXTAUTH_SECRET"
    echo "   - RESEND_API_KEY"
    echo "   - CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
    echo "   - NEXT_PUBLIC_BASE_URL"
    echo "   - CRON_SECRET_KEY"
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Run linting
echo "🔍 Running linting..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ Linting passed!"
else
    echo "⚠️  Linting issues found. Please fix them before deployment."
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy to Vercel:"
echo "   - Install Vercel CLI: npm i -g vercel"
echo "   - Run: vercel --prod"
echo ""
echo "2. Or deploy to Netlify:"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: .next"
echo ""
echo "3. Set up environment variables in your hosting platform"
echo "4. Configure your domain (optional)"
echo "5. Set up cron jobs for capsule delivery"
echo ""
echo "🔗 Useful links:"
echo "- Vercel: https://vercel.com"
echo "- Netlify: https://netlify.com"
echo "- Resend (Email): https://resend.com"
echo "- Cloudinary (Media): https://cloudinary.com"
echo "- MongoDB Atlas: https://mongodb.com/atlas" 