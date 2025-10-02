# Domain Setup Guide for Coach Amjaad Website

## Recommended Domain Options

### 1. Coach Amjaad (Primary Recommendation)
- **coachamjaad.com**
- **coachamjaad.net**
- **amjaadgandeh.com**

### 2. Success Partner (Alternative)
- **successpartner.sa**
- **yoursuccesspartner.com**
- **successpartner-coaching.com**

### 3. Descriptive Options
- **amjaad-coaching.com**
- **eqcoach.sa**
- **emotionalintelligencecoach.com**

## Website Configuration Steps

### 1. Contact Information Updates
Update the following in `content.json`:

```json
{
  "whatsapp": {
    "phone": "+966XXXXXXXXX", // Add real phone number
    "message_ar": "مرحبا، أريد الاستفسار عن خدمات الكوتشينج",
    "message_en": "Hello, I would like to inquire about coaching services"
  },
  "footer": {
    "ar": {
      "contactInfo": {
        "email": "amjaad@coachamjaad.com", // Update with real email
        "phone": "+966 XX XXX XXXX", // Add real phone
        "address": "الرياض، المملكة العربية السعودية"
      }
    }
  }
}
```

### 2. Social Media Links
Update social media URLs in `content.json`:

```json
{
  "socials": [
    {
      "name": "LinkedIn",
      "url": "https://linkedin.com/in/amjaad-gandeh", // Update with real LinkedIn
      "icon": "/icons/linkedin.svg"
    },
    {
      "name": "Instagram", 
      "url": "https://instagram.com/coachamjaad", // Update with real Instagram
      "icon": "/icons/instagram.svg"
    },
    {
      "name": "Twitter",
      "url": "https://twitter.com/coachamjaad", // Update with real Twitter
      "icon": "/icons/x.svg"
    }
  ]
}
```

### 3. Email Setup
Recommended email addresses:
- **info@coachamjaad.com** - General inquiries
- **amjaad@coachamjaad.com** - Direct contact
- **support@coachamjaad.com** - Customer support

### 4. Blog Integration (Optional)
If you want to add a blog later:

1. Create `src/app/blog/page.tsx`
2. Add blog content management
3. Update navigation in `content.json`

### 5. Event Photos Section
For workshop/event photos:

1. Create `src/app/gallery/page.tsx`
2. Add image upload/management system
3. Consider using cloud storage (Cloudinary/AWS S3)

## SEO Optimization

### Meta Tags
Update in `src/app/layout.tsx`:

```typescript
export const metadata = {
  title: "Coach Amjaad - Professional Development & Emotional Intelligence",
  description: "Your Success Partner for confidence and excellence. Expert coaching in performance, productivity, and emotional intelligence.",
  keywords: "coaching, emotional intelligence, professional development, leadership, Saudi Arabia",
  author: "Amjaad Gandeh"
}
```

### Structured Data
Add coaching business schema:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Coach Amjaad",
  "description": "Professional Development and Emotional Intelligence Coaching",
  "provider": {
    "@type": "Person",
    "name": "Amjaad Gandeh"
  }
}
```

## Analytics Setup

### Google Analytics
1. Create GA4 property
2. Add tracking code to `src/app/layout.tsx`
3. Set up conversion tracking for consultation bookings

### Performance Monitoring
- Set up Vercel Analytics
- Monitor Core Web Vitals
- Track page load speeds

## Booking System Integration

### Recommended Tools
1. **Calendly** - Easy integration with coaching services
2. **Acuity Scheduling** - More advanced features
3. **Microsoft Bookings** - If using Office 365

### Implementation
```typescript
// Add to consultation CTA buttons
const bookingUrl = "https://calendly.com/coachamjaad/discovery-session";
```

## Payment Integration (Future)

### Recommended Payment Gateways
1. **Tabby** - Already mentioned in FAQ
2. **Tamara** - Already mentioned in FAQ  
3. **HyperPay** - Popular in Saudi Arabia
4. **PayTabs** - Regional payment gateway

## Deployment Checklist

### Pre-Launch
- [ ] Update all contact information
- [ ] Add real social media links
- [ ] Set up email addresses
- [ ] Configure domain DNS
- [ ] Test all forms and links
- [ ] Optimize images for web
- [ ] Test mobile responsiveness
- [ ] Set up SSL certificate

### Post-Launch
- [ ] Submit to Google Search Console
- [ ] Set up Google My Business (if applicable)
- [ ] Create social media profiles
- [ ] Set up analytics tracking
- [ ] Monitor website performance
- [ ] Gather initial client testimonials

## Maintenance

### Regular Updates
- Update service pricing
- Add new testimonials
- Refresh FAQ content
- Update professional photo
- Add workshop/event photos

### Technical Maintenance
- Keep Next.js updated
- Monitor security updates
- Backup website regularly
- Monitor website speed
- Check broken links monthly

## Content Strategy

### Blog Topics (Future)
1. "Understanding Emotional Intelligence in the Workplace"
2. "5 Signs You Need Performance Coaching"
3. "Building Resilience in Leadership"
4. "The Power of Self-Awareness in Career Growth"
5. "Creating Work-Life Balance Through EQ"

### Social Media Content
- Daily EQ tips
- Client success stories (with permission)
- Behind-the-scenes coaching insights
- Professional development quotes
- Workshop announcements

This setup guide ensures the website is ready for Amjaad's coaching business with all necessary configurations and future enhancement options.