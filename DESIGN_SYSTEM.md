# Nacx Lift Design System

A comprehensive design system for the Nacx Lift gym tracking application, inspired by Apple's design principles and modern web standards.

## Design Philosophy

**Clarity** - Every element should have a clear purpose and meaning
**Deference** - The interface should enhance user experience without competing for attention  
**Depth** - Visual hierarchy and layering guide user focus and comprehension

## Color Palette

### Primary Colors
- **Blue 600**: `#2563eb` - Primary action buttons, links, and active states
- **Blue 700**: `#1d4ed8` - Hover states for primary actions
- **Blue 500**: `#3b82f6` - Secondary blue elements
- **Blue 100**: `#dbeafe` - Light blue backgrounds for status indicators

### Neutral Colors
- **Slate 900**: `#0f172a` - Primary text, headings
- **Slate 800**: `#1e293b` - Dark accent backgrounds
- **Slate 700**: `#334155` - Secondary text
- **Slate 600**: `#475569` - Tertiary text, placeholders
- **Slate 500**: `#64748b` - Muted text, helper text
- **Slate 400**: `#94a3b8` - Dividers, inactive elements
- **Slate 300**: `#cbd5e1` - Borders, light dividers
- **Slate 200**: `#e2e8f0` - Card borders, light backgrounds
- **Slate 100**: `#f1f5f9` - Very light backgrounds
- **Slate 50**: `#f8fafc` - Page backgrounds

### Semantic Colors
- **Red 600**: `#dc2626` - Error states, destructive actions
- **Red 50**: `#fef2f2` - Error backgrounds
- **Emerald 600**: `#059669` - Success states, completed items
- **Emerald 100**: `#dcfce7` - Success backgrounds
- **Yellow 600**: `#d97706` - Warning states, pending items
- **Yellow 100**: `#fef3c7` - Warning backgrounds

### Gradients
- **Primary Brand**: `from-blue-600 to-purple-600`
- **Page Background**: `from-slate-50 via-white to-slate-50`
- **Loading Background**: `from-slate-50 to-slate-100`
- **Dark Card**: `from-slate-900 to-slate-800`

## Typography

### Font Families
- **Primary**: System font stack (SF Pro on Apple, Segoe on Windows, etc.)
- **Monospace**: For code or technical data display

### Text Scales
- **Hero**: `text-4xl sm:text-5xl` (36px/48px) - Main landing headings
- **Page Title**: `text-3xl` (30px) - Page headers
- **Section Title**: `text-xl` (20px) - Card and section headers
- **Large Body**: `text-lg` (18px) - Descriptions, important content
- **Body**: `text-base` (16px) - Standard text
- **Small**: `text-sm` (14px) - Helper text, labels
- **Extra Small**: `text-xs` (12px) - Captions, fine print

### Font Weights
- **Bold**: `font-bold` - Headlines, emphasis
- **Semibold**: `font-semibold` - Subheadings, important labels
- **Medium**: `font-medium` - Button text, form labels
- **Normal**: `font-normal` - Body text

## Spacing System

### Padding/Margin Scale
- **xs**: `1` (4px) - Tight spacing
- **sm**: `2` (8px) - Small spacing
- **md**: `3` (12px) - Medium spacing
- **lg**: `4` (16px) - Large spacing
- **xl**: `6` (24px) - Extra large spacing
- **2xl**: `8` (32px) - Section spacing
- **3xl**: `12` (48px) - Page section spacing

### Component Spacing
- **Card Padding**: `p-8` (32px) - Standard card internal spacing
- **Form Spacing**: `space-y-6` (24px) - Between form fields
- **Button Padding**: `px-6 py-3` - Standard button padding
- **Small Button**: `px-4 py-2` - Compact button padding

## Layout & Grid

### Containers
- **Max Width**: `max-w-7xl` (1280px) - Page content container
- **Form Width**: `max-w-3xl` (768px) - Form containers
- **Horizontal Padding**: `px-6 sm:px-8` - Page margins

### Grid Systems
- **Card Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Form Grid**: `grid-cols-1 md:grid-cols-2` - Two-column forms
- **Detail Grid**: `grid-cols-1 lg:grid-cols-3` - Detail page layout

### Responsive Breakpoints
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Small desktops
- **xl**: 1280px - Large desktops

## Components

### Navigation
```html
<nav class="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
  <!-- Navigation content -->
</nav>
```

### Cards
```html
<!-- Standard Card -->
<div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  <!-- Card content -->
</div>

<!-- Interactive Card -->
<div class="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  <!-- Card content with group hover states -->
</div>
```

