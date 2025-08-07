# UI Style Guide

This guide summarizes the main design tokens and best practices for maintaining a consistent UI in this project.

---

## Colors

**Primary Colors:**
- Blue: `#008CFF`
- Pink: `#FF1493`
- Yellow: `#FFCC00`
- Green: `#00CC66`
- Purple: `#9933FF`
- Orange: `#FF6600`

**Backgrounds:**
- Dark: `#000000`
- Card: `#1a1a1a`
- Overlay (light): `rgba(0, 0, 0, 0.5)`
- Overlay (dark): `rgba(0, 0, 0, 0.8)`

**Text:**
- White: `#ffffff`
- Gray 300: `#d1d5db`
- Gray 400: `#9ca3af`
- Gray 600: `#4b5563`
- Gray 800: `#1f2937`

**Borders:**
- Dark: `#1f2937`
- Light: `#374151`

---

## Typography

**Font Family:**
- Sans: `font-sans` (Geist, Helvetica Neue, Arial, sans-serif)
- Light: `font-light`

**Font Sizes:**
- xs: `text-xs`
- sm: `text-sm`
- base: `text-base`
- lg: `text-lg`
- xl: `text-xl`
- 2xl: `text-2xl`
- 3xl: `text-3xl`
- 4xl: `text-4xl`

**Tracking:**
- Tight: `tracking-tight`
- Tighter: `tracking-tighter`

---

## Spacing

**Container Padding:**
- `px-4`

**Max Widths:**
- sm: `max-w-xl`
- md: `max-w-4xl`
- lg: `max-w-6xl`
- xl: `max-w-7xl`

**Section Padding:**
- `py-32`
- Section break: `py-8`

---

## Effects & Transitions

- Hover: `hover:scale-105`, `hover:opacity-90`
- Focus: `focus:outline-none`, `focus:ring-2`
- Transitions: `transition-colors`, `transition-opacity`, `transition-all`
- Durations: `duration-200`, `duration-300`

---

## Best Practices

- **Always use theme variables or Tailwind classes for colors, fonts, and spacing.**
- **Avoid hardcoding style values in components.**
- **Use shared UI components and reference the theme for consistency.**
- **Update this guide if you add new design tokens or major style changes.**

---

For more details, see `src/theme/theme.ts` and `src/styles/global.css`. 