import React from 'react';
import { User, ParticipantSession } from '../../types';
import { 
  Award, 
  Trophy, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Layers, 
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

interface FinalScorecardProps {
  currentUser: User;
  session: ParticipantSession;
  rank: number;
  onViewLeaderboard: () => void;
  onBackToDashboard: () => void;
}

export const FinalScorecard: React.FC<FinalScorecardProps> = ({
  currentUser,
  session,
  rank,
  onViewLeaderboard,
  onBackToDashboard
}) => {
  const solvedCount = Object.values(session.submissions).filter((s) => s.result === 'Passed').length;
  const totalSubmissions = Object.keys(session.submissions).length;
  const accuracy = totalSubmissions > 0 ? Math.round((solvedCount / totalSubmissions) * 100) : 0;

  const totalMax = 300;
  const scorePercent = Math.round((session.totalScore / totalMax) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Printable / Visual Certificate Scorecard Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl overflow-hidden mb-8">
        
        {/* Certificate Header Banner */}
        <div className="bg-slate-900 text-white p-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Tournament Scorecard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            GENCRAFT — BUG FEST
          </h1>
          <p className="text-sm text-slate-300 font-medium">
            Collegiate Technical Debugging Championship 2026
          </p>
        </div>

        {/* Candidate & Scores Body */}
        <div className="p-8 sm:p-10">
          
          {/* Candidate Profile Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-8 mb-8 border-b border-slate-200 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Competitor Name & Affiliation
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentUser.name}
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-1">
                ID: <strong className="text-slate-800">{currentUser.userId}</strong> · {currentUser.college}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-center">
              <span className="text-[11px] font-bold uppercase text-blue-700 tracking-wider block">
                Final Standing
              </span>
              <div className="text-3xl font-extrabold font-mono text-blue-800">
                #{rank}
              </div>
              <span className="text-[10px] text-blue-600 font-medium">Tournament Rank</span>
            </div>
          </div>

          {/* Three Rounds Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-xs font-bold text-slate-500 block mb-1 font-mono">
                ROUND 1 (Basic)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {session.roundScores[1] || 0}
                <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">20 Questions</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-xs font-bold text-slate-500 block mb-1 font-mono">
                ROUND 2 (Core)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {session.roundScores[2] || 0}
                <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">10 Questions</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-xs font-bold text-slate-500 block mb-1 font-mono">
                ROUND 3 (Advanced)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {session.roundScores[3] || 0}
                <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">5 Questions</span>
            </div>

          </div>

          {/* Total & Accuracy Matrix */}
          <div className="p-6 bg-slate-900 text-white rounded-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono uppercase text-blue-400 font-bold block mb-1">
                Grand Cumulative Score
              </span>
              <div className="text-4xl font-extrabold font-mono tracking-tight text-white">
                {session.totalScore} <span className="text-lg text-slate-400 font-sans font-normal">/ 300 pts</span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Performance Rating: {scorePercent}% aggregate index
              </span>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div className="border-l border-slate-800 pl-6">
                <span className="text-xs text-slate-400 block mb-1">Accuracy</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{accuracy}%</span>
              </div>
              <div className="border-l border-slate-800 pl-6">
                <span className="text-xs text-slate-400 block mb-1">Solved</span>
                <span className="text-2xl font-bold font-mono text-blue-400">{solvedCount}</span>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified by GENCRAFT Steering Committee & Automated Testing System</span>
            </div>
            <div className="font-mono text-slate-400">
              Ref: GC-BF-2026-{currentUser.userId}
            </div>
          </div>

        </div>

      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onViewLeaderboard}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>View Public Tournament Leaderboard</span>
        </button>

        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Candidate Dashboard</span>
        </button>
      </div>

    </div>
  );
};
