# EcoScan & Sort - Full Stack Application

AI-powered recycling scanner app with a complete backend infrastructure.

## 🏗️ Project Structure (Monorepo)

```
ecoscan-n-sort/
├── packages/
│   ├── frontend/          # React frontend application
│   └── backend/           # Express.js backend API
├── package.json           # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Install all dependencies (root + workspaces)
npm install

# Install dependencies in both frontend and backend
cd packages/frontend && npm install
cd ../backend && npm install
cd ../..
```

### Development

#### Option 1: Run Both (Recommended)
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 5000) concurrently.

#### Option 2: Run Separately

**Backend:**
```bash
npm run dev:backend
# or
cd packages/backend
npm run dev
```

**Frontend:**
```bash
npm run dev:frontend
# or
cd packages/frontend
npm run dev
```

### Environment Setup

**Backend** (`packages/backend/.env`):
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./data/ecoscan.db
```

**Frontend** (`packages/frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Features

### Frontend
- ✅ React 18 with Vite
- ✅ React Router for navigation
- ✅ TensorFlow.js for AI scanning
- ✅ Tailwind CSS for styling
- ✅ Responsive mobile-first design
- ✅ Real-time camera scanning
- ✅ API integration

### Backend
- ✅ Express.js REST API
- ✅ SQLite database (easily upgradeable to PostgreSQL)
- ✅ JWT authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Input validation
- ✅ API endpoints:
  - `/api/auth` - Authentication (register, login)
  - `/api/scans` - Scan management
  - `/api/leaderboard` - Leaderboard data
  - `/api/analytics` - Analytics and statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Scans
- `POST /api/scans` - Create a scan (optional auth)
- `GET /api/scans/my-scans` - Get user's scans (auth required)
- `GET /api/scans/stats` - Get scan statistics (auth required)

### Leaderboard
- `GET /api/leaderboard?type=school&limit=10` - Get leaderboard
- `POST /api/leaderboard/update` - Update leaderboard entry
- `POST /api/leaderboard/seed` - Seed default data

### Analytics
- `GET /api/analytics/today` - Get today's statistics
- `GET /api/analytics/global` - Get global statistics
- `GET /api/analytics/daily?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get daily stats

### Health
- `GET /health` - Health check endpoint

## 🗄️ Database

The backend uses SQLite by default with the following schema:

- **users** - User accounts
- **scans** - Scan history
- **leaderboard** - Leaderboard entries
- **sessions** - User sessions
- **daily_stats** - Daily statistics

Database file is stored at: `packages/backend/data/ecoscan.db`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd packages/frontend && npm test

# Run backend tests (if implemented)
cd packages/backend && npm test
```

## 📦 Building for Production

```bash
# Build both frontend and backend
npm run build

# Build separately
npm run build:frontend
npm run build:backend
```

## 🔒 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ Error handling without exposing internals

## 🌐 Deployment

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend
The backend can be deployed to:
- Heroku
- Railway
- AWS EC2/ECS
- DigitalOcean
- Render

**Note:** For production, switch to PostgreSQL and update the database configuration.

## 📝 Environment Variables

See `.env.example` files in each package for required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

- TensorFlow.js for AI capabilities
- React team for the amazing framework
- Express.js for the backend framework
