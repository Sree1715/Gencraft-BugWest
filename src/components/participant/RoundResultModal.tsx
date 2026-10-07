import React from 'react';
import { RoundConfig } from '../../types';
import { Award, CheckCircle, ArrowRight, Clock, Target, Layers } from 'lucide-react';

interface RoundResultModalProps {
  isOpen: boolean;
  round: RoundConfig;
  roundScore: number;
  totalScore: number;
  questionsSolved: number;
  totalQuestions: number;
  accuracy: number;
  timeUsedMinutes: number;
  isFinalRound: boolean;
  isNextRoundUnlocked: boolean;
  onProceed: () => void;
  onBackToDashboard: () => void;
}

export const RoundResultModal: React.FC<RoundResultModalProps> = ({
  isOpen,
  round,
  roundScore,
  totalScore,
  questionsSolved,
  totalQuestions,
  accuracy,
  timeUsedMinutes,
  isFinalRound,
  isNextRoundUnlocked,
  onProceed,
  onBackToDashboard
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Round Completed
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            {round.title}: {round.subtitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your submissions have been evaluated against test vectors.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Main Score Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">Round Score</span>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {roundScore}
                <span className="text-xs text-slate-400 font-sans ml-1">/ {round.totalMarks}</span>
              </div>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/60 text-center">
              <span className="text-xs text-blue-700 block mb-1">Total Tournament Score</span>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-blue-700">
                {totalScore}
                <span className="text-xs text-blue-500 font-sans ml-1">pts</span>
              </div>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs text-slate-600 font-mono mb-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-slate-500">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Questions Solved:</span>
              </span>
              <strong className="text-slate-900">{questionsSolved} of {totalQuestions}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-slate-500">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Accuracy:</span>
              </span>
              <strong className="text-slate-900">{accuracy}%</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-slate-500">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Time Allocated:</span>
              </span>
              <strong className="text-slate-900">{timeUsedMinutes} Mins</strong>
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="space-y-3">
            {isFinalRound ? (
              <button
                onClick={onProceed}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>View Final Tournament Scorecard</span>
                <Award className="w-4 h-4" />
              </button>
            ) : isNextRoundUnlocked ? (
              <button
                onClick={onProceed}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue to Round {round.roundId + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-center font-medium">
                Round {round.roundId + 1} is locked by the organizer. You will be able to enter once the organizer activates the round.
              </div>
            )}

            <button
              onClick={onBackToDashboard}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Back to Candidate Dashboard</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
