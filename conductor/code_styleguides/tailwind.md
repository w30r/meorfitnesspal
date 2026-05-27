# Tailwind CSS Style Guide

## Organization

- Use Tailwind utility classes directly in JSX. Avoid custom CSS unless absolutely necessary.
- Extract repeated utility patterns into React components — not custom CSS classes.
- Use `cn()` utility (from `@/lib/utils`) for conditional class merging.
- Use `clsx` for simple conditional classes when `twMerge` overhead isn't needed.

## Naming & Structure

- **Custom classes:** Only use `@layer components` in `globals.css` for global overrides (scrollbar, selection colors)
- **Color scheme:** Use CSS variables defined in `globals.css` via `@theme` or CSS custom properties
- **Responsive:** Use Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`). Always mobile-first.
- **Dark mode:** The app uses a forced dark theme (`.dark` class on `<html>`) — no light mode variants needed.

## Spacing & Sizing

- Use the Tailwind spacing scale (`p-4`, `gap-2`, `mt-6`). Avoid arbitrary values (`p-[17px]`) except for pixel-perfect alignment.
- Card border radius: `rounded-[2.5rem]` for main cards, `rounded-full` for icons, `rounded-lg` for inline elements.
- Max content width: `max-w-2xl mx-auto` for the main column.

## Typography

- Font sizes: `text-xs` (labels), `text-sm` (body), `text-lg` (headings), `text-2xl` (stat values), `text-5xl` (hero numbers)
- Font weights: `font-medium` (body), `font-bold` (labels), `font-black` (stat values)
- Tracking: `tracking-wider` or `tracking-[0.2em]` for uppercase labels

## Animations

- Use Tailwind's built-in `animate-spin` for loading states
- Use `transition-all duration-700 ease-out` for progress bar animations
- Use `motion` library (imported as `motion`) for enter/exit animations on components
- Blur/glow effects: `blur-3xl` with absolute positioning for decorative backgrounds

## Key Patterns

- Card component: `bg-card border border-border rounded-[2.5rem] p-4 shadow-sm`
- Navigation header: `sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border`
- Loading: `animate-pulse bg-muted rounded-[2.5rem]` for skeleton states
- Progress bar: `h-3 w-full bg-secondary rounded-full overflow-hidden` with dynamic width child
