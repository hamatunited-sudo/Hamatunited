# Coach Amjaad - Professional Coaching & Development Website

Your Success Partner - Empowering Your Journey to Confidence and Excellence

## About

This is a professional coaching website for Amjaad Gandeh, an expert in people development, emotional intelligence, and organizational culture. The website showcases her coaching services and helps potential clients book discovery sessions.

## Features

- **Bilingual Support** (Arabic/English)
- **Responsive Design** for all devices
- **Modern UI/UX** with smooth animations
- **Service Packages** with detailed pricing
- **Client Testimonials** section
- **FAQ** section with coaching information
- **Contact Integration** with WhatsApp
- **Dark/Light Theme** support

## Services Offered

### Individual Coaching
1. **Performance & Productivity Coaching**
   - Goal setting and performance preparation
   - Productivity enhancement
   - Progress tracking and accountability

2. **Emotional Intelligence & Resilience Coaching**
   - EQ assessments and development
   - Self-awareness building
   - Stress management and resilience

### Enterprise Solutions
- Team development programs
- Organizational culture consulting
- Leadership coaching
- Group EQ assessments

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd coachamjaad

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
npm run build
npm start
```

## Content Management

The website content is managed through JSON files:
- `content.json` - Main content including text, services, testimonials
- Content is structured for easy updates and translations

### Updating Services
Edit the `services` section in `content.json`:
- Add/modify service packages
- Update pricing
- Change descriptions and features

### Updating Contact Information
Update the `whatsapp` and `footer` sections in `content.json` with:
- Phone number
- Email address
- Social media links

## Domain Options

Based on the client questions, consider these domain names:
1. **coachamjaad.com** (Recommended)
2. **successpartner.com**
3. **yoursuccesspartner.com**

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Customization

### Adding New Sections
1. Create new component in `/src/components/`
2. Add content structure to `content.json`
3. Import and use in main page

### Modifying Themes
- Colors and themes are defined in `tailwind.config.ts`
- Theme context is in `/src/contexts/UnifiedThemeContext.tsx`

### Adding Languages
The website supports bilingual content. To add more languages:
1. Extend content structure in `content.json`
2. Update language context
3. Add language toggle options

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Deploy automatically on git push
3. Configure custom domain

### Other Platforms
The website can be deployed to:
- Netlify
- AWS Amplify
- Digital Ocean App Platform

## Future Enhancements

Based on client requirements:
1. **Blog Integration** - Can be added when needed
2. **Event Photos Section** - For workshops and seminars
3. **Booking System Integration** - With calendar scheduling
4. **Payment Gateway** - For service payments
5. **Client Portal** - For existing clients

## Support

For technical support or content updates, contact the development team.

## License

Private - All rights reserved to Amjaad Gandeh © 2025