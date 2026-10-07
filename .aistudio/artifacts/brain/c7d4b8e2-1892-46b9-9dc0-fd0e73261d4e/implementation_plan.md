# GENCRAFT — BUG FEST: Technical Debugging Competition Platform

A full-stack competition MVP designed for college technical symposiums, featuring a robust multi-round debugging arena for C and Python, a dedicated **Organizer Question Authoring & Bug Injection Suite**, live timer pacing, candidate monitoring, and authentic test-case verification.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural decisions below incorporate your specific requirements:
> - **Organizer Question Authoring for Every Round**: The Organizer has full control to create and enter custom buggy questions for Round 1, Round 2, and Round 3, specifying the buggy code snippet, bug description, expected output, language (C or Python), test cases, and marks.
> - **Flexible Question Bank & Quick Templates**: The Organizer Console provides both a direct "Add Custom Buggy Question" authoring modal and one-click starter templates, allowing organizers to build the competition question bank from scratch or customize existing questions.
> - **Organizer-Configured Timers & Progression**: Round durations and question limits are configured live by the Organizer, who controls when each round opens and progresses.
> - **Smart In-Browser Evaluator**: Client-side execution sandbox analyzing syntax, runtime errors, output streams, and assertion test cases with genuine C & Python compilation diagnostics.

- **Confirmed Decision 1**: The Organizer can add, edit, delete, publish, and customize buggy code questions for all rounds directly within the Organizer Dashboard, and updates immediately reflect in the participant's active round.
- **Confirmed Decision 2**: Initial realistic starter templates (20 for Round 1, 10 for Round 2, 5 for Round 3) are provided for immediate demonstration and can be edited, replaced, or expanded at any time by the organizer.
- **Confirmed Decision 3**: Strict separation of concerns between Participant Portal and Organizer Control Center, guaranteeing hidden test cases and solution code are never transmitted to participant clients.

---

## 1. Overview & Core Concept

- **What It Does**: GENCRAFT — BUG FEST enables organizers to set up technical debugging competitions by authoring buggy C/Python code snippets across 3 sequential rounds. Students log in with participant IDs (e.g. GC001, GC002), review the buggy code, run tests, fix errors, and submit solutions. Organizers monitor active sessions, review submissions, and control round transitions.
- **Target Audience / Persona**: College symposium coordinators, department heads, technical club organizers, and student competitors.
- **Key Value**: Hands-on question creation and real-time round management without requiring database setup or backend redeployment during the event.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Organizer Portal]
   │
   ├──> [Question Authoring Suite]
   │       ├── Select Round (Round 1 / Round 2 / Round 3)
   │       ├── Select Language (C or Python)
   │       ├── Input Title & Problem Statement
   │       ├── Paste/Write Buggy Code (with deliberate bugs)
   │       ├── Provide Reference Solution & Expected Output
   │       ├── Define Visible & Hidden Test Cases (Input/Output pairs)
   │       └── Set Marks, Difficulty, and Time Limit
   │
   ├──> [Round Configuration]
   │       ├── Set round status: Locked / Ready / Active / Completed
   │       └── Set round duration & per-question pacing
   │
   └──> [Live Monitor & Submissions]
           └── Inspect candidate code diffs and scores in real time

[Participant Portal]
   │
   └──> [Participant Login] ──> [Participant Dashboard]
                                    │
                                    ▼ (Enters Organizer-Configured Round)
                       [Code Editor & Bug Fix Arena]
                       (Loads questions authored by Organizer)
                                    │
                                    ▼ (Run Tests -> Submit)
                       [Round Results & Leaderboard]
```

### Visual Identity & Theme
- **Color Palette & Discipline**:
  - *Dominant Canvas (60%)*: Clean crisp white (`#FFFFFF`) with cool slate surface tones (`#F8FAFC`).
  - *Structural Surfaces (30%)*: High-contrast navy (`#0F172A`) for top navigation, code editor frames, and sidebar; hairline dividers (`#E2E8F0`).
  - *Accent Budget (10%)*: Technical sapphire blue (`#2563EB`) for primary execution actions; emerald (`#16A34A`) for passed test cases; ruby crimson (`#DC2626`) for syntax errors.
- **Organizer Question Authoring Interface**:
  - Multi-tab authoring drawer with live preview:
    1. *Problem Details*: Title, Round, Language, Marks, Difficulty.
    2. *Code & Bugs*: Side-by-side or stacked Buggy Code Editor and Correct Solution Editor with syntax highlighting.
    3. *Test Case Builder*: Interactive dynamic rows for adding input/output assertion pairs with a "Visible to Participant" toggle.
  - Quick action toolbar: "+ Add Question to Round 1", "+ Add Question to Round 2", "+ Add Question to Round 3", plus "Load Competition Presets" and "Export/Import Question Bank JSON".

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Organizer Authoring with Immediate Live Reactive Sync**:
  - *Approach*: Any question created or edited by the organizer in the Organizer Dashboard is saved to the centralized reactive store and immediately populates the participant arena.
  - *Why*: Allows organizers to prepare questions before the round starts, introduce surprise bonus questions, or fix typos on the fly during a live event.

