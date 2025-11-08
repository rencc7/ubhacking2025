# FitAI - Your Personal Fitness Coach

AI-powered fitness application with personalized workout plans, daily motivation check-ins, and progress tracking.

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Auth0 account (free tier available)
- OpenRouter API key (get from openrouter.ai)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   # Auth0 Configuration (get from auth0.com)
   AUTH0_SECRET=your-random-32-character-secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret

   # Database (SQLite - default)
   DATABASE_URL="file:./dev.db"

   # OpenRouter API (get from openrouter.ai)
   OPENROUTER_API_KEY=your-api-key
   ```

### Step 3: Set Up Auth0
1. Go to [auth0.com](https://auth0.com) and create a free account
2. Create a new Application:
   - Type: **Regular Web Application**
   - Technology: **Next.js**
3. Configure these settings in Auth0 Dashboard:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy your Domain, Client ID, and Client Secret to `.env`

### Step 4: Set Up OpenRouter
1. Go to [openrouter.ai](https://openrouter.ai) and create an account
2. Navigate to **Keys** section
3. Create a new API key
4. Copy the API key to your `.env` file

### Step 5: Generate AUTH0_SECRET
Generate a random secret (required for Auth0):
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```
Copy the output to `AUTH0_SECRET` in your `.env` file.

### Step 6: Set Up Database
```bash
npx prisma db push
```
This creates the SQLite database and sets up all tables.

### Step 7: Run the Application
```bash
npm run dev
```

### Step 8: Open in Browser
Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the FitAI landing page. Click "Get Started" to log in with Auth0.

## 📋 Features

- **AI-Powered Workout Plans**: Generate personalized workout schedules based on body type goals using OpenRouter AI
- **Daily Motivation Check-In**: Track your mood and motivation daily, build streaks
- **Progress Tracking**: Monitor weight, measurements, and visualize progress with charts
- **Achievement System**: Unlock badges for milestones and progress
- **Exercise Library**: Browse exercises with detailed instructions
- **Workout History**: View past completed workouts
- **Weekly Reports**: AI-generated progress summaries
- **Nutrition Tips**: Get personalized nutrition advice
- **Cozy, Minimalistic Design**: Warm, inviting UI with clean aesthetics

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: Auth0
- **AI Integration**: OpenRouter API
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## 🐛 Troubleshooting

### "Missing required environment variable: DATABASE_URL"
- Make sure you have a `.env` file with `DATABASE_URL="file:./dev.db"`

### Auth0 login not working
- Check that your callback URLs are correctly set in Auth0 Dashboard
- Verify all Auth0 environment variables are set correctly in `.env`
- Make sure `AUTH0_BASE_URL` matches `http://localhost:3000`

### OpenRouter API errors
- Verify your API key is correct in `.env`
- Check that you have credits in your OpenRouter account
- Ensure the API key has proper permissions

### Database errors
- Run `npx prisma generate` to regenerate Prisma Client
- Run `npx prisma db push` to sync your schema
- Check that the database file has proper permissions

### Port already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## 📚 Additional Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [cloudflare-pages.md](./cloudflare-pages.md) - Deployment guide for Cloudflare Pages

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Auth0 authentication
│   │   ├── workouts/     # Workout endpoints
│   │   ├── checkins/     # Daily check-in endpoints
│   │   └── progress/     # Progress tracking endpoints
│   ├── dashboard/         # Dashboard pages
│   │   ├── workouts/     # Workout management
│   │   ├── progress/     # Progress tracking
│   │   ├── exercises/    # Exercise library
│   │   └── reports/      # Weekly reports
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── DailyCheckIn.tsx  # Check-in modal
│   ├── WorkoutCard.tsx   # Workout display card
│   └── ProgressChart.tsx # Progress visualization
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── openrouter.ts     # OpenRouter API client
│   ├── workout-generator.ts # AI workout generation
│   └── achievements.ts   # Achievement system
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                 # TypeScript types
```

## 🚢 Deployment

### Cloudflare Pages

See [cloudflare-pages.md](./cloudflare-pages.md) for detailed deployment instructions.

Quick steps:
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add all environment variables in Cloudflare Pages settings
5. **Note**: SQLite doesn't work well in serverless environments. Use Cloudflare D1 or PostgreSQL for production.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Create database migration
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 📄 License

MIT

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify for your own use!
