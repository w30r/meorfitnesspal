# Product Guidelines

## Prose & Copy Style

- **Tone:** Direct, minimal, and encouraging. Write like a coach — clear, concise, motivating.
- **Voice:** Second-person ("you", "your"). Avoid first-person ("we", "our").
- **Length:** Short labels and microcopy. Headlines under 6 words. Descriptions under 25 words.
- **Numerics:** Always use numerals for numbers (3 days, not three days). Round calories/macros to whole numbers.
- **Units:** Display macros in grams (g), energy in kcal. Format: "150g protein", "2,000 kcal".
- **Dates:** Use relative dates when possible ("Today", "Yesterday") and absolute dates on hover. Format: "12 Jan 2026" for tooltips.
- **Empty States:** No bare empty screens. Every empty state must include a short message + a clear action (e.g., "No meals logged today. Tap + to add one.").

## Brand & Visual Identity

- **Minimalist Foundation:** Clean, uncluttered layouts. Generous whitespace. Every UI element must serve a clear purpose.
- **Dark Theme:** Default dark theme with high contrast. Light theme optional but not required.
- **Color Palette:**
  - Background: Near-black for maximum OLED contrast
  - Surface: Dark gray cards with subtle borders
  - Primary accent: Use a single accent color for interactive elements, progress bars, and highlights
  - Semantic colors: Green (positive/on-track), Red/Orange (over-limit/warning), Blue (informational)
- **Typography:** System font stack. Heavy weight (700-900) for key numbers and stats. Regular weight (400-500) for body text. No decorative fonts.
- **Iconography:** Use consistent icon set (Lucide icons). Icons should be small (14-16px) and used sparingly — they clarify, not decorate.
- **Spacing:** Use a consistent 4px spacing scale. Rounded corners on cards (border-radius: 2.5rem for main cards, smaller for inline elements).

## UX Principles

- **Data First:** The most important information (calories, macros, weight) must be immediately visible on the dashboard without scrolling.
- **One Tap Rule:** Common actions (logging food, navigating dates) should require at most one tap. Complex actions (AI parsing) at most three.
- **Scannable Dashboards:** Use visual hierarchy — large numbers, color-coded progress bars, small supporting labels. Users should understand their status in 3 seconds.
- **Progressive Disclosure:** Show summary data first, offer detail on tap. Don't overwhelm with all data at once.
- **Consistent Navigation:** Bottom nav with clear labels. No hidden gestures. Back navigation should always be available.
- **Feedback:** Every action must show immediate feedback (loading states, success indicators, error messages). No silent failures.
- **Forgiving Input:** Allow editing and deleting all logged data. Confirmation dialogs for destructive actions only (not for saves).
- **Offline Resilience:** Essential features (viewing today's log) should work with cached data when possible.

## Interaction Patterns

- **Date Navigation:** Swipe left/right or arrow buttons. Calendar picker for jumping to specific dates.
- **Data Entry:** Form-based input with smart defaults. AI parsing as an alternative to manual entry.
- **Progress Tracking:** Visual progress bars with color transitions (neutral → warm → red as limits approach).
- **Charts:** Interactive charts for trends. Tap to see exact values. Pinch to zoom on time ranges.

## Accessibility

- All interactive elements must be keyboard accessible
- Sufficient color contrast (WCAG AA minimum)
- Touch targets minimum 44x44px
- Labels for all form inputs
- Support for screen magnification up to 200%