- **Decision 2: Comprehensive Test Case Builder**:
  - *Approach*: Organizers define arbitrary test cases with standard input (`stdin`) and expected output (`stdout`). Participants can only see test cases flagged as `visible: true`. The evaluator checks both visible and hidden cases during grading.
  - *Why*: Ensures fair grading without allowing participants to game the system with hardcoded if-statements.

- **Decision 3: Smart In-Browser Code Runner & Diagnostics Engine**:
  - *Approach*: Encapsulated code execution simulator analyzing syntax, indentation, runtime errors, and expected outputs for both C and Python.
  - *Why*: Safe, immediate execution without server vulnerabilities, while prepared for Docker/Judge0 API integration.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GENCRAFT — BUG FEST                             │
├───────────────────────────────────┬────────────────────────────────────┤
│         PARTICIPANT ARENA         │       ORGANIZER COMMAND SUITE      │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Landing Page (Hero, Rules, FAQ) │ • Live Dashboard & Event Feeds     │
│ • Secure Participant Login        │ • QUESTION AUTHORING SUITE:        │
│ • Participant Dashboard & Rounds  │   - Add/Edit/Delete Buggy Code     │
│ • Split Code Editor & Navigation  │   - Test Case Builder (Vis/Hidden) │
│ • In-Browser Code Runner Console  │   - Round 1, 2, 3 Question Manager │
│ • Round Results & Final Scorecard │ • Round Timer & Progression Config │
│ • Public Leaderboard View         │ • Real-time Participant Monitor   │
│                                   │ • Submissions Inspector & Diffs    │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 CENTRALIZED STATE & EVALUATION CORE                    │
│ • QuestionStore (CRUD for Organizer, Sanitized Query for Participant)  │
│ • ExecutionService (C & Python Syntax & Test Evaluator)                │
│ • ScoringEngine (Mark weights, Partial Credit, Accuracy Calculation)  │
│ • TimerEngine (Organizer-configurable countdowns per round & question) │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Schema

- **Question**:
  - `id`: string (e.g. `q-r1-01`)
  - `round`: `1 | 2 | 3`
  - `language`: `'c' | 'python'`
  - `title`: string
  - `description`: string
  - `bugDescription`: string (explaining what bug the organizer planted)
  - `buggyCode`: string (the faulty code the participant must fix)
  - `correctSolution`: string (reference solution, hidden from candidate)
  - `expectedOutput`: string
  - `marks`: number
  - `difficulty`: `'Easy' | 'Medium' | 'Hard'`
  - `timeLimitMinutes`: number
  - `visibleTestCases`: Array<{ id: string, input: string, expectedOutput: string }>
  - `hiddenTestCases`: Array<{ id: string, input: string, expectedOutput: string }>
  - `isPublished`: boolean

- **RoundConfig**:
  - `roundId`: `1 | 2 | 3`
  - `title`: string
  - `description`: string
  - `durationMinutes`: number
  - `status`: `'locked' | 'ready' | 'active' | 'completed'`
  - `allowedLanguage`: `'all' | 'c' | 'python'`

---

## 5. Implementation Sequence

1. **State Store & Organizer Question Authoring Engine**:
   - Central reactive store with initial question sets across Rounds 1, 2, and 3, plus full CRUD operations (`addQuestion`, `updateQuestion`, `deleteQuestion`, `publishQuestion`, `resetQuestions`).
   - Rich Organizer Question Form with syntax highlighting, test-case builder, and bug annotation.
2. **Landing Page & Authentication**:
   - Technical navy/white theme, syllabus for Rounds 1/2/3, rules, FAQ.
   - Dual login routes (`/participant-login` with GC001/GC002/GC003 and `/organizer-login` with ORG001).
3. **Participant Arena**:
   - Dashboard with round progress gates controlled by organizer state.
   - Split code editor with syntax highlighting, line numbers, question navigation (1..N), test-case tabs, Run & Submit actions.
   - Immediate feedback, round completion summary, and Final 3-Round Scorecard.
4. **Organizer Command Console**:
   - Question management tab with "+ Add New Question" modal for Round 1, Round 2, or Round 3.
   - Round management tab to set durations, start/pause/lock rounds.
   - Participant live monitor grid and submission code diff inspector.
   - Public leaderboard visibility controls.
5. **Testing & Verification**:
   - Verify organizer adding a custom question and immediately solving it as participant.
   - Verify timer expiration and auto-submit.
   - Verify responsive layout across desktop, tablet, and mobile.
