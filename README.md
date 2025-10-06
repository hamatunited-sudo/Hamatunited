# Hamatunited Platform## Mohcareer — Production README

This repository contains a Next.js application (TypeScript + Tailwind) for the Mohcareer platform.

A modern, professional Next.js website for Hamatunited - a leading soil injection and geotechnical testing company in Dammam, Saudi Arabia.The instructions below focus on preparing, building, and running the app in a production environment, plus deployment notes for Vercel and Docker.

## Checklist (what this README covers)

## 🚀 Features- Install / prerequisites

- Environment variables and database note

- **Modern Design**: Clean, professional interface with warm brown/peach theme- Build and start (PowerShell-friendly)

- **Fully Responsive**: Optimized for all devices and screen sizes- Vercel quick-deploy

- **Arabic-First**: RTL support with proper Arabic typography- Docker example (optional)

- **Performance Optimized**: Fast loading times with Next.js 15 and React 19- Troubleshooting and common gotchas

- **SEO Ready**: Comprehensive metadata and OpenGraph tags## Prerequisites

- **Smooth Animations**: Engaging user experience with Tailwind CSS transitions- Node.js 18.x or newer (LTS recommended)

- **Interactive Components**: Dynamic navigation, section separators, and contact forms- npm 9.x or newer (or pnpm/yarn if you prefer — adjust commands)

- A production-compatible host (Vercel, Docker host, or any server that can run Node)

## 📋 Sections## Quick local (production) build and start (PowerShell)

Open PowerShell in the project root and run:

- **Hero**: Main landing section with company introduction and key features```powershell

- **About**: Company overview and expertise# install deps

- **Services**: Comprehensive list of geotechnical servicesnpm ci

- **Why Choose Us**: Highlighted advantages and guarantees# produce a production build

- **Process**: Step-by-step workflow explanation$env:NODE_ENV = 'production'; npm run build

- **Blog**: Link to external blog and resources# run the production server (listen on the port defined in process.env.PORT or default in package.json)

- **Contact**: Contact form and company information$env:NODE_ENV = 'production'; npm run start

- **Footer**: Quick links and contact details```

Notes:

## 🛠️ Tech Stack- The project uses Next.js — `npm run build` runs Next's build. `npm run start` runs the compiled production server.

- If you deploy to a server that sets environment variables differently, use your host's env configuration instead of the PowerShell one-liners above.

- **Framework**: Next.js 15.1.6 (App Router)## Environment variables

- **React**: 19.0.0Store sensitive values in environment variables on your host or deployment platform. Common variables the app may use:

- **TypeScript**: 5.x- NEXT_PUBLIC_API_URL — (optional) URL for the public API endpoints

- **Styling**: Tailwind CSS 3.4.17- DATABASE_URL or similar — connection string if the app integrates with a database

- **Font**: Noto Sans Arabic (Google Fonts)- NEXT_PUBLIC_... — any client-facing environment variables

- **Icons**: Inline SVG componentsCheck `src` and `src/app/api` routes for any additional keys the project expects. Do not commit .env files to source control.

- **Deployment**: Vercel-ready## Database

This repo includes a `database/schema.sql` file. To prepare your database in production, run the SQL in your preferred DB engine (MySQL/Postgres/etc.) and configure the connection string via environment variables.

## 📦 Installation## Deploying to Vercel (recommended for Next.js)

1. Sign in to Vercel and create a new project linked to this repository.

### Prerequisites2. Ensure the build command is `npm run build` and the output directory is the default for Next.js (no custom setting required).

3. Add any required environment variables in the Vercel dashboard (Environment > Variables).

- Node.js 18.x or newer (LTS recommended)4. Deploy — Vercel will run the build and host the app.

- npm 9.x or newerNotes:

- Use the `vercel.json` included in the repo (if present) to customize routing and rewrites.

### Local Development## Docker (example) — optional

The example below shows a minimal production Dockerfile to build and run the Next.js app.

```bash```dockerfile

# Clone the repository# syntax=docker/dockerfile:1

git clone https://github.com/hamatunited-sudo/Hamatunited.gitFROM node:18-alpine AS builder

cd HamatunitedWORKDIR /app

COPY package*.json ./

# Install dependenciesRUN npm ci --silent

npm installCOPY . .

RUN npm run build

# Run development server

npm run devFROM node:18-alpine AS runner

```WORKDIR /app

ENV NODE_ENV=production

Open [http://localhost:3000](http://localhost:3000) in your browser.COPY --from=builder /app/package*.json ./

COPY --from=builder /app/.next ./.next

## 🏗️ Production BuildCOPY --from=builder /app/public ./public

RUN npm ci --production --silent

```bashEXPOSE 3000

