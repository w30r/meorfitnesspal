# Plan

## Track: Enhance Dashboard with Richer Data Visualizations & Engagement

**Goal**: Transform the dashboard from a basic daily-log viewer into an engaging, insight-rich hub that motivates consistent logging through better visualizations and gamification.

---

### Phase 1: Dashboard Data Layer ✅

**Objective**: Unify the 4 separate `useEffect`/`useState` data fetches into a single cohesive data hook with a structured response type. Reduces loading jank and enables cross-data correlations for visualizations.

**Tasks**:
- ✅ 1.1 — Create `app/lib/dashboard.ts` with a shared `DashboardData` type and a `getDashboardData(date: string)` Server Action that returns all dashboard data (food logs, goals, weight avg, streak, achievements) in one call
- ✅ 1.2 — Create `hooks/useDashboard.ts` hook that wraps `getDashboardData` with loading/error state
- ✅ 1.3 — Refactor `app/page.tsx` to use the unified hook, removing individual server action calls
- ✅ 1.4 — Add loading skeleton components for dashboard cards

---

### Phase 2: Weekly Calorie & Nutrition Trend

**Objective**: Add a multi-series AreaChart showing the past 14 days of calorie intake vs. goal, with macro breakdown shown in the tooltip.

**Tasks**:
- 2.1 — Create Server Action `getWeeklyCalorieTrend(days: number)` returning daily totals (calories, protein, carbs, fats) + goal lines
- 2.2 — Build `components/charts/CalorieTrendChart.tsx` — AreaChart with gradient fill for calories, dashed goal line, rich tooltip showing macros
- 2.3 — Integrate into dashboard with proper card container and header
- 2.4 — Add empty state when no data exists for the selected range

---

### Phase 3: Macro Distribution Donut ✅

**Objective**: Visualize the current day's macro split (protein/carbs/fats) as percentages with goal comparison.

**Tasks**:
- ✅ 3.1 — Build `components/charts/MacroDonutChart.tsx` — Recharts PieChart donut showing actual macro grams and % alongside goal targets
- ✅ 3.2 — Integrate into dashboard below the existing KadUtama progress circles
- ✅ 3.3 — Add tooltip showing "Xg / Yg goal" for each macro

---

### Phase 4: Meal Breakdown

**Objective**: Show calorie distribution by meal (Breakfast, Lunch, Dinner, Etc) as a horizontal stacked bar or multi-bar chart.

**Tasks**:
- 4.1 — Extract meal breakdown data from the existing food log response (grouped by meal)
- 4.2 — Build `components/charts/MealBreakdownChart.tsx` — horizontal BarChart with colored bars per meal
- 4.3 — Integrate into dashboard with a summary header showing total meals logged today

---

### Phase 5: Achievements & Milestones ✅

**Objective**: Introduce a lightweight achievement system that rewards consistent logging and goal adherence, displayed as badge cards on the dashboard.

**Tasks**:
- ✅ 5.1 — Design achievement catalog (first log, 7d streak, 30d streak, goal hit 7 days straight, first weight log, 10kg milestone, etc.)
- ✅ 5.2 — Create `app/lib/achievements.ts` with `checkAndUnlockAchievements(userId)` and `getAchievements(userId)` Server Actions
- ✅ 5.3 — Store achievements in a new `achievement` MongoDB collection
- ✅ 5.4 — Build `components/AchievementBadges.tsx` — horizontal scrollable row of earned badges + locked previews
- ✅ 5.5 — Integrate into dashboard with celebration animation on new unlocks

---

### Phase 6: Enhanced Streak & Engagement ✅

**Objective**: Upgrade the basic streak counter into a more engaging mini-component with streak history, personal best, and next milestone.

**Tasks**:
- ✅ 6.1 — Enhanced streak computation: `streak` field now returns `StreakData` with current, personalBest, last7Days activity, nextMilestone, daysUntilNextMilestone
- ✅ 6.2 — Build `components/StreakCard.tsx` — shows current streak with flame icon, 7-dot mini activity row, personal best, and "Next: 14-day streak!" milestone
- ✅ 6.3 — Integrated into dashboard replacing the existing streak display

---

### Phase 7: Dashboard Layout Polish & Responsiveness ✅

**Objective**: Ensure the expanded dashboard looks polished on all screen sizes with proper loading, empty, and error states.

**Tasks**:
- ✅ 7.1 — Redesign dashboard grid layout using CSS Grid with responsive breakpoints (1col mobile, 2col tablet, 3col desktop)
- ✅ 7.2 — Add `LoadingSkeleton` component variants for each card type
- ✅ 7.3 — Add `EmptyState` component variant for each chart when no data
- ✅ 7.4 — Add smooth entrance animations using Tailwind `animate-*` utilities
- ✅ 7.5 — Full pass on dark theme contrast and spacing consistency

---

### Phase 8: Verification & Polish

**Objective**: Verify all phases complete, tests pass, lint clean, and commit protocol followed.

**Tasks**:
- 8.1 — `npm run lint` pass on all changed files
- 8.2 — Verify all new components render correctly in isolation
- 8.3 — Conductor - User Manual Verification 'Dashboard Enhancement Track' (Protocol in workflow.md)
- 8.4 — Update `conductor/setup_state.json` with current phase
