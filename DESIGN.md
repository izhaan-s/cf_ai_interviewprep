# Cloudflare Design System

This project uses Cloudflare's brand colors and design aesthetic.

## Color Palette

### Primary Colors
- **Cloudflare Orange**: `hsl(16 100% 60%)` - #FF6633
  - Used for primary actions, highlights, and brand elements
  - Primary foreground: White

### Neutral Colors
- **Background**: White (light mode), Dark slate (dark mode)
- **Foreground**: Dark gray text
- **Muted**: Light gray backgrounds for secondary elements

## Typography

- **Font Family**: Inter (sans-serif)
  - Clean, modern, and highly legible
  - Similar to Cloudflare's typography choices

## Design Principles

1. **Clean & Modern**: Minimalist design with clear hierarchy
2. **Orange Accents**: Strategic use of Cloudflare orange for CTAs and important elements
3. **Subtle Gradients**: Light orange tints in backgrounds
4. **Clear Typography**: Bold headers with good contrast
5. **Card-based Layout**: Clean cards with subtle borders
6. **Icon Integration**: Lucide icons with orange tints
7. **Responsive**: Mobile-first design approach

## Components

- All shadcn/ui components themed with Cloudflare colors
- Buttons use orange primary color
- Form inputs have orange focus rings
- Cards have subtle borders with orange hover states

## Usage

The color system is defined in `src/app/globals.css` using CSS custom properties:
- Light mode: `:root`
- Dark mode: `.dark`

All components automatically use these theme colors through Tailwind's semantic color classes.

