# 🏗️ AsmiVerse Architecture Documentation

## 📋 Overview

AsmiVerse is built using a modern full-stack architecture with Next.js 14, TypeScript, and MongoDB. The application follows a layered architecture pattern with clear separation of concerns.

## 🎯 Architecture Principles

- **Separation of Concerns** - Each layer has a specific responsibility
- **Scalability** - Designed to handle growth in users and data
- **Security** - Authentication, authorization, and data validation at every layer
- **Performance** - Optimized for fast loading and smooth user experience
- **Maintainability** - Clean, well-documented code with consistent patterns

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Pages     │ │ Components  │ │   Context   │           │
│  │  (App Router)│ │ (Reusable)  │ │ (State Mgmt)│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js)                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Auth      │ │  Capsules   │ │   Upload    │           │
│  │  Routes     │ │   Routes    │ │   Routes    │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Models    │ │  Services   │ │  Helpers    │           │
│  │ (Mongoose)  │ │ (Business)  │ │ (Utilities) │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   MongoDB   │ │ Cloudinary  │ │   Email     │           │
│  │ (Database)  │ │ (File Storage)│ │ (SMTP/API) │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
asmiverse/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── admin/               # Admin endpoints
│   │   │   ├── capsules/        # Admin capsule management
│   │   │   ├── reports/         # Admin reports
│   │   │   ├── stats/           # Dashboard statistics
│   │   │   └── users/           # Admin user management
│   │   ├── auth/                # Authentication
│   │   │   └── [...nextauth]/   # NextAuth.js routes
│   │   ├── Capsules/            # Capsule management
│   │   │   └── verify-password/ # Password verification
│   │   ├── upload/              # File upload
│   │   └── users/               # User management
│   ├── components/              # Reusable components
│   │   ├── FAQs.tsx            # FAQ component
│   │   ├── Footer.tsx          # Footer component
│   │   ├── Hero.tsx            # Hero section
│   │   ├── Home.tsx            # Home page component
│   │   ├── NotificationPanel.tsx # Notification system
│   │   └── Toast.tsx           # Toast notifications
│   ├── Create/                 # Capsule creation page
│   ├── admin/                  # Admin dashboard
│   ├── Explore/                # Capsule exploration
│   ├── FAQs/                   # FAQ page
│   ├── forgot-password/        # Password recovery
│   ├── Home/                   # Home page
│   ├── How_It_Works/           # How it works page
│   ├── JoinUs/                 # Registration page
│   ├── Login/                  # Login page
│   ├── my_capsules/            # User's capsules
│   ├── Profile/                # User profile
│   ├── reset-password/         # Password reset
│   ├── verifyemail/            # Email verification
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── provider.tsx            # Context providers
├── context/                    # React Context
│   ├── AuthContext.tsx         # Authentication context
│   └── NotificationContext.tsx # Notification context
├── dbConfig/                   # Database configuration
│   └── dbConfig.tsx            # Database setup
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   ├── ARCHITECTURE.md         # This file
│   └── SETUP.md                # Setup guide
├── helpers/                    # Helper functions
│   ├── emailService.ts         # Email service
│   ├── getDataFromToken.tsx    # Token utilities
│   └── mailer.tsx              # Email templates
├── lib/                        # Library files
│   ├── authOptions.tsx         # NextAuth configuration
│   ├── dbConnect.tsx           # Database connection
│   └── socket.ts               # WebSocket setup
├── models/                     # Database models
│   ├── Capsule.ts              # Capsule model
│   └── userModel.ts            # User model
├── public/                     # Static assets
├── utils/                      # Utility functions
│   └── connectDB.tsx           # Database utilities
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment config
```

---

## 🔄 Data Flow

### **1. User Authentication Flow**

```
User Input → Frontend Form → API Route → NextAuth → Database → Session
     ↑                                                           ↓
     └─────────────── Response & Redirect ←──────────────────────┘
```

### **2. Capsule Creation Flow**

```
User Input → Form Validation → File Upload → API Route → Database → Email Queue
     ↑                                                                   ↓
     └─────────────── Success Response ←────────────────────────────────┘
