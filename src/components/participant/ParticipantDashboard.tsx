import React from 'react';
import { User, ParticipantSession, RoundConfig } from '../../types';
import { 
  Trophy, 
  Target, 
  Award, 
  CheckCircle2, 
  Lock, 
  Play, 
  Clock, 
  Code2, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Terminal,
  Cpu,
  FileCode,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ParticipantDashboardProps {
  currentUser: User;
  session: ParticipantSession;
  rounds: RoundConfig[];
  onStartRound: (roundId: 1 | 2 | 3) => void;
  onViewScorecard: () => void;
  onViewLeaderboard?: () => void;
  userRank: number;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  currentUser,
  session,
  rounds,
  onStartRound,
  onViewScorecard,
  onViewLeaderboard,
  userRank
}) => {
  const teamDisplayName = currentUser.teamName || session.teamName || currentUser.name;
  const isRound1Completed = session.roundCompleted[1];
  const isAllCompleted = Boolean(isRound1Completed);

  // Single round championship
  const activeRoundToStart: 1 | 2 | 3 = 1;

  const currentRoundConfig = rounds.find(r => r.roundId === 1) || {
    roundId: 1 as const,
    roundNumber: 1,
    title: 'ROUND 1 - BugFest Technical Arena',
    durationMinutes: 30,
    totalMarks: 35,
    questionCount: 7,
    status: 'active' as const
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      
      {/* ==================================================== */}
      {/* 1. WELCOME & TEAM IDENTIFICATION BANNER */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 mb-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 text-white font-black text-2xl flex items-center justify-center font-mono shrink-0 shadow-sm">
              <Terminal className="w-8 h-8 text-blue-400" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                <span>COLLEGIATE TECHNICAL SYMPOSIUM 2026</span>
                <span>·</span>
                <span>PARTICIPANT ARENA</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, <span className="text-blue-600">{teamDisplayName}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Team Name:</span>
                  <strong className="text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded font-mono">
                    {teamDisplayName}
                  </strong>
                </div>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Competition:</span>
                  <span className="font-bold text-slate-900">GENCRAFT — BUG FEST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Quick CTA */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {onViewLeaderboard && (
              <button
                onClick={onViewLeaderboard}
                className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Live Leaderboard</span>
              </button>
            )}

            {!isAllCompleted ? (
              <button
                onClick={() => onStartRound(activeRoundToStart)}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>ENTER CODING ARENA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={onViewScorecard}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Tournament Scorecard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. SINGLE ROUND DETAILED INSTRUCTIONS & ARENA CARD */}
      {/* ==================================================== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-1">
              Event Structure & Instructions
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              BugFest Championship Arena
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:block">
            Single 7-Question Debugging Round
          </span>
        </div>

        <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-md font-mono border border-blue-200">
                  ROUND 1
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isRound1Completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-600 text-white'
                }`}>
                  {isRound1Completed ? '✓ Completed' : 'Active Now'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {currentRoundConfig.title || 'Technical Debugging Arena'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                7 Questions · {currentRoundConfig.durationMinutes || 30} Minutes · {currentRoundConfig.totalMarks || 35} Marks · C & Python
              </p>
            </div>

            <button
              onClick={() => onStartRound(1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRound1Completed ? 'Review Submissions & Scorecard' : 'START DEBUGGING NOW'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 font-mono">
                C Language Challenges (4 Questions):
              </span>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Q1. Array sum uninitialized accumulator & syntax</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Q2. Fibonacci sequence iteration and formula</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Q3. Factorial base case and loop boundaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Q4. String reversal in-place pointer swapping</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2 font-mono">
                Python Language Challenges (3 Questions):
              </span>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Q5. Palindrome checker with case normalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Q6. List deduplication with order preservation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Q7. Prime number boundary checking and factoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. GENERAL TOURNAMENT RULES & CODE OF CONDUCT */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Competition Rules & Scoring Protocol
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
            <strong className="block text-slate-900 font-bold mb-1">1. Test Case Verification</strong>
            Submissions are dynamically executed against hidden regression assertions. Only code fixing the core logical anomaly receives full credit.
          </div>

          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
            <strong className="block text-slate-900 font-bold mb-1">2. Strict Timer Countdown</strong>
            Each round operates with an organizer-controlled countdown. Ensure your solutions are submitted before the clock expires.
          </div>

          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
            <strong className="block text-slate-900 font-bold mb-1">3. Live Scoreboard</strong>
            Inside the code editor, your team score and tournament ranking will recalculate in real-time as other teams submit.
          </div>

          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
            <strong className="block text-slate-900 font-bold mb-1">4. Auto-Advance on Submit</strong>
            Submitting your solution automatically grades your solution and advances directly to the next challenge.
          </div>
        </div>
      </div>

    </div>
  );
};