# Create production buildCMD ["node", ".next/standalone/server.js"]

npm run build```

Adjust the `CMD` to match your built server entrypoint if this repo uses a different output target.

# Start production server## CI/CD recommendations

npm run start- Run `npm ci` and `npm run build` in CI.

```- Run linters and TypeScript checks (`npm run lint`, `npm run typecheck`) if available.

- Cache node_modules or the npm/pnpm cache between CI runs to speed builds.

## 📁 Project Structure## Troubleshooting

- Build errors: run `npm run build` locally to reproduce. Inspect the stack trace and missing env vars.

```- Missing images or assets: confirm `public/` contents and Next config for image loaders.

├── src/- Port conflicts: production server uses `process.env.PORT` — set it explicitly on your host.

│   ├── app/## Where to look in this repo

│   │   ├── layout.tsx          # Root layout with providers- `src/` — application source

│   │   ├── page.tsx            # Home page- `public/` — static assets

│   │   └── globals.css         # Global styles and theme- `database/schema.sql` — database schema to run in production

│   ├── components/- `next.config.ts`, `vercel.json` — Next/Vercel configuration

│   │   ├── About.tsx## Next steps I can help with

│   │   ├── BlogSection.tsx- Create a `Dockerfile` and `docker-compose.yml` in the repo and test a local container build.

│   │   ├── ButtonSelector.tsx  # Click-to-select button behavior- Add a small CI workflow (GitHub Actions) for build/test/deploy.

│   │   ├── ContactSection.tsx- Create a small `.env.example` describing required env vars.

│   │   ├── Footer.tsxRequirements coverage

│   │   ├── Hero.tsx- "Continue updating this for production": Done — `README.md` updated with production steps and deployment guidance.

│   │   ├── Navbar.tsxIf you'd like, I can also create a `Dockerfile` and `./.github/workflows/ci.yml` next — which would you prefer I do now?

│   │   ├── Process.tsx
│   │   ├── SectionSeparator.tsx
│   │   ├── Services.tsx
│   │   ├── WhatsAppFloat.tsx
│   │   └── WhyChooseMe.tsx
│   ├── contexts/
│   │   ├── LanguageContext.tsx
│   │   └── UnifiedThemeContext.tsx
│   ├── hooks/
│   │   ├── useIntersectionObserver.ts
│   │   ├── useParallax.ts
│   │   ├── useScrollPosition.ts
│   │   ├── useSystemTheme.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── theme-utils.ts
│   │   ├── theme.ts
│   │   └── utils.ts
│   └── middleware.ts
├── public/
│   ├── HAMAT logo.svg
│   ├── HAMAT logo_White.svg
│   └── icons/
└── package.json
```

## 🎨 Theme & Styling

The platform uses a warm, professional color scheme:

- **Primary Brown**: `#46250A`
- **Secondary Brown**: `#2C1505`
- **Accent Peach**: `#F6A668`
- **Text**: White with various opacity levels

### Custom CSS Classes

- `.is-selected-outline`: Orange border for selected buttons
- `.is-selected`: Filled selected state
- `.is-selected-filled`: Accent background selected state

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy

The project includes `vercel.json` for optimal configuration.

### Environment Variables

No environment variables required for basic deployment. If you add features that need configuration, create a `.env.local` file:

```env
# Example
NEXT_PUBLIC_SITE_URL=https://www.hamatex.com
```

## 📱 Contact Information

- **Phone**: +966 13 565 0006
- **Email**: info@hamatex.com
- **Website**: www.hamatex.com
- **Blog**: www.geosoillab.com

## 🤝 Contributing

This is a private company website. For any changes or updates, please contact the development team.

## 📄 License

© 2025 Hamatunited. All rights reserved.

## 🔧 Development Notes

### Key Features Implementation

1. **Active Section Tracking**: Navigation automatically highlights the current section using IntersectionObserver
2. **Smooth Scrolling**: All internal navigation uses smooth scroll behavior
3. **Theme System**: Unified theme context with consistent color application
4. **Button Selector**: Global click handler for selectable buttons with `data-selectable` attribute
5. **WhatsApp Integration**: Floating WhatsApp button for easy contact

### Performance Optimizations

- Image optimization with Next.js Image component
- Font optimization with Next.js Font system
- CSS transitions with GPU acceleration
- Reduced motion support for accessibility

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Minimum viewport: 320px

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Conflicts

```bash
# Use different port
PORT=3001 npm run dev
```

### Styling Issues

- Ensure Tailwind CSS is properly configured
- Check `globals.css` for custom styles
- Verify theme context is providing values

## 📞 Support

For technical support or inquiries, contact:
- Email: hamatunited@gmail.com
- GitHub: @hamatunited-sudo