### Buttons
```html
<!-- Primary Button -->
<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200">
  Secondary Action
</button>

<!-- Loading Button -->
<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium" disabled>
  <div class="flex items-center justify-center">
    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
    Loading...
  </div>
</button>
```

### Form Elements
```html
<!-- Input Field -->
<div>
  <label class="block text-sm font-medium text-slate-700 mb-2">
    Field Label <span class="text-red-500">*</span>
  </label>
  <input 
    type="text"
    class="block w-full rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3"
    placeholder="Placeholder text"
  />
  <p class="mt-2 text-xs text-slate-500">Helper text</p>
</div>

<!-- Select Field -->
<select class="block w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3">
  <option value="">Choose an option</option>
</select>

<!-- Textarea -->
<textarea 
  rows="4"
  class="block w-full rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors px-4 py-3"
  placeholder="Enter description..."
></textarea>

<!-- Checkbox -->
<label class="flex items-center cursor-pointer">
  <input
    type="checkbox"
    class="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors"
  />
  <span class="ml-3 text-sm font-medium text-slate-700">Checkbox label</span>
</label>
```

### Status Indicators
```html
<!-- Success Status -->
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
  Completed
</span>

<!-- Warning Status -->
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
  Pending
</span>

<!-- Info Status -->
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
  Active
</span>
```

### Loading States
```html
<!-- Spinner -->
<div class="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>

<!-- Page Loading -->
<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
  <div class="flex flex-col items-center space-y-4">
    <div class="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
    <p class="text-slate-600 font-medium">Loading...</p>
  </div>
</div>
```

### Progress Bars
```html
<div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
  <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out" style="width: 65%"></div>
</div>
```

### Error States
```html
<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
  <div class="flex items-center">
    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>
    <span class="font-medium">Error message here</span>
  </div>
</div>
```

## Animation & Transitions

### Standard Transitions
- **Colors**: `transition-colors duration-200`
- **All Properties**: `transition-all duration-300`
- **Transform**: `transition-transform duration-200`
- **Opacity**: `transition-opacity duration-300`

### Hover Effects
- **Cards**: Scale subtle shadow increase
- **Buttons**: Color transitions
- **Links**: Color and underline transitions
- **Icons**: Transform translations (arrows)

### Loading Animations
- **Spinner**: `animate-spin`
- **Progress**: `transition-all duration-500 ease-out`

## Icon Usage

### Icon Library
Using Heroicons (outline style) for consistency

### Common Icons
- **Navigation**: Arrow right, arrow left, home
- **Actions**: Plus, edit, trash, check
- **Status**: Check circle, exclamation triangle, information circle
- **UI**: Bars (menu), X (close), search

### Icon Sizing
- **Small**: `w-4 h-4` - Inline with text
- **Medium**: `w-5 h-5` - Button icons
- **Large**: `w-6 h-6` - Card headers, prominent actions
- **Extra Large**: `w-8 h-8` - Empty states, hero sections

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have clear focus states
- Status colors are paired with icons or text

### Focus States
- All interactive elements have visible focus rings
- Focus rings use `focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Form labels associated with inputs
- Button vs link semantic usage

## Implementation Guidelines

### File Organization
- Keep design tokens in CSS custom properties or Tailwind config
- Create reusable component classes for repeated patterns
- Document any custom utility classes

### Performance
- Use backdrop-blur sparingly (performance impact)
- Optimize images and use appropriate formats
- Lazy load non-critical content

### Responsiveness
- Mobile-first approach
- Test on multiple screen sizes
- Ensure touch targets are minimum 44px
- Consider tablet landscape orientations

### Browser Support
- Modern evergreen browsers
- Graceful degradation for older browsers
- Progressive enhancement approach

## Brand Guidelines

### Logo Usage
- Gradient logo mark: Blue to purple gradient
- Monogram: "N" in white on gradient background
- Always maintain clear space around logo

### Voice & Tone
- **Professional**: Clear, direct communication
- **Encouraging**: Positive, motivational language
- **Helpful**: Informative without being overwhelming
- **Concise**: Respect user's time and attention

### Content Guidelines
- Use active voice
- Write in second person ("your workout", "you can")
- Keep microcopy helpful and actionable
- Use consistent terminology throughout the app

## Future Considerations

### Dark Mode
- Prepare color palette for dark theme
- Test contrast ratios in dark mode
- Consider user preference detection

### Animation Library
- Consider Framer Motion for complex animations
- Maintain performance with animation choices
- Respect user's motion preferences

### Component Library
- Build reusable component library
- Document component props and usage
- Create Storybook for component development

---

This design system ensures consistency, accessibility, and scalability across the Nacx Lift application while maintaining the premium, Apple-inspired aesthetic.