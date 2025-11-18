<<<<<<< HEAD
# NextSaaS - Modern SaaS Template Collection 

A comprehensive, modern Next.js 15 SaaS template collection with 20+ homepage variations and complete inner pages. Built with React 19, TypeScript, Tailwind CSS 4, and cutting-edge web technologies for SaaS businesses, startups, and web applications.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-blue)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-green)
![Lenis](https://img.shields.io/badge/Lenis-1.0.38-orange)

## 📦 What's Included

- ✅ **Complete Source Code** - Full Next.js 15 project
- ✅ **20+ Homepage Variations** - Different layouts and styles
- ✅ **50+ Inner Pages** - Authentication, pricing, blog, and more
- ✅ **500+ Components** - Reusable React components
- ✅ **Documentation** - Comprehensive setup guide
- ✅ **Free Updates** - Future improvements included
- ✅ **Premium Support** - Email support from our team

## ✨ Features

### 🏠 **34+ Homepage Variations**

- Multiple design styles for different business needs
- Crypto, Finance, Analytics, SaaS, and more themes
- Modern layouts with unique hero sections and components

### 📄 **Complete Page Collection**

- **Authentication**: Login/Signup pages with multiple variants
- **Pricing**: Multiple pricing page designs with feature comparisons
- **Blog**: Blog listing, details, and markdown support
- **About**: Team, company story, and mission pages
- **Services**: Service listings and detailed service pages
- **Contact**: Contact forms with integrated maps
- **Legal**: Privacy policy, terms, GDPR compliance pages
- **Support**: FAQ, documentation, and help pages

### 🎨 **Modern Design System**

- **Dark/Light Mode**: Seamless theme switching with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: GSAP and Lenis for premium interactions
- **Interactive Components**: Sliders, modals, and dynamic elements
- **Professional UI**: Clean, modern design with consistent spacing

### ⚡ **Performance & Developer Experience**

- **Next.js 15**: Latest features with Turbopack support
- **TypeScript**: Full type safety and better developer experience
- **Component Architecture**: Reusable, modular components
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks
- **Conventional Commits**: Structured commit messages with Commitlint

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom component library
- **Animations**: GSAP 3.13, Lenis smooth scrolling
- **Maps**: Leaflet with React integration
- **Content**: Markdown support with gray-matter
- **Theme**: next-themes for dark/light mode
- **Development**: ESLint, Prettier, Husky, lint-staged

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Download & Extract

1. **Download** the template files from ThemeForest
2. **Extract** the ZIP file to your development directory
3. **Navigate** to the project folder:

```bash
cd nextsaas-next
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
nextsaas-next/
├── public/                     # Static assets
│   ├── images/                # Images organized by components
│   ├── icons/                 # SVG icons and graphics
│   └── favicon.ico           # Site favicon
├── src/
│   ├── app/                  # Next.js 15 App Router
│   │   ├── (pages)/         # Route groups for different pages
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout component
│   ├── components/          # React components
│   │   ├── homepage-*/      # Homepage variations (01-20)
│   │   ├── authentication/  # Login/signup components
│   │   ├── pricing-*/       # Pricing page components
│   │   ├── blog-*/          # Blog-related components
│   │   ├── shared/          # Reusable components
│   │   │   ├── header/      # Navigation components
│   │   │   ├── footer/      # Footer components
│   │   │   └── ui/          # Base UI components
│   │   └── ui/              # Core UI components
│   ├── context/             # React contexts
│   ├── data/                # Static data and content
│   │   ├── blogs/           # Markdown blog posts
│   │   ├── services/        # Service descriptions
│   │   └── team/            # Team member data
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # CSS modules and styles
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Available Pages

### Homepage Variations

Access different homepage designs:

- `/` - Default homepage (Homepage 01)
- `/homepage-02` through `/homepage-20` - Additional variations

### Core Pages

- **Authentication**: `/login-01`, `/signup-01`, `/login-02`, etc.
- **Pricing**: `/signup-01`, `/signup-01`, `/signup-01`
- **About**: `/about-01`, `/about-02`, `/about-03`
- **Blog**: `/blog-01`, `/blog-02`, `/blog-03`, `/blog/[slug]`
- **Services**: `/our-services-01`, `/our-services/[slug]`
- **Team**: `/our-team-01`, `/team/[slug]`
- **Features**: `/features-01`, `/features-02`
- **Contact**: `/contact-us`
- **Legal**: `/privacy`, `/terms-conditions`, `/gdpr`

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Code Quality Tools

This project uses several tools to maintain code quality:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only
- **Commitlint**: Enforce conventional commit messages

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
feat: add new homepage variation.
fix: resolve responsive layout issue.
docs: update installation guide.
```

## 🎨 Customization

### Theme Customization

1. **Colors**: Edit `src/styles/variables.css` for color schemes
2. **Typography**: Modify font settings in `src/utils/font.ts`
3. **Components**: Customize components in `src/components/ui/`
4. **Tailwind**: Update `tailwind.config.ts` for design tokens

### Adding New Pages

Here's a complete example of creating a new "Portfolio" page:

#### Step 1: Create the Page Route

Create `src/app/portfolio/page.tsx`:

```tsx
import Portfolio from '@/components/portfolio/Portfolio';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - NextSaaS',
  description: 'Showcase of our amazing projects and work',
};

const PortfolioPage = () => {
  return (
    <>
      <NavbarOne />
      <Portfolio />
      <FooterOne />
    </>
  );
};

export default PortfolioPage;
```

#### Step 2: Create Page Components

Create `src/components/portfolio/Portfolio.tsx`:

```tsx
import Image from 'next/image';
import RevealAnimation from '@/components/animation/RevealAnimation';

const portfolioData = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: '/images/portfolio/project-1.jpg',
    description: 'Modern e-commerce solution built with Next.js',
  },
  // Add more portfolio items...
];

const Portfolio = () => {
  return (
    <section className="pb-[100px] pt-[100px]">
      <div className="main-container">
        <div className="text-center space-y-3 mb-14">
          <RevealAnimation delay={0.3}>
            <h1 className="max-w-[742px] mx-auto">Our Portfolio</h1>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="max-w-[482px] mx-auto">Discover our latest projects and creative solutions</p>
          </RevealAnimation>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {portfolioData.map((item, index) => (
            <RevealAnimation delay={0.5 + index * 0.1} key={item.id}>
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="bg-background-2 dark:bg-background-5 rounded-[20px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <span className="text-sm text-primary">{item.category}</span>
                    <h3 className="text-heading-5">{item.title}</h3>
                    <p className="text-body-text">{item.description}</p>
                  </div>
                </div>
              </div>
            </RevealAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
```

#### Step 3: Add Navigation Link

Update the header component to include the new page. In `src/components/shared/header/NavbarOne.tsx`, add:

```tsx
// Add to the navigation items array
{
  id: 7,
  name: 'Portfolio',
  path: '/portfolio',
},
```

#### Step 4: Add Data (Optional)

Create `src/data/portfolio.ts` for dynamic content:

```tsx
export const portfolioItems = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: '/images/portfolio/project-1.jpg',
    description: 'Modern e-commerce solution built with Next.js',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: 'https://example.com',
  },
  // Add more items...
];
```

#### Step 5: Add Images

Place your portfolio images in:

```
public/images/portfolio/
├── project-1.jpg
├── project-2.jpg
└── project-3.jpg
```

#### Step 6: Test Your Page

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/portfolio`
3. Check that the page loads correctly
4. Test navigation from the header menu

**That's it!** Your new portfolio page is ready with proper routing, components, navigation, and SEO metadata.

### Content Management

- **Blog Posts**: Add markdown files in `src/data/blogs/`
- **Services**: Update service data in `src/data/services/`
- **Team Members**: Modify team data in `src/data/team/`
- **Static Content**: Edit component files directly

## 🏗️ Building for Production

### Build Process

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Build Output

- Static assets are optimized and compressed
- JavaScript is minified and tree-shaken
- CSS is purged and optimized
- Images are automatically optimized by Next.js

### Performance Features

- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for better performance
- **Bundle Analysis**: Built-in bundle analyzer

## 🚀 Deployment

### Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js application:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The project can be deployed to:

- **Netlify**: Static site deployment with automatic builds
- **Railway**: Full-stack deployment with database support
- **DigitalOcean**: App Platform with automatic scaling
- **AWS**: Amplify or EC2 for enterprise solutions
- **Hostinger**: Shared hosting with Node.js support

### Deployment Guide

1. **Build the project**: Run `npm run build` locally to test
2. **Choose platform**: Select your preferred hosting provider
3. **Configure environment**: Set up any required environment variables
4. **Deploy**: Follow platform-specific deployment instructions

Need help with deployment? Contact us at [hello@pixel71.com](mailto:hello@pixel71.com)

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📖 Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed development workflow
- [Component Documentation](https://nextsaas-documentation.vercel.app/nextjs/get-started) - Usage guide

## 📧 Support & Contact

We provide comprehensive support for all our customers:

- **Email Support**: [hello@pixel71.com](mailto:hello@pixel71.com)
- **Response Time**: Within 24 hours on business days
- **Support Includes**:
  - Installation assistance
  - Bug fixes and troubleshooting
  - Customization guidance
  - Feature clarifications

---

**Made by [Pixel71](mailto:hello@pixel71.com)**

\_Happy coding!
||||||| empty tree
=======
# PILAR SYSTEMS - AI-Powered Fitness Studio SaaS Platform

A fully production-ready, automated multichannel AI SaaS platform for fitness studios.

## Features

### Core Platform
- **Complete Authentication System** - Supabase Auth with email/password, magic link, password reset, and email verification
- **Stripe Billing Integration** - Full subscription management with setup fees and add-ons
- **7-Step Onboarding Wizard** - Guided setup for studio information, integrations, and AI rules
- **Comprehensive Dashboard** - KPIs, charts, activity timeline, and analytics

### AI Automation
- **WhatsApp AI** - Automated responses, lead qualification, and follow-up sequences
- **Phone AI** - Missed call handling, voicemail transcription, and AI summaries
- **Email AI** - Inbox classification, auto-replies, and lead conversion
- **Lead Engine** - Automatic A/B/C classification and prioritization
- **Follow-up Engine** - Multichannel automated sequences

### Modules
- **Leads Management** - Unified inbox, detail pages, A/B/C classification
- **Messages** - WhatsApp and Email unified chat with AI auto-replies
- **Phone AI** - Call logs, transcripts, and AI-generated summaries
- **Calendar** - Event management with Google Calendar integration
- **Growth Analytics** - Conversion tracking, KPIs, and custom filters
- **Settings** - Studio info, team invites, AI rules, and billing portal

### Integrations
- WhatsApp Cloud API
- Twilio (Phone & SMS)
- Google Calendar OAuth
- Email IMAP/SMTP
- n8n Automation Workflows

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## Database Schema

The platform includes 12 comprehensive database tables:
- users, workspaces, subscriptions
- wizard_progress, integrations
- leads, messages, call_logs
- followups, calendar_events
- ai_rules, activity_logs, tasks

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Stripe account
- OpenAI API key
- Twilio account (for phone integration)
- WhatsApp Business API access
- Google Cloud project (for Calendar API)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in all required values.

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Create Stripe products:
```bash
npx ts-node scripts/create-stripe-products.ts
```

Add the returned price IDs to your `.env` file.

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `OPENAI_API_KEY` - OpenAI API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `WHATSAPP_API_TOKEN` - WhatsApp Business API token
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `ENCRYPTION_KEY` - 64-character hex key for encrypting integration credentials

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Run the product creation script:
```bash
npx ts-node scripts/create-stripe-products.ts
```
4. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/stripe/webhooks`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

## n8n Automation Setup

1. Set up an n8n instance (self-hosted or cloud)
2. Import the workflow JSON files from `n8n-workflows/`
3. Configure webhook URLs in your n8n workflows
4. Set the `N8N_WEBHOOK_URL` environment variable

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file is already configured for production deployment.

### Post-Deployment

1. Configure Stripe webhooks to point to your production URL
2. Set up WhatsApp webhook URL in Meta Business Manager
3. Configure Twilio webhook URLs for incoming calls
4. Test all integrations

## Project Structure

```
pilarsystems/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── onboarding/        # Onboarding wizard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── ...
├── lib/                   # Utility libraries
├── services/              # Business logic services
│   ├── ai/               # AI automation services
│   ├── integrations/     # Integration services
│   └── stripe/           # Stripe services
├── types/                 # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
├── scripts/              # Utility scripts
├── n8n-workflows/        # n8n workflow exports
└── public/               # Static assets
```

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Leads
- `GET /api/leads` - List leads
- `POST /api/leads` - Create lead
- `GET /api/leads/[id]` - Get lead details
- `PATCH /api/leads/[id]` - Update lead

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations/[leadId]` - Get conversation

### Webhooks
- `POST /api/stripe/webhooks` - Stripe webhook handler
- `POST /api/webhooks/whatsapp` - WhatsApp webhook handler
- `POST /api/webhooks/twilio` - Twilio webhook handler

## Security

- All integration credentials are encrypted at rest
- Rate limiting on all API endpoints
- CORS restrictions
- Input validation with Zod
- Supabase Auth for authentication
- Stripe for secure payment processing

## Support

For issues and questions, please open an issue on GitHub or contact support@pilarsystems.com

## License

Proprietary - All rights reserved

## Contributing

This is a private project. Contributions are by invitation only.

---

Built with ❤️ by PILAR SYSTEMS
>>>>>>> origin/devin/1763501109-production-ready-saas-platform