```

### **3. Capsule Delivery Flow**

```
Cron Job → Check Unlocked Capsules → Send Email → Update Status → User Access
```

---

## 🗄️ Database Design

### **User Collection**

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // Hashed with bcrypt
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  forgetPasswordToken?: string;
  forgetPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Capsule Collection**

```typescript
interface Capsule {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  title: string;
  message: string;
  recipientName: string;
  recipientEmail: string;
  timeLock: Date;
  mediaUrl?: string;
  password?: string; // Hashed
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Database Indexes**

```javascript
// User collection indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "isAdmin": 1 });
db.users.createIndex({ "isBanned": 1 });

// Capsule collection indexes
db.capsules.createIndex({ "userId": 1 });
db.capsules.createIndex({ "recipientEmail": 1 });
db.capsules.createIndex({ "timeLock": 1 });
db.capsules.createIndex({ "isDelivered": 1 });
db.capsules.createIndex({ "createdAt": -1 });
```

---

## 🔐 Security Architecture

### **Authentication Layer**

```typescript
// NextAuth.js Configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Email/password authentication
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Add user data to JWT
    },
    session: async ({ session, token }) => {
      // Add user data to session
    }
  }
};
```

### **Authorization Patterns**

```typescript
// Admin-only middleware
const requireAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).isAdmin) {
    return res.status(401).json({ error: 'Admin access required' });
  }
};

// User ownership validation
const validateOwnership = async (userId: string, capsuleId: string) => {
  const capsule = await Capsule.findById(capsuleId);
  return capsule?.userId.toString() === userId;
};
```

### **Data Validation**

```typescript
// Input validation with Zod
const capsuleSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().max(1000),
  recipientEmail: z.string().email(),
  timeLock: z.date().min(new Date()),
  password: z.string().optional()
});
```

---

## 🚀 Performance Optimization

### **Frontend Optimization**

```typescript
// Dynamic imports for code splitting
const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Image optimization with Next.js
import Image from 'next/image';
<Image src={imageUrl} alt="Description" width={500} height={300} />
```

### **Database Optimization**

```typescript
// Connection pooling
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Query optimization
const capsules = await Capsule.find({ userId })
  .select('title recipientName timeLock isDelivered')
  .sort({ createdAt: -1 })
  .limit(10);
```

### **Caching Strategy**

```typescript
// API response caching
export async function GET() {
  const cacheKey = `stats-${Date.now()}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }
  
  const stats = await generateStats();
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 minutes
  
  return NextResponse.json(stats);
}
```

---

## 🔄 State Management

### **React Context Pattern**

```typescript
// Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    // Login logic
  };

  const logout = async () => {
    // Logout logic
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **Form State Management**

```typescript
// React Hook Form with validation
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset
} = useForm<CapsuleFormData>({
  resolver: zodResolver(capsuleSchema)
});
```

---

## 📧 Email System Architecture

### **Email Service Layer**

```typescript
// Email service abstraction
interface EmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendCapsuleDeliveryEmail(capsule: Capsule): Promise<void>;
}

// Implementation with multiple providers
class EmailService implements EmailService {
  private provider: 'smtp' | 'resend';
  
  constructor(provider: 'smtp' | 'resend') {
    this.provider = provider;
  }
  
  async sendVerificationEmail(email: string, token: string) {
    if (this.provider === 'smtp') {
      return this.sendViaSMTP(email, token);
    } else {
      return this.sendViaResend(email, token);
    }
  }
}
```

### **Email Templates**

```typescript
// Template system
const emailTemplates = {
  verification: (token: string) => ({
    subject: 'Verify your AsmiVerse account',
    html: `
      <h1>Welcome to AsmiVerse!</h1>
      <p>Click the link below to verify your account:</p>
      <a href="${process.env.NEXTAUTH_URL}/verifyemail?token=${token}">
        Verify Account
      </a>
    `
  }),
  
  capsuleDelivery: (capsule: Capsule) => ({
    subject: `Your time capsule "${capsule.title}" is ready!`,
    html: `
      <h1>Your Time Capsule is Ready!</h1>
      <p>Hello ${capsule.recipientName},</p>
      <p>You have received a time capsule from ${capsule.userId}.</p>
      <a href="${process.env.NEXTAUTH_URL}/capsules/${capsule._id}">
        Unlock Your Capsule
      </a>
    `
  })
};
```

---

## 🔄 Background Jobs

### **Capsule Delivery System**

```typescript
// Cron job for capsule delivery
export async function GET() {
  try {
    const now = new Date();
    const unlockedCapsules = await Capsule.find({
      timeLock: { $lte: now },
      isDelivered: false
    }).populate('userId');

    for (const capsule of unlockedCapsules) {
      await sendCapsuleDeliveryEmail(capsule);
      await Capsule.findByIdAndUpdate(capsule._id, { isDelivered: true });
    }

    return NextResponse.json({ 
      success: true, 
      delivered: unlockedCapsules.length 
    });
  } catch (error) {
    console.error('Capsule delivery error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
```

---

## 🧪 Testing Architecture

### **Testing Strategy**

```typescript
// Unit tests for models
describe('Capsule Model', () => {
  it('should create a valid capsule', async () => {
    const capsuleData = {
      userId: new ObjectId(),
      title: 'Test Capsule',
      message: 'Test message',
      recipientName: 'John Doe',
      recipientEmail: 'john@example.com',
      timeLock: new Date(Date.now() + 86400000) // Tomorrow
    };

    const capsule = new Capsule(capsuleData);
    const savedCapsule = await capsule.save();

    expect(savedCapsule.title).toBe(capsuleData.title);
    expect(savedCapsule.isDelivered).toBe(false);
  });
});

// Integration tests for API routes
describe('Capsule API', () => {
  it('should create a capsule', async () => {
    const response = await request(app)
      .post('/api/Capsules')
      .send(capsuleData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.capsule.title).toBe(capsuleData.title);
  });
});
```

---

## 📊 Monitoring & Logging

### **Error Tracking**

```typescript
// Global error handler
export function errorHandler(error: Error, req: NextApiRequest, res: NextApiResponse) {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Send to external error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error);
  }

  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
}
```

### **Performance Monitoring**

```typescript
// API response time tracking
export function withPerformanceTracking(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    
    try {
      await handler(req, res);
    } finally {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} - ${duration}ms`);
    }
  };
}
```

---

## 🔄 Deployment Architecture

### **Vercel Deployment**

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

### **Environment Management**

```bash
# Development
.env.local

