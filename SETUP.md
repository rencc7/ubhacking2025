# Setup Instructions

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `env.example` to `.env` and fill in your credentials:
   ```bash
   cp env.example .env
   ```

   Edit `.env` and add:
   - Auth0 credentials (get from auth0.com)
   - OpenRouter API key (get from openrouter.ai)
   - DATABASE_URL will be set automatically for SQLite

3. **Set up the database**:
   ```bash
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Auth0 Setup

1. Go to [auth0.com](https://auth0.com) and create an account
2. Create a new Application:
   - Application Type: **Regular Web Application**
   - Technology: **Next.js**
3. Configure Application Settings:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Copy the following from Auth0 Dashboard:
   - Domain (e.g., `your-app.auth0.com`)
   - Client ID
   - Client Secret
5. Add them to your `.env` file:
   ```
   AUTH0_ISSUER_BASE_URL=https://your-app.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_SECRET=use-openssl-rand-hex-32-to-generate
   AUTH0_BASE_URL=http://localhost:3000
   ```

## OpenRouter Setup

1. Go to [openrouter.ai](https://openrouter.ai) and create an account
2. Navigate to Keys section
3. Create a new API key
4. Add it to your `.env` file:
   ```
   OPENROUTER_API_KEY=your-api-key
   ```

## Generate AUTH0_SECRET

You can generate a random secret using:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Or use any random 32+ character string.

## Database

The app uses SQLite by default. The database file will be created at `prisma/dev.db` when you run `npx prisma db push`.

For production, consider using:
- Cloudflare D1 (if deploying to Cloudflare Pages)
- PostgreSQL (Supabase, Neon, Railway)
- MySQL

## Troubleshooting

### "Missing required environment variable: DATABASE_URL"
- Make sure you have a `.env` file with `DATABASE_URL="file:./dev.db"`

### Auth0 login not working
- Check that your callback URLs are correctly set in Auth0
- Verify environment variables are set correctly
- Make sure AUTH0_BASE_URL matches your local URL

### OpenRouter API errors
- Verify your API key is correct
- Check that you have credits in your OpenRouter account
- Ensure the API key has proper permissions

### Database errors
- Run `npx prisma generate` to regenerate Prisma Client
- Run `npx prisma db push` to sync your schema
- Check that the database file has proper permissions

## Next Steps

1. Create your first workout plan
2. Set up daily check-ins
3. Track your progress
4. Unlock achievements!

For deployment instructions, see `cloudflare-pages.md`.

