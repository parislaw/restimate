# Product Requirements Document (PRD)

## Product Name (Working)

**Restimate **(name is flexible, don’t get attached)

## One‑Liner

A practical web app that helps people plan daily breaks, annual time off, and personalized recovery habits—before burnout makes the decision for them.

---

## Problem Statement

Most people *know* they should rest more. Almost no one has a system that makes rest:

* Visible
* Planned
* Personalized
* Guilt‑free

Current tools:

* Calendars = neutral, not restorative
* Wellness apps = generic, fluffy, or preachy
* Productivity tools = optimize output, ignore recovery

Result: people wait until exhaustion forces rest. That’s reactive, not sustainable.

---

## Target User (MVP)

Primary:

* Knowledge workers, leaders, coaches, and high performers
* High autonomy, high cognitive load
* Already use calendars and task tools

Secondary (later):

* Teams / managers planning sustainable workloads

MVP user mindset:

> “I don’t need motivation. I need a smarter system.”

---

## Core Product Philosophy

1. **Rest is a design problem, not a willpower problem**
2. **Recovery must fit the person, not the ideal human**
3. **Planning rest upfront beats repairing burnout later**
4. **Simple beats comprehensive** (especially when tired)

---

## MVP Goals

The MVP should enable a user to:

1. Plan **regular daily breaks**
2. Visualize and plan **time off across the year**
3. Get **personalized recovery suggestions** aligned to how they recharge
4. Build *awareness*, not guilt

Non‑goals for MVP:

* Medical or mental health diagnosis
* Gamification overload
* Team analytics
* Social features

---

## Core Features (MVP)

### 1. Daily Break Planning

**User value:** Prevent cognitive overload during the day

**Requirements:**

* User selects:

  * Typical workday length
  * Preferred break frequency (e.g., every 60–120 mins)
  * Break duration options (5 / 10 / 15 mins)
* App generates a **simple break schedule**
* Visual timeline of work + breaks
* Gentle reminders (optional toggle)

**MVP Constraints:**

* No calendar write‑back initially (read‑only or manual export is fine)
* No productivity tracking

---

### 2. Time‑Off Planning (Macro Recovery)

**User value:** Avoid the “I haven’t taken a break in 8 months” moment

**Requirements:**

* User inputs:

  * Known fixed time off (holidays, vacations)
  * Desired recovery cadence (e.g., long weekend every quarter)
* App displays:

  * Year view with recovery density (light / medium / heavy)
  * Gaps where no recovery is planned
* Simple prompts like:

  * “This is a 14‑week stretch with no time off”

**MVP Constraints:**

* No PTO approval workflows
* No HR integrations

---

### 3. Recovery Style Profiling (Lightweight)

**User value:** Stop forcing recovery methods that don’t work for them

**Requirements:**

* Short assessment (6–10 questions max)
* Outputs a **Recovery Style** (examples):

  * Social Recharger
  * Solo Decompressor
  * Physical Resetter
  * Mental Unplugger
* Each style maps to:

  * Effective break ideas
  * Effective time‑off suggestions

**MVP Constraints:**

* Deterministic logic (no ML needed)
* No personality labeling language that feels clinical

---

### 4. Recovery Action Library

**User value:** Remove decision fatigue during breaks

**Requirements:**

* Small, curated list of recovery actions
* Actions tagged by:

  * Time needed
  * Energy level
  * Recovery style
* Examples:

  * 5‑min: eyes‑off‑screen reset
  * 10‑min: walk + sunlight
  * 30‑min: intentional disconnect block

**MVP Constraints:**

* Static content initially
* No user‑generated content yet

---

### 5. Gentle Insight & Reflection

**User value:** Build awareness without shame

**Requirements:**

* Simple insights such as:

  * “You’re planning fewer breaks on Fridays”
  * “Your longest recovery gap is coming up”
* Optional weekly reflection prompt

**MVP Constraints:**

* No scoring, streaks, or red‑alert warnings

---

## User Flow (MVP)

1. Landing → Value clarity (why rest planning matters)
2. Quick onboarding:

   * Work rhythm
   * Recovery style
3. Dashboard:

   * Today’s breaks
   * Upcoming recovery (week + year view)
4. Action suggestion during breaks
5. Weekly check‑in

---

## UX Principles

* Calm, not busy
* Human language, not wellness jargon
* No judgmental copy
* Optimized for low‑energy moments

---

## Tech & Architecture (High Level)

* Frontend: React / Next.js
* Backend: Lightweight API (Supabase / Firebase acceptable)
* Auth: Email or magic link
* Data stored per user:

  * Preferences
  * Break plans
  * Time‑off plans
  * Recovery style

---

## Success Metrics (MVP)

* % of users who complete setup
* % who schedule at least one break
* % who return after 7 days
* Qualitative feedback: “This made me think differently about rest”

---

## Risks & Mitigations

* **Risk:** App feels like another thing to manage

  * *Mitigation:* Minimal inputs, calm UI
* **Risk:** Recovery suggestions feel generic

  * *Mitigation:* Strong recovery style framing

---

## Future Enhancements (Not MVP)

* Calendar integrations
* Team views
* Adaptive suggestions via behavior
* Manager dashboards
* Wearable data

---

## MVP Definition of Done

The MVP is successful if a user can:

* Plan their day with breaks
* See their recovery across the year
* Feel personally understood
* Leave with at least one behavior change

---

## Final Note to Builders

This is not a productivity app pretending to care about rest.
It is a recovery system that respects ambition.
Build accordingly.
