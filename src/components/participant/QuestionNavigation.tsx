import React from 'react';
import { Question, Submission, QuestionStatus } from '../../types';

interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  visitedQuestions: string[];
  codeDrafts: Record<string, string>;
  submissions: Record<string, Submission>;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  visitedQuestions,
  codeDrafts,
  submissions
}) => {
  const getStatus = (question: Question, index: number): QuestionStatus => {
    if (submissions[question.id]) {
      return 'submitted';
    }
    const hasDraft = codeDrafts[question.id] && codeDrafts[question.id].trim() !== question.buggyCode.trim();
    if (hasDraft) {
      return 'answered';
    }
    if (visitedQuestions.includes(question.id) || index === currentQuestionIndex) {
      return 'visited';
    }
    return 'not_visited';
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Navigation Indicator & Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <span className="text-xs font-semibold text-slate-500 font-mono whitespace-nowrap mr-1">
            Q{currentQuestionIndex + 1}/{questions.length}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((q, idx) => {
              const status = getStatus(q, idx);
              const isCurrent = idx === currentQuestionIndex;

              let style = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'; // not visited

              if (status === 'submitted') {
                style = 'bg-emerald-600 text-white border-emerald-600 font-bold';
              } else if (status === 'answered') {
                style = 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
              } else if (status === 'visited') {
                style = 'bg-amber-50 text-amber-800 border-amber-300';
              }

              if (isCurrent) {
                style += ' ring-2 ring-slate-900 ring-offset-1 font-bold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(idx)}
                  title={`${q.title} (${status})`}
                  className={`w-7 h-7 text-xs rounded-md border flex items-center justify-center transition-all font-mono ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-500 font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
            <span>Submitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-100 border border-blue-300"></span>
            <span>Modified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-50 border border-amber-300"></span>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200"></span>
            <span>Unvisited</span>
          </div>
        </div>

      </div>
    </div>
  );
};
