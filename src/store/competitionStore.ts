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

const STORAGE_KEYS = {
  QUESTIONS: 'gencraft_bugfest_questions_v4',
  ROUNDS: 'gencraft_bugfest_rounds_v4',
  CURRENT_USER: 'gencraft_bugfest_user_v4',
  PARTICIPANTS: 'gencraft_bugfest_participants_v4',
  SUBMISSIONS: 'gencraft_bugfest_submissions_v4',
  LEADERBOARD_ENABLED: 'gencraft_bugfest_lb_enabled_v4',
  ACCESS_CODES: 'gencraft_bugfest_access_codes_v4',
  AUDIT_LOGS: 'gencraft_bugfest_audit_logs_v4'
};

/**
 * Cryptographically secure random Bugfest Code generator.
 * Generates an unguessable alphanumeric code (e.g. BF-R1-8K9M3P).
 */
export function generateSecureBugfestCode(roundId: 1 | 2 | 3): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(6);
    crypto.getRandomValues(arr);
    for (let i = 0; i < 6; i++) {
      randomStr += chars[arr[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      randomStr += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `BF-R${roundId}-${randomStr}`;
}

/**
 * Generates random 4-digit numeric pin with prefix (e.g. BF-4821)
 */
export function generateRandomPin(prefix = 'BF'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

/**
 * Constant-time string comparison to prevent timing analysis attacks on code verification.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  const cleanA = a.trim().toUpperCase();
  const cleanB = b.trim().toUpperCase();
  if (cleanA.length !== cleanB.length) return false;
  let mismatch = 0;
  for (let i = 0; i < cleanA.length; i++) {
    mismatch |= cleanA.charCodeAt(i) ^ cleanB.charCodeAt(i);
  }
  return mismatch === 0;
}

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
    bugfestCode: 'BF-R1-8K9M3P',
    bugfestCodeGeneratedAt: '09:00:00 AM'
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
    bugfestCode: undefined,
    bugfestCodeGeneratedAt: undefined
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
    bugfestCode: undefined,
    bugfestCodeGeneratedAt: undefined
  }
];

const DEFAULT_PARTICIPANTS: Record<string, ParticipantSession> = {
  'team-alpha': {
    userId: 'team-alpha',
    name: 'Team Alpha',
    teamName: 'Team Alpha',
    college: 'Institute of Engineering & Tech',
    accessCode: 'BF-R1-ALPHA',
    currentRound: 1,
    status: 'Active',
    totalScore: 28,
    roundScores: { 1: 28, 2: 0, 3: 0 },
    roundCompleted: { 1: false, 2: false, 3: false },
    codeDrafts: {},
    submissions: {},
    visitedQuestions: ['R1-Q01', 'R1-Q02', 'R1-Q03'],
    timeRemainingSeconds: { 1: 18 * 60, 2: 25 * 60, 3: 30 * 60 },
    lastActive: '1 min ago',
    sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
  },
  'team-debuggers': {
    userId: 'team-debuggers',
    name: 'Team Debuggers',
    teamName: 'Team Debuggers',
    college: 'National Institute of Tech',
    accessCode: 'BF-R1-DEBUG',
    currentRound: 1,
    status: 'Active',
    totalScore: 25,
    roundScores: { 1: 25, 2: 0, 3: 0 },
    roundCompleted: { 1: false, 2: false, 3: false },
    codeDrafts: {},
    submissions: {},
    visitedQuestions: ['R1-Q01', 'R1-Q02'],
    timeRemainingSeconds: { 1: 15 * 60, 2: 25 * 60, 3: 30 * 60 },
    lastActive: '3 mins ago',
    sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
  },
  'team-codewarriors': {
    userId: 'team-codewarriors',
    name: 'Code Warriors',
    teamName: 'Code Warriors',
    college: 'Apex University College',
    accessCode: 'BF-R1-WAR',
    currentRound: 1,
    status: 'Active',
    totalScore: 22,
    roundScores: { 1: 22, 2: 0, 3: 0 },
    roundCompleted: { 1: false, 2: false, 3: false },
    codeDrafts: {},
    submissions: {},
    visitedQuestions: ['R1-Q01'],
    timeRemainingSeconds: { 1: 14 * 60, 2: 25 * 60, 3: 30 * 60 },
    lastActive: '5 mins ago',
    sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
  },
  'team-bughunters': {
    userId: 'team-bughunters',
    name: 'Bug Hunters',
    teamName: 'Bug Hunters',
    college: 'Govt Model Engineering College',
    accessCode: 'BF-R1-HUNT',
    currentRound: 1,
    status: 'Active',
    totalScore: 20,
    roundScores: { 1: 20, 2: 0, 3: 0 },
    roundCompleted: { 1: false, 2: false, 3: false },
    codeDrafts: {},
    submissions: {},
    visitedQuestions: ['R1-Q01'],
    timeRemainingSeconds: { 1: 12 * 60, 2: 25 * 60, 3: 30 * 60 },
    lastActive: '6 mins ago',
    sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
  },
  'team-syntaxsquad': {
    userId: 'team-syntaxsquad',
    name: 'Syntax Squad',
    teamName: 'Syntax Squad',
    college: 'St. Xavier Institute of Tech',
    accessCode: 'BF-R1-SQUAD',
    currentRound: 1,
    status: 'Active',
    totalScore: 18,
    roundScores: { 1: 18, 2: 0, 3: 0 },
    roundCompleted: { 1: false, 2: false, 3: false },
    codeDrafts: {},
    submissions: {},
    visitedQuestions: ['R1-Q01'],
    timeRemainingSeconds: { 1: 10 * 60, 2: 25 * 60, 3: 30 * 60 },
    lastActive: '8 mins ago',
    sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
  }
};

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-init-01',
    action: 'ROUND_ACTIVATION',
    timestamp: '09:00:00 AM',
    roundId: 1,
    details: 'Round 1 activated by Competition Committee. Code BF-R1-8K9M3P issued for participants.',
    performedBy: 'Organizer ORG001'
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

// Store memory cache
let cachedQuestions: Question[] | null = null;
let cachedRounds: RoundConfig[] | null = null;
let cachedCurrentUser: User | null = null;
let cachedParticipants: Record<string, ParticipantSession> | null = null;
let cachedSubmissions: Submission[] | null = null;
let cachedLeaderboardEnabled: boolean = true;
let cachedAccessCodes: AccessCodeRecord[] | null = null;
let cachedAuditLogs: AuditLogEntry[] | null = null;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

export const competitionStore = {
  // Initialize
  init() {
    if (!cachedQuestions) {
      cachedQuestions = loadFromStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    }
    if (!cachedRounds) {
      cachedRounds = loadFromStorage(STORAGE_KEYS.ROUNDS, DEFAULT_ROUNDS);
    }
    if (!cachedCurrentUser) {
      cachedCurrentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    }
    if (!cachedParticipants) {
      cachedParticipants = loadFromStorage(STORAGE_KEYS.PARTICIPANTS, DEFAULT_PARTICIPANTS);
    }
    if (!cachedSubmissions) {
      cachedSubmissions = loadFromStorage(STORAGE_KEYS.SUBMISSIONS, []);
    }
    if (!cachedAccessCodes) {
      cachedAccessCodes = loadFromStorage(STORAGE_KEYS.ACCESS_CODES, INITIAL_ACCESS_CODES);
    }
    if (!cachedAuditLogs) {
      cachedAuditLogs = loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
    }
    cachedLeaderboardEnabled = loadFromStorage(STORAGE_KEYS.LEADERBOARD_ENABLED, true);
  },

  // Questions
  getQuestions(): Question[] {
    this.init();
    return cachedQuestions || [];
  },

  getQuestionsByRound(round: 1 | 2 | 3): Question[] {
    return this.getQuestions().filter((q) => q.round === round && q.isPublished);
  },

  getAllQuestionsByRound(round: 1 | 2 | 3): Question[] {
    return this.getQuestions().filter((q) => q.round === round);
  },

  getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find((q) => q.id === id);
  },

  addQuestion(newQuestion: Omit<Question, 'id'> & { id?: string }): Question {
    this.init();
    const id = newQuestion.id || `R${newQuestion.round}-Q${String(Date.now()).slice(-4)}`;
    const fullQuestion: Question = {
      ...newQuestion,
      id
    };
    cachedQuestions = [fullQuestion, ...(cachedQuestions || [])];
    saveToStorage(STORAGE_KEYS.QUESTIONS, cachedQuestions);
    emitter.notify();
    return fullQuestion;
  },

  updateQuestion(id: string, updates: Partial<Question>) {
    this.init();
    cachedQuestions = (cachedQuestions || []).map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    saveToStorage(STORAGE_KEYS.QUESTIONS, cachedQuestions);
    emitter.notify();
  },

  deleteQuestion(id: string) {
    this.init();
    cachedQuestions = (cachedQuestions || []).filter((q) => q.id !== id);
    saveToStorage(STORAGE_KEYS.QUESTIONS, cachedQuestions);
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
    cachedQuestions = [duplicated, ...(cachedQuestions || [])];
    saveToStorage(STORAGE_KEYS.QUESTIONS, cachedQuestions);
    emitter.notify();
    return duplicated;
  },

  resetToDefaultQuestions() {
    cachedQuestions = [...INITIAL_QUESTIONS];
    saveToStorage(STORAGE_KEYS.QUESTIONS, cachedQuestions);
    emitter.notify();
  },

  // Rounds
  getRounds(): RoundConfig[] {
    this.init();
    return cachedRounds || DEFAULT_ROUNDS;
  },

  getRound(roundId: 1 | 2 | 3): RoundConfig | undefined {
    return this.getRounds().find((r) => r.roundId === roundId);
  },

  getActiveRound(): RoundConfig {
    this.init();
    const active = this.getRounds().find((r) => r.status === 'active');
    return active || this.getRounds()[0];
  },

  getRoundBugfestCode(roundId: 1 | 2 | 3): string | undefined {
    this.init();
    return this.getRound(roundId)?.bugfestCode;
  },

  generateOrRegenerateRoundCode(roundId: 1 | 2 | 3, performedBy = 'Organizer ORG001', reason?: string): string {
    this.init();
    const newCode = generateSecureBugfestCode(roundId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (cachedRounds) {
      const idx = cachedRounds.findIndex((r) => r.roundId === roundId);
      if (idx !== -1) {
        const isRegeneration = !!cachedRounds[idx].bugfestCode;
        cachedRounds[idx] = {
          ...cachedRounds[idx],
          bugfestCode: newCode,
          bugfestCodeGeneratedAt: now
        };
        saveToStorage(STORAGE_KEYS.ROUNDS, cachedRounds);

        // Record audit entry
        const auditEntry: AuditLogEntry = {
          id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          action: isRegeneration ? 'CODE_REGENERATION' : 'CODE_GENERATION',
          timestamp: now,
          roundId,
          details: isRegeneration
            ? `Regenerated secure Bugfest code for Round ${roundId}. Prior code invalidated for future logins. Note: ${reason || 'Manual code refresh by organizer'}`
            : `Generated initial secure Bugfest code for Round ${roundId}.`,
          performedBy
        };

        cachedAuditLogs = [auditEntry, ...(cachedAuditLogs || [])];
        saveToStorage(STORAGE_KEYS.AUDIT_LOGS, cachedAuditLogs);
      }
    }

    emitter.notify();
    return newCode;
  },

  getAuditLogs(): AuditLogEntry[] {
    this.init();
    return cachedAuditLogs || [];
  },

  updateRound(roundId: 1 | 2 | 3, updates: Partial<RoundConfig>) {
    this.init();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    cachedRounds = (cachedRounds || []).map((r) => {
      if (r.roundId === roundId) {
        let code = r.bugfestCode;
        let codeTime = r.bugfestCodeGeneratedAt;
        
        // Auto-generate code if activating and none present
        if (updates.status === 'active' && !code) {
          code = generateSecureBugfestCode(roundId);
          codeTime = now;
        }

        return {
          ...r,
          ...updates,
          bugfestCode: code,
          bugfestCodeGeneratedAt: codeTime
        };
      }
      return r;
    });

    saveToStorage(STORAGE_KEYS.ROUNDS, cachedRounds);

    if (updates.status) {
      const auditEntry: AuditLogEntry = {
        id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        action: updates.status === 'active' ? 'ROUND_ACTIVATION' : 'ROUND_DEACTIVATION',
        timestamp: now,
        roundId,
        details: `Round ${roundId} status updated to "${updates.status}".`,
        performedBy: 'Organizer ORG001'
      };
      cachedAuditLogs = [auditEntry, ...(cachedAuditLogs || [])];
      saveToStorage(STORAGE_KEYS.AUDIT_LOGS, cachedAuditLogs);
    }

    emitter.notify();
  },

  setRoundStatus(roundId: 1 | 2 | 3, status: RoundStatus) {
    this.updateRound(roundId, { status });
  },

  // Access Codes & Random Code Generator
  getAccessCodes(): AccessCodeRecord[] {
    this.init();
    return cachedAccessCodes || [];
  },

  generateRandomParticipantCode(name: string, college: string): { accessCode: string; user: User } {
    this.init();
    let accessCode = generateRandomPin('BF');
    // Ensure uniqueness
    while (cachedAccessCodes?.some((c) => c.accessCode === accessCode)) {
      accessCode = generateRandomPin('BF');
    }

    const nextIdx = (cachedAccessCodes?.length || 0) + 1;
    const userId = `GC${String(nextIdx).padStart(3, '0')}`;

    const newRecord: AccessCodeRecord = {
      accessCode,
      userId,
      name: name.trim() || `Contestant ${nextIdx}`,
      college: college.trim() || 'Engineering Institute',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUsed: true
    };

    cachedAccessCodes = [newRecord, ...(cachedAccessCodes || [])];
    saveToStorage(STORAGE_KEYS.ACCESS_CODES, cachedAccessCodes);

    // Create user & participant session
    const newUser: User = {
      id: `usr-${userId.toLowerCase()}`,
      userId,
      accessCode,
      name: newRecord.name,
      college: newRecord.college,
      role: 'participant',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newRecord.name)}`
    };

    if (!cachedParticipants![userId]) {
      cachedParticipants![userId] = {
        userId,
        accessCode,
        name: newUser.name,
        teamName: newUser.name,
        college: newUser.college || 'Engineering College',
        currentRound: 1,
        status: 'Active',
        totalScore: 0,
        roundScores: { 1: 0, 2: 0, 3: 0 },
        roundCompleted: { 1: false, 2: false, 3: false },
        codeDrafts: {},
        submissions: {},
        visitedQuestions: ['R1-Q01'],
        timeRemainingSeconds: { 1: 20 * 60, 2: 25 * 60, 3: 30 * 60 },
        lastActive: 'Just now'
      };
      saveToStorage(STORAGE_KEYS.PARTICIPANTS, cachedParticipants);
    }

    emitter.notify();
    return { accessCode, user: newUser };
  },

  batchGenerateOrganizerCodes(count: number = 5): AccessCodeRecord[] {
    this.init();
    const newRecords: AccessCodeRecord[] = [];
    let currentCount = (cachedAccessCodes?.length || 0) + 1;

    for (let i = 0; i < count; i++) {
      let code = generateRandomPin('BF');
      while (
        cachedAccessCodes?.some((c) => c.accessCode === code) ||
        newRecords.some((r) => r.accessCode === code)
      ) {
        code = generateRandomPin('BF');
      }

      const userId = `GC${String(currentCount + i).padStart(3, '0')}`;
      newRecords.push({
        accessCode: code,
        userId,
        name: `Contestant ${currentCount + i}`,
        college: 'Technical College',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUsed: false
      });
    }

    cachedAccessCodes = [...newRecords, ...(cachedAccessCodes || [])];
    saveToStorage(STORAGE_KEYS.ACCESS_CODES, cachedAccessCodes);
    emitter.notify();
    return newRecords;
  },

  // Auth & Login (Handles both User ID and Random Access Code!)
  getCurrentUser(): User | null {
    this.init();
    return cachedCurrentUser;
  },

  loginByCodeOrId(identifier: string): { success: boolean; user?: User; error?: string } {
    this.init();
    const clean = identifier.trim().toUpperCase();

    if (!clean) {
      return { success: false, error: 'Please enter your Access Code or User ID.' };
    }

    // 1. Check organizer credentials
    if (clean === 'ORG001' || clean === 'ORG-9999' || clean === 'ORGANIZER') {
      const org = SAMPLE_USERS.ORG001.user;
      cachedCurrentUser = org;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, org);
      emitter.notify();
      return { success: true, user: org };
    }

    // 2. Check registered Access Codes
    const foundCode = cachedAccessCodes?.find(
      (c) => c.accessCode.toUpperCase() === clean || c.userId.toUpperCase() === clean
    );

    if (foundCode) {
      // Mark code as used
      foundCode.isUsed = true;
      saveToStorage(STORAGE_KEYS.ACCESS_CODES, cachedAccessCodes);

      // Fetch or create user
      const existingAccount = SAMPLE_USERS[foundCode.userId.toUpperCase()];
      const user: User = existingAccount
        ? existingAccount.user
        : {
            id: `usr-${foundCode.userId.toLowerCase()}`,
            userId: foundCode.userId,
            accessCode: foundCode.accessCode,
            name: foundCode.name,
            college: foundCode.college,
            role: 'participant',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(foundCode.name)}`
          };

      // Ensure participant session exists
      if (!cachedParticipants![user.userId]) {
        cachedParticipants![user.userId] = {
          userId: user.userId,
          accessCode: foundCode.accessCode,
          name: user.name,
          teamName: user.name,
          college: user.college || 'Engineering College',
          currentRound: 1,
          status: 'Active',
          totalScore: 0,
          roundScores: { 1: 0, 2: 0, 3: 0 },
          roundCompleted: { 1: false, 2: false, 3: false },
          codeDrafts: {},
          submissions: {},
          visitedQuestions: ['R1-Q01'],
          timeRemainingSeconds: { 1: 20 * 60, 2: 25 * 60, 3: 30 * 60 },
          lastActive: 'Just now'
        };
        saveToStorage(STORAGE_KEYS.PARTICIPANTS, cachedParticipants);
      }

      cachedCurrentUser = user;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      emitter.notify();
      return { success: true, user };
    }

    // 3. Check sample hardcoded accounts (e.g. GC001, GC002, GC003)
    const sampleAccount = SAMPLE_USERS[clean];
    if (sampleAccount) {
      cachedCurrentUser = sampleAccount.user;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, sampleAccount.user);

      if (sampleAccount.user.role === 'participant' && !cachedParticipants![sampleAccount.user.userId]) {
        cachedParticipants![sampleAccount.user.userId] = {
          userId: sampleAccount.user.userId,
          accessCode: sampleAccount.user.accessCode || `BF-${clean}`,
          name: sampleAccount.user.name,
          teamName: sampleAccount.user.name,
          college: sampleAccount.user.college || 'Engineering College',
          currentRound: 1,
          status: 'Active',
          totalScore: 0,
          roundScores: { 1: 0, 2: 0, 3: 0 },
          roundCompleted: { 1: false, 2: false, 3: false },
          codeDrafts: {},
          submissions: {},
          visitedQuestions: ['R1-Q01'],
          timeRemainingSeconds: { 1: 20 * 60, 2: 25 * 60, 3: 30 * 60 },
          lastActive: 'Just now'
        };
        saveToStorage(STORAGE_KEYS.PARTICIPANTS, cachedParticipants);
      }

      emitter.notify();
      return { success: true, user: sampleAccount.user };
    }

    return {
      success: false,
      error: `Invalid credentials. Please verify your details.`
    };
  },

  /**
   * Participant Login via Team Name + Organizer-provided Bugfest Code.
   * Validates constant-time against currently active round code.
   * Resolves or creates normalized team session without leaking secrets.
   */
  loginParticipantWithTeamCode(teamName: string, bugfestCode: string): { success: boolean; user?: User; error?: string } {
    this.init();
    const cleanTeam = teamName.trim();
    const cleanCode = bugfestCode.trim().toUpperCase();

    if (!cleanTeam || !cleanCode) {
      return {
        success: false,
        error: 'Please enter both your Team Name and the active Bugfest Code.'
      };
    }

    // Determine the active round
    const activeRound = cachedRounds?.find((r) => r.status === 'active') || cachedRounds?.[0];
    if (!activeRound) {
      return {
        success: false,
        error: 'No competition round is currently active. Please contact the organizers.'
      };
    }

    // Validate code using constant-time comparison against active round's bugfestCode
    const roundCode = activeRound.bugfestCode || '';
    const isMatch = constantTimeCompare(cleanCode, roundCode);

    if (!isMatch) {
      return {
        success: false,
        error: 'Invalid Team Name or Bugfest Code. Please check the code provided by the organizing coordination team.'
      };
    }

    // Normalized team identity (safe key)
    const normalizedTeamId = 'team-' + cleanTeam.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 32);

    const existing = cachedParticipants?.[normalizedTeamId];
    const user: User = {
      id: normalizedTeamId,
      userId: normalizedTeamId,
      name: cleanTeam,
      teamName: cleanTeam,
      role: 'participant',
      college: existing?.college || 'Collegiate Technical Team',
      authenticatedRound: activeRound.roundId,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanTeam)}`
    };

    if (!cachedParticipants![normalizedTeamId]) {
      cachedParticipants![normalizedTeamId] = {
        userId: normalizedTeamId,
        name: cleanTeam,
        teamName: cleanTeam,
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
        timeRemainingSeconds: { 1: 20 * 60, 2: 25 * 60, 3: 30 * 60 },
        lastActive: 'Just now',
        sessionExpiresAt: Date.now() + 4 * 60 * 60 * 1000
      };
    } else {
      cachedParticipants![normalizedTeamId].currentRound = activeRound.roundId;
      cachedParticipants![normalizedTeamId].status = 'Active';
      cachedParticipants![normalizedTeamId].lastActive = 'Just now';
      cachedParticipants![normalizedTeamId].sessionExpiresAt = Date.now() + 4 * 60 * 60 * 1000;
    }

    saveToStorage(STORAGE_KEYS.PARTICIPANTS, cachedParticipants);
    cachedCurrentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    emitter.notify();

    return { success: true, user };
  },

  /**
   * Compact live scoreboard inside the active code editor.
   * Displays strictly: Rank, Team Name, and Current Score.
   * Auto-recalculated dynamically whenever any team submits.
   */
  getLiveScoreboard(currentTeamName?: string): LiveScoreboardEntry[] {
    this.init();
    const allParticipants = Object.values(cachedParticipants || {});

    // Collect team scores
    const teamMap = new Map<string, { teamName: string; score: number }>();
    allParticipants.forEach((p) => {
      const tName = p.teamName || p.name;
      if (!tName) return;
      const key = tName.toLowerCase();
      const existing = teamMap.get(key);
      if (!existing || p.totalScore > existing.score) {
        teamMap.set(key, { teamName: tName, score: p.totalScore });
      }
    });

    const entries: LiveScoreboardEntry[] = Array.from(teamMap.values()).map((t) => ({
      rank: 1,
      teamName: t.teamName,
      score: t.score,
      isCurrentTeam: currentTeamName
        ? t.teamName.trim().toLowerCase() === currentTeamName.trim().toLowerCase()
        : false
    }));

    // Sort descending by score, then alphabetical
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.teamName.localeCompare(b.teamName);
    });

    // Assign rank
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
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
    emitter.notify();
  },

  // Participant Session
  getParticipantSession(userId: string): ParticipantSession | undefined {
    this.init();
    return cachedParticipants?.[userId];
  },

  getAllParticipants(): ParticipantSession[] {
    this.init();
    return Object.values(cachedParticipants || {});
  },

  updateParticipantSession(userId: string, updates: Partial<ParticipantSession>) {
    this.init();
    if (!cachedParticipants?.[userId]) return;
    cachedParticipants[userId] = {
      ...cachedParticipants[userId],
      ...updates,
      lastActive: 'Just now'
    };
    saveToStorage(STORAGE_KEYS.PARTICIPANTS, cachedParticipants);
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

  recordSubmission(userId: string, submission: Submission) {
    this.init();
    const session = this.getParticipantSession(userId);
    if (!session) return;

    // Save into participant's submissions map
    const participantSubmissions = {
      ...session.submissions,
      [submission.questionId]: submission
    };

    // Recalculate round scores
    const roundScores = { 1: 0, 2: 0, 3: 0 };
    Object.values(participantSubmissions).forEach((sub) => {
      roundScores[sub.round] += sub.marksEarned;
    });

    const totalScore = roundScores[1] + roundScores[2] + roundScores[3];

    this.updateParticipantSession(userId, {
      submissions: participantSubmissions,
      roundScores,
      totalScore
    });

    // Add to global submissions list
    cachedSubmissions = [submission, ...(cachedSubmissions || [])];
    saveToStorage(STORAGE_KEYS.SUBMISSIONS, cachedSubmissions);
    emitter.notify();
  },

  completeRound(userId: string, roundId: 1 | 2 | 3) {
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

  // Submissions
  getSubmissions(): Submission[] {
    this.init();
    return cachedSubmissions || [];
  },

  // Leaderboard with LIVE ROUND-BY-ROUND FILTERING
  isLeaderboardEnabled(): boolean {
    this.init();
    return cachedLeaderboardEnabled;
  },

  setLeaderboardEnabled(enabled: boolean) {
    cachedLeaderboardEnabled = enabled;
    saveToStorage(STORAGE_KEYS.LEADERBOARD_ENABLED, enabled);
    emitter.notify();
  },

  getLeaderboard(roundFilter: RoundLeaderboardFilter = 'overall'): LeaderboardEntry[] {
    this.init();
    const participants = this.getAllParticipants();

    // Map to leaderboard rows
    const entries: LeaderboardEntry[] = participants.map((p) => {
      const subs = Object.values(p.submissions);

      // Calculations for the specific round vs overall
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
        participantName: p.name,
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

    // Sort according to selected round filter
    entries.sort((a, b) => {
      if (roundFilter === 'overall') {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.round3Score !== a.round3Score) return b.round3Score - a.round3Score;
        return b.accuracy - a.accuracy;
      } else {
        const scoreA = a.roundScoreForFilter || 0;
        const scoreB = b.roundScoreForFilter || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        if ((b.roundQuestionsSolved || 0) !== (a.roundQuestionsSolved || 0)) {
          return (b.roundQuestionsSolved || 0) - (a.roundQuestionsSolved || 0);
        }
        return b.accuracy - a.accuracy;
      }
    });

    // Assign rank
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  },

  // Subscribe
  subscribe(listener: () => void) {
    return emitter.subscribe(listener);
  }
};

// React hook
export function useCompetitionStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return competitionStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return competitionStore;
}
