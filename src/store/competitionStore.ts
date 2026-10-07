import { useState, useEffect } from 'react';
import {
  Question,
  Submission,
  RoundConfig,
  User,
  ParticipantSession,
  LeaderboardEntry,
  LiveScoreboardEntry,
  AuditLogEntry,
  RoundStatus,
  AccessCodeRecord,
  RoundLeaderboardFilter
} from '../types';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import { apiClient } from '../services/apiClient';

const STORAGE_KEYS = {
  CURRENT_USER: 'gencraft_bugfest_user_v5',
  SESSION_TEAM_ID: 'gencraft_bugfest_team_id_v5'
};

export const INITIAL_ACCESS_CODES: AccessCodeRecord[] = [
  {
    accessCode: 'BF-1001',
    userId: 'team-alpha',
    name: 'Team Alpha',
    teamName: 'Team Alpha',
    college: 'Institute of Engineering & Tech',
    createdAt: '2026-10-06 09:00',
    isUsed: true
  },
  {
    accessCode: 'BF-2002',
    userId: 'team-debuggers',
    name: 'Team Debuggers',
    teamName: 'Team Debuggers',
    college: 'National Institute of Tech',
    createdAt: '2026-10-06 09:05',
    isUsed: true
  },
  {
    accessCode: 'BF-3003',
    userId: 'team-codewarriors',
    name: 'Code Warriors',
    teamName: 'Code Warriors',
    college: 'Apex University College',
    createdAt: '2026-10-06 09:10',
    isUsed: true
  }
];

export const SAMPLE_USERS: Record<string, { user: User; passwordHash: string }> = {
  ORG001: {
    user: {
      id: 'usr-org001',
      userId: 'ORG001',
      accessCode: 'ORG-9999',
      name: 'Prof. K. Ramanathan',
      role: 'organizer',
      college: 'Gencraft Steering Committee',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Organizer'
    },
    passwordHash: 'admin123'
  }
};

const DEFAULT_ROUNDS: RoundConfig[] = [
  {
    roundId: 1,
    title: 'ROUND 1',
    subtitle: 'Basic Debugging',
    description: 'Find basic syntax flaws, uninitialized variables, indentation errors, and simple logic bugs in C & Python.',
    durationMinutes: 20,
    totalMarks: 100,
    questionCount: 20,
    status: 'active',
    allowedLanguage: 'all',
    bugfestCode: 'BF-R1-8K9M3P'
  },
  {
    roundId: 2,
    title: 'ROUND 2',
    subtitle: 'Core Programming & Debugging',
    description: 'Pointers, dynamic memory, structs, list references, recursion, custom exceptions, and algorithms.',
    durationMinutes: 25,
    totalMarks: 100,
    questionCount: 10,
    status: 'locked',
    allowedLanguage: 'all',
    bugfestCode: 'BF-R2-7X4W9Q'
  },
  {
    roundId: 3,
    title: 'ROUND 3',
    subtitle: 'Advanced Professional Debugging',
    description: 'Double free, dangling pointers, MRO diamond inheritance, underflow partitioning, and memory corruption.',
    durationMinutes: 30,
    totalMarks: 100,
    questionCount: 5,
    status: 'locked',
    allowedLanguage: 'all',
    bugfestCode: 'BF-R3-5N2J8L'
  }
];

class StoreEmitter {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }
}

const emitter = new StoreEmitter();

// Memory Caches synced with backend database
let cachedQuestions: Question[] = INITIAL_QUESTIONS;
let cachedRounds: RoundConfig[] = DEFAULT_ROUNDS;
let cachedCurrentUser: User | null = null;
let cachedParticipants: Record<string, ParticipantSession> = {};
let cachedSubmissions: Submission[] = [];
let cachedLeaderboardEnabled: boolean = true;
let isPollingStarted = false;