# Production (Vercel)
Environment Variables in Vercel Dashboard

# Staging
.env.staging
```

---

## 🚀 Scalability Considerations

### **Horizontal Scaling**

- **Stateless API Routes** - Can be scaled horizontally
- **MongoDB Atlas** - Automatic scaling and sharding
- **Cloudinary** - CDN for file delivery
- **Vercel** - Edge functions and global CDN

### **Performance Optimization**

- **Database Indexing** - Optimized queries
- **Caching** - Redis for frequently accessed data
- **CDN** - Static assets and file delivery
- **Code Splitting** - Lazy loading of components

### **Future Enhancements**

- **Microservices** - Split into smaller services
- **Message Queues** - Redis/RabbitMQ for background jobs
- **Load Balancing** - Multiple server instances
- **Database Sharding** - Distribute data across clusters

---

## 📈 Metrics & Analytics

### **Key Performance Indicators**

- **User Registration Rate**
- **Capsule Creation Rate**
- **Email Delivery Success Rate**
- **API Response Times**
- **Error Rates**

### **Monitoring Tools**

- **Vercel Analytics** - Performance monitoring
- **MongoDB Atlas** - Database performance
- **Cloudinary** - File delivery metrics
- **Custom Logging** - Application-specific metrics

---

This architecture provides a solid foundation for AsmiVerse's current needs while maintaining flexibility for future growth and enhancements. 