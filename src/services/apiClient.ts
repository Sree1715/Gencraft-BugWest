import { Question, RoundConfig, LeaderboardEntry, User, ParticipantSession, Submission } from '../types';

const API_BASE = '/api';

export interface RegisterTeamResponse {
  success: boolean;
  isExisting?: boolean;
  team?: {
    id: string;
    eventId: string;
    teamName: string;
    locked: boolean;
    createdAt: string;
  };
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  round?: RoundConfig;
  teamRound?: any;
  error?: string;
}

export interface OrganizerDataResponse {
  rounds: RoundConfig[];
  questions: Question[];
  participants: ParticipantSession[];
  serverTime: string;
  error?: string;
}

export const apiClient = {
  // 1. Register or Retrieve Locked Team
  async registerTeam(teamName: string): Promise<RegisterTeamResponse> {
    try {
      const res = await fetch(`${API_BASE}/teams/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to register team.' };
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting to backend server.' };
    }
  },

  // 2. Verify Common Round Code against database
  async verifyRoundCode(teamId: string, joinCode: string): Promise<VerifyCodeResponse> {
    try {
      const res = await fetch(`${API_BASE}/rounds/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, joinCode })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid round code.' };
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error verifying round code.' };
    }
  },

  // 3. Fetch all rounds with official schedule and status
  async fetchRounds(): Promise<{ rounds: RoundConfig[]; serverTime: string }> {
    try {
      const res = await fetch(`${API_BASE}/rounds`);
      if (!res.ok) return { rounds: [], serverTime: new Date().toISOString() };
      return await res.json();
    } catch {
      return { rounds: [], serverTime: new Date().toISOString() };
    }
  },

  // 4. Update round (Organizer control: start, lock, change code, duration)
  async updateRound(roundId: number, updates: any): Promise<{ success: boolean; round?: RoundConfig; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/rounds/${roundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update round.' };
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating round.' };
    }
  },

  // 5. Submit Question Answer
  async submitAnswer(payload: {
    teamId: string;
    roundId: number;
    questionId: string;
    code: string;
    passedCases: number;
    totalCases: number;
    score: number;
    status: string;
  }): Promise<{ success: boolean; answer?: any; roundScore?: number; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to submit answer.' };
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error submitting answer.' };
    }
  },

  // 6. Complete Round for Team
  async completeRound(teamId: string, roundId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/rounds/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, roundId })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // 7. Fetch Live Leaderboard across all teams
  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.leaderboard || [];
    } catch {
      return [];
    }
  },

  // 8. Fetch Full Organizer Data
  async fetchOrganizerData(): Promise<OrganizerDataResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/organizer/data`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 9. Fetch Official Server Clock
  async fetchServerTime(): Promise<{ serverTime: string; timestamp: number }> {
    try {
      const res = await fetch(`${API_BASE}/server-time`);
      if (!res.ok) return { serverTime: new Date().toISOString(), timestamp: Date.now() };
      return await res.json();
    } catch {
      return { serverTime: new Date().toISOString(), timestamp: Date.now() };
    }
  }
};
