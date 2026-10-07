import React from 'react';
import { ParticipantSession, Submission } from '../../types';
import { X, CheckCircle2, Clock, Target, Layers, FileCode } from 'lucide-react';

interface ParticipantDetailModalProps {
  participant: ParticipantSession | null;
  onClose: () => void;
  onInspectSubmission: (submission: Submission) => void;
}

export const ParticipantDetailModal: React.FC<ParticipantDetailModalProps> = ({
  participant,
  onClose,
  onInspectSubmission
}) => {
  if (!participant) return null;

  const submissionsList = Object.values(participant.submissions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase font-mono">
                Candidate Profile
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {participant.userId}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {participant.name}
            </h2>
            <p className="text-xs text-slate-500">{participant.college}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Round Scores Overview */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Round 1</span>
              <strong className="text-lg font-mono text-slate-900">{participant.roundScores[1] || 0}</strong>
              <span className="text-[10px] text-slate-400 block">{participant.roundCompleted[1] ? 'Finished' : 'In Progress'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Round 2</span>
              <strong className="text-lg font-mono text-slate-900">{participant.roundScores[2] || 0}</strong>
              <span className="text-[10px] text-slate-400 block">{participant.roundCompleted[2] ? 'Finished' : 'Pending'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Round 3</span>
              <strong className="text-lg font-mono text-slate-900">{participant.roundScores[3] || 0}</strong>
              <span className="text-[10px] text-slate-400 block">{participant.roundCompleted[3] ? 'Finished' : 'Pending'}</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Total Score</span>
              <strong className="text-lg font-mono text-blue-700">{participant.totalScore}</strong>
              <span className="text-[10px] text-blue-500 block">Accumulated</span>
            </div>
          </div>

          {/* Activity Status */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-500 font-sans block text-[11px]">Current Status:</span>
              <strong className="text-slate-900">{participant.status} (Round {participant.currentRound})</strong>
            </div>
            <div>
              <span className="text-slate-500 font-sans block text-[11px]">Last Activity:</span>
              <span className="text-slate-700">{participant.lastActive}</span>
            </div>
            <div>
              <span className="text-slate-500 font-sans block text-[11px]">Visited Questions:</span>
              <span className="text-slate-700">{participant.visitedQuestions.length}</span>
            </div>
          </div>

          {/* Submissions List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">
                Submitted Solutions ({submissionsList.length})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Click to inspect code</span>
            </div>

            {submissionsList.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 italic">
                No solutions submitted yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                {submissionsList.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => onInspectSubmission(sub)}
                    className="p-3 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          R{sub.round}
                        </span>
                        <strong className="text-slate-900 text-xs">{sub.questionTitle}</strong>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {sub.language.toUpperCase()} · {sub.timestamp}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold block ${
                        sub.result === 'Passed' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {sub.marksEarned} / {sub.maxMarks} pts
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sub.testsPassed}/{sub.totalTests} tests
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
