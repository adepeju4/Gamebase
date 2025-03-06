# Deploying to Vercel

This guide will help you deploy your full-stack application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. The [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but helpful)

## Steps to Deploy

### 1. Push your code to a Git repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Set up Environment Variables

You'll need to set up the following environment variables in your Vercel project:

- `NODE_ENV`: Set to "production"
- `KEY`: Your Stream Chat API key
- `SECRET`: Your Stream Chat API secret
- `CONNECT_API`: Your MongoDB connection string

### 3. Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "New Project"
3. Import your Git repository
4. Configure your project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run vercel-build
   - Output Directory: dist
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

#### Option 2: Using the Vercel CLI

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel login` and follow the prompts
3. In your project directory, run `vercel`
4. Follow the prompts to configure your project
5. To deploy to production, run `vercel --prod`

## Troubleshooting

If you encounter issues with your deployment:

1. Check the Vercel deployment logs
2. Ensure all environment variables are set correctly
3. Make sure your MongoDB database is accessible from Vercel's servers (check network permissions)
4. Verify that your API routes are correctly configured in the `vercel.json` file

## Local Development

For local development, continue using:

```bash
npm run dev
```

This will start both the client and server in development mode.
