import React from 'react';
import { Submission } from '../../types';
import { X, CheckCircle, XCircle, Clock, Code2, Award, User } from 'lucide-react';

interface SubmissionInspectorModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const SubmissionInspectorModal: React.FC<SubmissionInspectorModalProps> = ({
  submission,
  onClose
}) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase font-mono">
                Round {submission.round} · {submission.language.toUpperCase()}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {submission.timestamp}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {submission.questionTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Metadata bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Participant:</span>
              <strong className="text-slate-900 text-xs">{submission.participantName}</strong>
              <span className="text-[11px] text-slate-500 block font-mono">({submission.participantId})</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Grading Result:</span>
              <span className={`text-xs font-bold ${
                submission.result === 'Passed' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {submission.result} ({submission.testsPassed}/{submission.totalTests} tests)
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Marks Awarded:</span>
              <strong className="text-slate-900 text-xs font-mono">{submission.marksEarned} / {submission.maxMarks}</strong>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Execution Speed:</span>
              <strong className="text-slate-900 text-xs font-mono">{submission.executionTimeMs} ms</strong>
            </div>
          </div>

          {/* Submitted Code Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">Submitted Candidate Code:</span>
              <span className="text-[10px] text-slate-400 font-mono">Syntax Highlighted View</span>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 leading-5">
              {submission.submittedCode}
            </pre>
          </div>

          {/* Test Case Breakdown */}
          {submission.testResults && submission.testResults.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 block mb-2">Test Case Executions:</span>
              <div className="space-y-2">
                {submission.testResults.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className={`p-3 rounded-lg border text-xs ${
                      tc.passed
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        {tc.passed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{tc.isHidden ? `Hidden Test ${idx + 1}` : `Visible Test ${idx + 1}`}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase">
                        {tc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    {!tc.isHidden && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1 text-slate-600">
                        <div>Expected: {tc.expectedOutput}</div>
                        <div>Actual: {tc.actualOutput}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
