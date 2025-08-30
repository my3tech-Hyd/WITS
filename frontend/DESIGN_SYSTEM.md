# WITS Job Portal - Design System

## Overview

The WITS Job Portal implements a professional, modern, and real-world UI design system using Material UI as the component library. The design system emphasizes consistency, accessibility, and user experience across all components.

## Design Principles

### 1. Professional & Modern
- Clean, minimalist design with professional color palette
- Modern typography using Inter font family
- Consistent spacing and elevation system
- Professional gradients and shadows

### 2. Responsive Design
- Mobile-first approach
- Breakpoint system: xs (0), sm (600px), md (960px), lg (1280px), xl (1920px)
- Flexible grid system that adapts to all screen sizes
- Touch-friendly interface elements

### 3. Accessibility
- High contrast ratios for text readability
- ARIA-compliant components
- Keyboard navigation support
- Screen reader friendly

### 4. Performance
- Optimized animations (60fps)
- Efficient re-renders
- Lazy loading where appropriate
- Minimal bundle size impact

## Color Palette

### Primary Colors
```css
Primary Blue: #1976d2
Primary Light: #42a5f5
Primary Dark: #1565c0
```

### Secondary Colors
```css
Secondary Red: #dc004e
Secondary Light: #ff5983
Secondary Dark: #9a0036
```

### Status Colors
```css
Success: #2e7d32 (Green)
Warning: #ed6c02 (Orange)
Error: #d32f2f (Red)
Info: #0288d1 (Blue)
```

### Neutral Colors
```css
Background: #f8f9fa
Paper: #ffffff
Text Primary: #212121
Text Secondary: #757575
```

## Typography

### Font Family
- Primary: Inter
- Fallback: Roboto, Helvetica, Arial, sans-serif

### Type Scale
```css
h1: 2.5rem (40px) - Font Weight: 700
h2: 2rem (32px) - Font Weight: 600
h3: 1.75rem (28px) - Font Weight: 600
h4: 1.5rem (24px) - Font Weight: 600
h5: 1.25rem (20px) - Font Weight: 600
h6: 1.125rem (18px) - Font Weight: 600
body1: 1rem (16px) - Font Weight: 400
body2: 0.875rem (14px) - Font Weight: 400
button: 0.875rem (14px) - Font Weight: 600
caption: 0.75rem (12px) - Font Weight: 400
```

## Component System

### Styled Components

#### AnimatedBox
- Provides fade-in and slide-in animations
- Configurable delay and animation type
- Hover effects with smooth transitions

#### HeroSection
- Full-width hero sections with gradient backgrounds
- Subtle pattern overlay
- Responsive text sizing

#### FeatureCard
- Interactive cards with hover animations
- Gradient backgrounds
- Consistent padding and spacing

#### JobCard
- Job listing cards with hover effects
- Left border accent on hover
- Responsive layout

#### StatsCard
- Statistics display cards
- Gradient backgrounds
- Hover animations

#### ActionButton
- Primary action buttons with ripple effects
- Gradient backgrounds
- Hover animations with scale effects

#### StatusChip
- Status indicators with color coding
- Gradient backgrounds
- Consistent sizing

### Button Variants

#### PrimaryButton
- Main call-to-action buttons
- Blue gradient background
- White text

#### SecondaryButton
- Secondary actions
- Outlined style with hover fill

#### SuccessButton
- Positive actions
- Green gradient background

#### WarningButton
- Caution actions
- Orange gradient background

## Animation System

### Keyframe Animations

#### fadeInUp
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### slideInLeft
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

#### pulse
```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### Transition System
- Duration: 0.2s - 0.3s for micro-interactions
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Hover effects: translateY(-2px to -4px)
- Scale effects: 1.05x for buttons

## Layout System

### Spacing
- Base unit: 8px
- Spacing scale: 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px
- Container padding: 16px (mobile), 24px (desktop)

### Grid System
- 12-column grid
- Responsive breakpoints
- Consistent gutters

### Container System
- PageContainer: Full-height pages with padding
- SectionContainer: Section spacing
- FormContainer: Centered forms with max-width

## Icon System

### Material Icons
- Consistent 24px base size
- Color inheritance from parent
- Responsive sizing (16px, 20px, 24px, 32px, 40px, 48px, 64px)

### Icon Usage
- Navigation: 20px
- Buttons: 18px
- Cards: 24px-40px
- Hero sections: 48px-64px

## Form Design

### Input Fields
- Rounded corners (8px border-radius)
- Focus states with primary color
- Hover effects
- Consistent padding and spacing

### Validation States
- Success: Green border and icon
- Error: Red border and helper text
- Warning: Orange border
- Info: Blue border

## Navigation

### App Bar
- Gradient background
- Consistent height (64px)
- Responsive navigation

### Drawer
- 280px width
- Gradient header
- Hover effects on menu items
- Selected state styling

## Responsive Behavior

### Mobile (< 600px)
- Single column layouts
- Stacked navigation
- Touch-friendly button sizes
- Reduced padding

### Tablet (600px - 960px)
- Two-column layouts where appropriate
- Side navigation
- Medium button sizes

### Desktop (> 960px)
- Multi-column layouts
- Permanent side navigation
- Full feature set
- Hover effects

## Accessibility Features

### Color Contrast
- Minimum 4.5:1 ratio for normal text
- Minimum 3:1 ratio for large text
- High contrast mode support

### Focus Management
- Visible focus indicators
- Logical tab order
- Skip links for main content

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Alt text for images
- Status announcements

## Performance Considerations

### Animation Performance
- GPU-accelerated transforms
- Efficient keyframe animations
- Reduced motion support

### Bundle Optimization
- Tree-shaking for unused components
- Lazy loading for routes
- Optimized imports

## Usage Guidelines

### When to Use Each Component

#### AnimatedBox
- Page sections that need entrance animations
- Cards that should animate in sequence
- Hero content

#### FeatureCard
- Feature highlights
- Service descriptions
- Product showcases

#### JobCard
- Job listings
- Application items
- Content cards with actions

#### StatsCard
- Dashboard statistics
- Metrics display
- KPI indicators

#### ActionButton
- Primary actions
- Form submissions
- Call-to-action buttons

### Animation Timing
- Page load: 0.2s - 0.6s delays
- Hover effects: 0.2s duration
- State changes: 0.3s duration
- Loading states: 1.5s duration

### Color Usage
- Primary: Main actions and branding
- Secondary: Accent elements
- Success: Positive feedback
- Warning: Caution states
- Error: Error states
- Info: Informational content

## Implementation Notes

### Theme Configuration
- Located in `src/theme/theme.js`
- Customizable color palette
- Typography overrides
- Component style overrides

### Styled Components
- Located in `src/components/StyledComponents.jsx`
- Reusable styled components
- Animation definitions
- Consistent styling patterns

### Usage Example
```jsx
import { AnimatedBox, PrimaryButton, StatsCard } from '../components/StyledComponents.jsx'

function MyComponent() {
  return (
    <AnimatedBox animation="fadeInUp" delay={0.2}>
      <StatsCard>
        <PrimaryButton>Action</PrimaryButton>
      </StatsCard>
    </AnimatedBox>
  )
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

### Planned Features
- Dark mode support
- Custom theme builder
- Advanced animation library
- Component playground
- Design token system

### Accessibility Improvements
- Voice navigation support
- High contrast themes
- Reduced motion preferences
- Screen reader optimizations

---

This design system ensures a consistent, professional, and accessible user experience across the WITS Job Portal application.