function loadSession<T>(key: string, fallback: T): T {
  try {
    const data = sessionStorage.getItem(key) || localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveSession<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export const competitionStore = {
  init() {
    if (!cachedCurrentUser) {
      cachedCurrentUser = loadSession(STORAGE_KEYS.CURRENT_USER, null);
    }
    this.startAutoSync();
  },

  // Real-time polling loop every 2 seconds
  startAutoSync() {
    if (isPollingStarted) return;
    isPollingStarted = true;

    const sync = async () => {
      try {
        const data = await apiClient.fetchOrganizerData();
        if (data) {
          if (data.rounds && data.rounds.length > 0) {
            // Map backend joinCode -> bugfestCode and merge with existing cached rounds
            // to preserve any locally generated bugfestCode values
            cachedRounds = data.rounds.map((incoming: RoundConfig) => {
              const existing = cachedRounds.find((r) => r.roundId === incoming.roundId);
              const resolvedBugfestCode =
                incoming.joinCode || incoming.bugfestCode || existing?.bugfestCode;
              return {
                ...(existing || {}),
                ...incoming,
                bugfestCode: resolvedBugfestCode,
                joinCode: incoming.joinCode
              };
            });
          }
          if (data.questions && data.questions.length > 0) {
            // Backend questions only have `testCases` (flat). Merge with INITIAL_QUESTIONS
            // to preserve visibleTestCases / hiddenTestCases the frontend needs.
            cachedQuestions = data.questions.map((bq: any) => {
              const local = INITIAL_QUESTIONS.find((q) => q.id === bq.id);
              const testCases = bq.testCases || (local ? [...(local.visibleTestCases || []), ...(local.hiddenTestCases || [])] : []);
              const visibleTestCases = local?.visibleTestCases ?? testCases.slice(0, 2);
              const hiddenTestCases = local?.hiddenTestCases ?? testCases.slice(2);
              return {
                ...(local || {}),
                ...bq,
                visibleTestCases,
                hiddenTestCases,
                testCases
              };
            });
          }

          if (data.participants) {
            const pMap: Record<string, ParticipantSession> = {};
            data.participants.forEach((p) => {
              pMap[p.userId] = p;
            });
            cachedParticipants = pMap;
          }
          emitter.notify();
        }
      } catch (err) {
        console.error('Auto sync error:', err);
      }
    };

    // Initial sync
    sync();

    // Poll every 2000ms
    setInterval(sync, 2000);
  },

  // Questions
  getQuestions(): Question[] {
    return cachedQuestions || INITIAL_QUESTIONS;
  },

  getQuestionsByRound(round: 1 | 2 | 3): Question[] {
    return this.getQuestions().filter((q) => q.round === round && q.isPublished !== false);
  },

  getAllQuestionsByRound(round: 1 | 2 | 3): Question[] {
    return this.getQuestions().filter((q) => q.round === round);
  },

  getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find((q) => q.id === id);
  },

  addQuestion(newQuestion: Omit<Question, 'id'> & { id?: string }): Question {
    const id = newQuestion.id || `R${newQuestion.round}-Q${String(Date.now()).slice(-4)}`;
    const fullQuestion: Question = { ...newQuestion, id };
    cachedQuestions = [fullQuestion, ...cachedQuestions];
    emitter.notify();
    return fullQuestion;
  },

  updateQuestion(id: string, updates: Partial<Question>) {
    cachedQuestions = cachedQuestions.map((q) => (q.id === id ? { ...q, ...updates } : q));
    emitter.notify();
  },

  deleteQuestion(id: string) {
    cachedQuestions = cachedQuestions.filter((q) => q.id !== id);
    emitter.notify();
  },

  duplicateQuestion(id: string): Question | null {
    const existing = this.getQuestionById(id);
    if (!existing) return null;
    const dupId = `R${existing.round}-Q${String(Date.now()).slice(-4)}`;
    const duplicated: Question = {
      ...existing,
      id: dupId,
      title: `${existing.title} (Copy)`,
      isPublished: false
    };
    cachedQuestions = [duplicated, ...cachedQuestions];
    emitter.notify();
    return duplicated;
  },

  resetToDefaultQuestions() {
    cachedQuestions = [...INITIAL_QUESTIONS];
    emitter.notify();
  },

  // Rounds
  getRounds(): RoundConfig[] {
    return cachedRounds || DEFAULT_ROUNDS;
  },

  getRound(roundId: 1 | 2 | 3): RoundConfig | undefined {
    return this.getRounds().find((r) => r.roundId === roundId);
  },

  getActiveRound(): RoundConfig {
    const active = this.getRounds().find((r) => r.status === 'active');
    return active || this.getRounds()[0];
  },

  /**
   * Generates a new random Bugfest round access code.
   * Format: BF-R{roundId}-XXXXXX (6 uppercase alphanumeric chars)
   */
  generateOrRegenerateRoundCode(roundId: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    return `BF-R${roundId}-${rand}`;
  },

  async updateRound(roundId: 1 | 2 | 3, updates: Partial<RoundConfig>) {
    // Map bugfestCode -> joinCode for the backend PATCH endpoint
    const payload: any = { ...updates };
    if (payload.bugfestCode !== undefined) {
      payload.joinCode = payload.bugfestCode;
      delete payload.bugfestCode;
    }
    // Send to backend DB
    const res = await apiClient.updateRound(roundId, payload);
    if (res.success && res.round) {
      const updatedRound = res.round;
      // Merge the updated round, preserving bugfestCode from updates
      cachedRounds = cachedRounds.map((r) =>
        r.roundId === roundId
          ? { ...r, ...updatedRound, bugfestCode: updates.bugfestCode ?? updatedRound.bugfestCode ?? r.bugfestCode }
          : r
      );
      emitter.notify();
    }
  },

  // Access Codes
  getAccessCodes(): AccessCodeRecord[] {
    return INITIAL_ACCESS_CODES;
  },

  batchGenerateOrganizerCodes(count: number = 5): AccessCodeRecord[] {
    const newCodes: AccessCodeRecord[] = [];
    for (let i = 0; i < count; i++) {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const accessCode = `BF-${codeNum}`;
      const record: AccessCodeRecord = {
        accessCode,
        userId: `team-${codeNum}`,
        name: `Team ${codeNum}`,
        teamName: `Team ${codeNum}`,
        college: 'Registered Institution',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isUsed: false
      };
      INITIAL_ACCESS_CODES.push(record);
      newCodes.push(record);
    }
    emitter.notify();
    return newCodes;
  },

  generateRandomParticipantCode(name: string, college: string): { accessCode: string; user: User } {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const accessCode = `BF-${codeNum}`;
    const userId = `team-${name.toLowerCase().replace(/[^a-z0-9]/g, '') || codeNum}`;
    const user: User = {
      id: `usr-${userId}`,
      userId,
      accessCode,
      name,
      teamName: name,
      college: college || 'Participant Institute',
      role: 'participant'
    };
    INITIAL_ACCESS_CODES.push({
      accessCode,
      userId,
      name,
      teamName: name,
      college: college || 'Participant Institute',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isUsed: false
    });
    emitter.notify();
    return { accessCode, user };
  },

  // Auth & Login
  getCurrentUser(): User | null {
    if (!cachedCurrentUser) {
      cachedCurrentUser = loadSession(STORAGE_KEYS.CURRENT_USER, null);
    }
    return cachedCurrentUser;
  },

  loginByCodeOrId(identifier: string): { success: boolean; user?: User; error?: string } {
    const clean = identifier.trim().toUpperCase();
    if (!clean) return { success: false, error: 'Please enter your credentials.' };

    if (clean === 'ORG001' || clean === 'ORG-9999' || clean === 'ORGANIZER') {
      const org = SAMPLE_USERS.ORG001.user;
      cachedCurrentUser = org;
      saveSession(STORAGE_KEYS.CURRENT_USER, org);
      emitter.notify();
      return { success: true, user: org };
    }

    return { success: false, error: 'Invalid Organizer ID or Password.' };
  },

  /**
   * Async Participant Login & Team Registration.
   * Registers Team in Backend Database (Locked permanently, generates unique team_id).
   * Validates Round Code against backend database rounds.
   */
  async loginParticipantWithTeamCode(teamName: string, bugfestCode: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanTeam = teamName.trim();
    const cleanCode = bugfestCode.trim().toUpperCase();

    if (!cleanTeam || !cleanCode) {
      return { success: false, error: 'Please enter both your Team Name and the active Bugfest Code.' };
    }

    // Step 1: Register or fetch locked Team in SQLite database
    const regRes = await apiClient.registerTeam(cleanTeam);
    if (!regRes.success || !regRes.team) {
      return { success: false, error: regRes.error || 'Failed to register team in database.' };
    }

    const team = regRes.team;

    // Step 2: Verify Round Code against backend DB
    const verifyRes = await apiClient.verifyRoundCode(team.id, cleanCode);
    if (!verifyRes.success || !verifyRes.round) {
      return { success: false, error: verifyRes.error || 'Invalid Round Code or round is not open.' };
    }

    const activeRound = verifyRes.round;

    // Step 3: Create user session
    const user: User = {
      id: team.id,
      userId: team.id,
      name: team.teamName,
      teamName: team.teamName,
      role: 'participant',
      college: 'Collegiate Technical Team',
      authenticatedRound: activeRound.roundId,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(team.teamName)}`
    };

    if (!cachedParticipants[team.id]) {
      cachedParticipants[team.id] = {
        userId: team.id,
        name: team.teamName,
        teamName: team.teamName,
        college: 'Collegiate Technical Team',
        accessCode: cleanCode,
        currentRound: activeRound.roundId,
        status: 'Active',
        totalScore: 0,
        roundScores: { 1: 0, 2: 0, 3: 0 },
        roundCompleted: { 1: false, 2: false, 3: false },
        codeDrafts: {},
        submissions: {},
        visitedQuestions: [`R${activeRound.roundId}-Q01`],
        timeRemainingSeconds: { 1: activeRound.durationMinutes * 60, 2: 25 * 60, 3: 30 * 60 },
        lastActive: 'Just now'
      };
    } else {
      cachedParticipants[team.id].currentRound = activeRound.roundId;
      cachedParticipants[team.id].status = 'Active';
    }

    cachedCurrentUser = user;
    saveSession(STORAGE_KEYS.CURRENT_USER, user);
    saveSession(STORAGE_KEYS.SESSION_TEAM_ID, team.id);

    emitter.notify();
    return { success: true, user };
  },

  getLiveScoreboard(currentTeamName?: string): LiveScoreboardEntry[] {
    const allParticipants = Object.values(cachedParticipants);
    const entries: LiveScoreboardEntry[] = allParticipants.map((p) => ({
      rank: 1,
      teamName: p.teamName || p.name,
      score: p.totalScore,
      isCurrentTeam: currentTeamName
        ? (p.teamName || p.name).trim().toLowerCase() === currentTeamName.trim().toLowerCase()
        : false
    }));

    entries.sort((a, b) => b.score - a.score);
    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    return entries;
  },

  login(userId: string): { success: boolean; user?: User; error?: string } {
    return this.loginByCodeOrId(userId);
  },

  logout() {
    cachedCurrentUser = null;
    sessionStorage.clear();
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TEAM_ID);
    emitter.notify();
  },

  // Participant Sessions
  getParticipantSession(userId: string): ParticipantSession | undefined {
    return cachedParticipants[userId];
  },

  getAllParticipants(): ParticipantSession[] {
    return Object.values(cachedParticipants);
  },

  updateParticipantSession(userId: string, updates: Partial<ParticipantSession>) {
    if (!cachedParticipants[userId]) return;
    cachedParticipants[userId] = {
      ...cachedParticipants[userId],
      ...updates
    };
    emitter.notify();
  },

  saveCodeDraft(userId: string, questionId: string, code: string) {
    const session = this.getParticipantSession(userId);
    if (!session) return;
    const drafts = { ...session.codeDrafts, [questionId]: code };
    this.updateParticipantSession(userId, { codeDrafts: drafts });
  },

  markQuestionVisited(userId: string, questionId: string) {
    const session = this.getParticipantSession(userId);
    if (!session) return;
    if (!session.visitedQuestions.includes(questionId)) {
      this.updateParticipantSession(userId, {
        visitedQuestions: [...session.visitedQuestions, questionId],
        currentQuestionId: questionId
      });
    } else {
      this.updateParticipantSession(userId, { currentQuestionId: questionId });
    }
  },

  async recordSubmission(userId: string, submission: Submission) {
    const session = this.getParticipantSession(userId);
    if (!session) return;

    // 1. Send submission to backend DB
    const apiRes = await apiClient.submitAnswer({
      teamId: userId,
      roundId: submission.round,
      questionId: submission.questionId,
      code: submission.submittedCode,
      passedCases: submission.testsPassed,
      totalCases: submission.totalTests,
      score: submission.marksEarned,
      status: submission.result
    });

    if (!apiRes.success) {
      alert(`Submission Error: ${apiRes.error}`);
      return;
    }

    // 2. Local update
    const participantSubmissions = {
      ...session.submissions,
      [submission.questionId]: submission
    };

    const roundScores = { ...session.roundScores };
    roundScores[submission.round] = apiRes.roundScore !== undefined ? apiRes.roundScore : (roundScores[submission.round] || 0);
    const totalScore = (roundScores[1] || 0) + (roundScores[2] || 0) + (roundScores[3] || 0);

    this.updateParticipantSession(userId, {
      submissions: participantSubmissions,
      roundScores,
      totalScore
    });

    cachedSubmissions = [submission, ...cachedSubmissions];
    emitter.notify();
  },

  async completeRound(userId: string, roundId: 1 | 2 | 3) {
    await apiClient.completeRound(userId, roundId);
    const session = this.getParticipantSession(userId);
    if (!session) return;

    const roundCompleted = {
      ...session.roundCompleted,
      [roundId]: true
    };

    let nextRound: 1 | 2 | 3 = roundId;
    if (roundId === 1) nextRound = 2;
    else if (roundId === 2) nextRound = 3;

    const isAllCompleted = roundCompleted[1] && roundCompleted[2] && roundCompleted[3];

    this.updateParticipantSession(userId, {
      roundCompleted,
      currentRound: nextRound,
      status: isAllCompleted ? 'Completed' : 'Active'
    });
  },

  getSubmissions(): Submission[] {
    return cachedSubmissions;
  },

  isLeaderboardEnabled(): boolean {
    return cachedLeaderboardEnabled;
  },

  setLeaderboardEnabled(enabled: boolean) {
    cachedLeaderboardEnabled = enabled;
    emitter.notify();
  },

  getLeaderboard(roundFilter: RoundLeaderboardFilter = 'overall'): LeaderboardEntry[] {
    const participants = this.getAllParticipants();

    const entries: LeaderboardEntry[] = participants.map((p) => {
      const subs = Object.values(p.submissions);

      let roundSolved = 0;
      let roundTotal = 0;
      let roundScore = 0;

      if (roundFilter !== 'overall') {
        const roundSubs = subs.filter((s) => s.round === roundFilter);
        roundSolved = roundSubs.filter((s) => s.result === 'Passed').length;
        roundTotal = roundSubs.length;
        roundScore = p.roundScores[roundFilter] || 0;
      }

      const totalSolved = subs.filter((s) => s.result === 'Passed').length;
      const totalCount = subs.length;

      const accuracy = roundFilter === 'overall'
        ? (totalCount > 0 ? Math.round((totalSolved / totalCount) * 100) : 0)
        : (roundTotal > 0 ? Math.round((roundSolved / roundTotal) * 100) : 0);

      return {
        rank: 0,
        participantName: p.teamName || p.name,
        userId: p.userId,
        accessCode: p.accessCode,
        college: p.college,
        round1Score: p.roundScores[1] || 0,
        round2Score: p.roundScores[2] || 0,
        round3Score: p.roundScores[3] || 0,
        totalScore: p.totalScore || 0,
        accuracy,
        questionsSolved: totalSolved,
        roundQuestionsSolved: roundSolved,
        roundScoreForFilter: roundScore,
        status: p.status,
        lastActive: p.lastActive
      };
    });

    entries.sort((a, b) => {
      if (roundFilter === 'overall') {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.accuracy - a.accuracy;
      } else {
        const scoreA = a.roundScoreForFilter || 0;
        const scoreB = b.roundScoreForFilter || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return b.accuracy - a.accuracy;
      }
    });

    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  },

  subscribe(listener: () => void) {
    return emitter.subscribe(listener);
  }
};

// Initialize competition store on import
competitionStore.init();

export function useCompetitionStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return competitionStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return competitionStore;
}
