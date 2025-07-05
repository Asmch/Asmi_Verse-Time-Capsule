# 🚀 AsmiVerse Deployment Guide

This guide will help you deploy AsmiVerse to production with real-time features, improved email system, and enhanced UI.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Resend account (for emails)
- Cloudinary account (for media storage)
- Vercel or Netlify account (for hosting)

## 🔧 Environment Setup

### 1. Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_32_character_random_secret

# Email Configuration (Resend - Recommended)
RESEND_API_KEY=your_resend_api_key

# Legacy Email Configuration (Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
DOMAIN=https://your-domain.vercel.app

# Cron Job Security
CRON_SECRET_KEY=your_random_cron_secret_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (Optional)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# JWT Secret
JWT_SECRET=your_32_character_jwt_secret

# Production Settings
NODE_ENV=production
```

### 2. Generate Secrets

Use these commands to generate secure secrets:

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 32

# Generate cron secret
openssl rand -base64 32
```

## 🌐 Service Setup

### 1. MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Add your IP to the whitelist

### 2. Resend (Email Service)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Verify your domain (optional but recommended)
4. Add the API key to your environment variables

### 3. Cloudinary (Media Storage)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret
3. Add them to your environment variables

### 4. OAuth Providers (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth app
3. Add your callback URL

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all your environment variables

4. **Set up Custom Domain (Optional):**
   - Go to Settings > Domains
   - Add your custom domain
   - Update your environment variables with the new domain

### Option 2: Netlify

1. **Connect Repository:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`

2. **Configure Environment Variables:**
   - Go to Site settings > Environment variables
   - Add all your environment variables

3. **Set up Custom Domain (Optional):**
   - Go to Domain management
   - Add your custom domain

## ⏰ Cron Job Setup

### Option 1: Vercel Cron Jobs

1. **Create a cron API route:**
   ```typescript
   // app/api/cron/route.ts
   import { NextResponse } from 'next/server';
   import { headers } from 'next/headers';

   export async function GET() {
     const headersList = await headers();
     const authHeader = headersList.get('Authorization');
     
     if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     // Your cron logic here
     return NextResponse.json({ success: true });
   }
   ```

2. **Add to vercel.json:**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron",
         "schedule": "0 */6 * * *"
       }
     ]
   }
   ```

### Option 2: External Cron Service

Use services like:
- [Cron-job.org](https://cron-job.org)
- [EasyCron](https://easycron.com)
- [SetCronJob](https://setcronjob.com)

Set the URL to: `https://your-domain.vercel.app/api/users/cron/check-capsules`
Add header: `Authorization: Bearer your_cron_secret_key`

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use different secrets for development and production
   - Rotate secrets regularly

2. **CORS Configuration:**
   - Update CORS settings in `lib/socket.ts`
   - Only allow your production domain

3. **Rate Limiting:**
   - Consider adding rate limiting to your API routes
   - Use services like Upstash Redis for rate limiting

4. **Database Security:**
   - Use MongoDB Atlas IP whitelist
   - Enable MongoDB Atlas security features
   - Use strong passwords for database users

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
- Enable Vercel Analytics in your dashboard
- Monitor performance and errors

### 2. MongoDB Atlas Monitoring
- Use MongoDB Atlas monitoring
- Set up alerts for database issues

### 3. Email Monitoring
- Monitor email delivery rates in Resend dashboard
- Set up alerts for failed emails

## 🚀 Performance Optimization

### 1. Image Optimization
- Use Next.js Image component
- Configure Cloudinary transformations
- Implement lazy loading

### 2. Caching
- Implement Redis caching for frequently accessed data
- Use Next.js caching strategies
- Cache API responses

### 3. Bundle Optimization
- Use dynamic imports for large components
- Implement code splitting
- Monitor bundle size

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check environment variables
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Email Not Sending:**
   - Verify Resend API key
   - Check email templates
   - Monitor Resend dashboard

3. **Database Connection Issues:**
   - Verify MongoDB URI
   - Check IP whitelist
   - Monitor MongoDB Atlas

4. **Real-time Features Not Working:**
   - Check Socket.io configuration
   - Verify CORS settings
   - Monitor WebSocket connections

### Debug Commands

```bash
# Check build locally
npm run build

# Run production build locally
npm run start

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the logs in your hosting platform
3. Check GitHub issues for similar problems
4. Contact support for your hosting platform

## 🎉 Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and working
- [ ] Email service tested
- [ ] File upload working
- [ ] Authentication working
- [ ] Real-time features working
- [ ] Cron jobs configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance monitoring set up
- [ ] Error tracking configured
- [ ] Backup strategy in place

## 🔄 Updates & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor security advisories
- Review and rotate secrets
- Monitor performance metrics
- Backup database regularly

### Deployment Updates
1. Push changes to your repository
2. Vercel/Netlify will automatically deploy
3. Test the new deployment
4. Monitor for any issues

---

**Happy Deploying! 🚀**

For more help, check out the [AsmiVerse documentation](https://github.com/your-username/asmiverse). 