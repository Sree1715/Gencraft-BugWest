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
  const isRound2Completed = session.roundCompleted[2];
  const isRound3Completed = session.roundCompleted[3];
  const isAllCompleted = isRound1Completed && isRound2Completed && isRound3Completed;

  // Determine which round is currently active/ready to start
  const activeRoundToStart: 1 | 2 | 3 = !isRound1Completed ? 1 : !isRound2Completed ? 2 : 3;

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
                <span>START ROUND {activeRoundToStart}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={onViewScorecard}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Final Tournament Scorecard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. THREE ROUNDS DETAILED INSTRUCTIONS */}
      {/* ==================================================== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-1">
              Event Structure & Detailed Instructions
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Three Competition Rounds
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:block">
            Strict sequential unlock policy
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ---------------------------------------------------- */}
          {/* ROUND 1 */}
          {/* ---------------------------------------------------- */}
          <div className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${
            !isRound1Completed
              ? 'bg-white border-blue-600 ring-2 ring-blue-600/10 shadow-sm'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
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

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Basic Debugging
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-mono">
                20 Questions · 20 Minutes · 100 Marks · Easy
              </p>

              {/* Explicit Topics Specified in Requirements */}
              <div className="border-t border-slate-100 pt-4">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Topics Tested:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>C basics & syntax rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Python basics & runtime model</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>For and While loops execution bugs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Conditions, if/else precedence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Python indentation (tab/spaces)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Missing semicolons & unclosed tokens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Basic arrays (C) and lists (Python)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Basic function call & return flaws</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Simple logical errors & edge cases</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onStartRound(1)}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRound1Completed ? 'Review Round 1 Arena' : 'START ROUND 1'}</span>
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* ROUND 2 */}
          {/* ---------------------------------------------------- */}
          <div className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${
            isRound1Completed && !isRound2Completed
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-md font-mono border border-indigo-200">
                  ROUND 2
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isRound2Completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isRound1Completed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {isRound2Completed ? '✓ Completed' : isRound1Completed ? 'Unlocked' : <><Lock className="w-3 h-3" /> Locked</>}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Core Programming & Debugging
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-mono">
                10 Questions · 25 Minutes · 100 Marks · Medium
              </p>

              {/* Explicit Topics Specified in Requirements */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    C Domains:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">functions</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">arrays</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">strings</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">pointers</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">structs</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">recursion</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">dynamic memory</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">file handling</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">searching</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">sorting</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">linked lists</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">runtime & logical errors</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Python Domains:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">functions</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">lists</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">dictionaries</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">sets & tuples</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">classes/OOP</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">exceptions</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">recursion</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">file handling</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">algorithms</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">string processing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                disabled={!isRound1Completed}
                onClick={() => onStartRound(2)}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isRound1Completed
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!isRound1Completed ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked (Complete Round 1 First)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRound2Completed ? 'Review Round 2 Arena' : 'START ROUND 2'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* ROUND 3 */}
          {/* ---------------------------------------------------- */}
          <div className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${
            isRound2Completed && !isRound3Completed
              ? 'bg-white border-rose-600 ring-2 ring-rose-600/10 shadow-sm'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-xs rounded-md font-mono border border-rose-200">
                  ROUND 3
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isRound3Completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isRound2Completed
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {isRound3Completed ? '✓ Completed' : isRound2Completed ? 'Unlocked' : <><Lock className="w-3 h-3" /> Locked</>}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Advanced Professional Debugging
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-mono">
                5 Questions · 30 Minutes · 100 Marks · Hard
              </p>

              {/* Explicit Topics Specified in Requirements */}
              <div className="border-t border-slate-100 pt-4">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-2">
                  Master Topics Tested:
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">complex algorithms</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">recursion traps</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">pointer math & arithmetic</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">memory corruption & leaks</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">advanced data structures</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">subtle edge cases</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">complex runtime errors</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">multiple compounding bugs</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">complex Python MRO logic</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">OOP hierarchy & dunder</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">performance & complexity</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                disabled={!isRound2Completed}
                onClick={() => onStartRound(3)}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isRound2Completed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!isRound2Completed ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked (Complete Round 2 First)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isRound3Completed ? 'Review Round 3 Arena' : 'START ROUND 3'}</span>
                  </>
                )}
              </button>
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
            <strong className="block text-slate-900 font-bold mb-1">4. Sequential Unlocks</strong>
            Progression from Round 1 to 2, and 2 to 3, requires meeting stage thresholds under coordination by the organizing committee.
          </div>
        </div>
      </div>

    </div>
  );
};
