# Cloudflare Pages Deployment Guide

## Prerequisites

1. Cloudflare account
2. GitHub/GitLab repository with your code
3. Auth0 account configured
4. OpenRouter API key

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to Cloudflare Dashboard
2. Go to Workers & Pages
3. Click "Create application" > "Pages" > "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or your project root)

### 2. Environment Variables

Add the following environment variables in Cloudflare Pages settings:

```
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=https://your-domain.pages.dev
AUTH0_ISSUER_BASE_URL=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
DATABASE_URL=file:./dev.db
OPENROUTER_API_KEY=your-openrouter-api-key
```

### 3. Database Considerations

**Important**: SQLite file-based databases don't work well with serverless environments like Cloudflare Pages.

**Recommended Solutions**:

1. **Cloudflare D1** (Recommended for Cloudflare Pages):
   - Create a D1 database in Cloudflare Dashboard
   - Update Prisma schema to use D1
   - Update DATABASE_URL to use D1 connection string

2. **External Database**:
   - Use PostgreSQL (e.g., Supabase, Neon, or Railway)
   - Update Prisma schema datasource to `postgresql`
   - Update DATABASE_URL to your PostgreSQL connection string

### 4. Update Prisma for Production

If using Cloudflare D1:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
  // For D1, use: url = env("DATABASE_URL") // D1 connection string
}
```

If using PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Build Configuration

Update `package.json` build script if needed:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma migrate deploy"
  }
}
```

### 6. Auth0 Callback URLs

Update Auth0 application settings:

- **Allowed Callback URLs**: `https://your-domain.pages.dev/api/auth/callback`
- **Allowed Logout URLs**: `https://your-domain.pages.dev`
- **Allowed Web Origins**: `https://your-domain.pages.dev`

### 7. Deploy

1. Push your code to the connected repository
2. Cloudflare Pages will automatically build and deploy
3. Check build logs for any errors
4. Visit your deployed site

## Troubleshooting

### Database Issues

- SQLite files are not persistent in serverless environments
- Use Cloudflare D1 or external database for production

### Build Errors

- Check Node.js version (Cloudflare Pages supports Node.js 18+)
- Ensure all environment variables are set
- Check build logs for specific errors

### Auth0 Issues

- Verify callback URLs are correctly set
- Check environment variables are set in Cloudflare Pages
- Ensure AUTH0_BASE_URL matches your deployed domain

## Alternative: Cloudflare Workers

For better serverless support, consider using Cloudflare Workers with Next.js Edge Runtime or remix.

## Notes

- Cloudflare Pages has limitations with Next.js API routes
- Consider using Cloudflare Workers for API routes if needed
- File uploads may require Cloudflare R2 for storage
- Database migrations should be run as part of the build process

