import React, { useState, useEffect } from 'react';
import { Question, TestCase, Language, Difficulty } from '../../types';
import { X, Plus, Trash2, Code2, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionToEdit?: Question | null;
  defaultRound?: 1 | 2 | 3;
  onSaveQuestion: (question: Omit<Question, 'id'> & { id?: string }) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  questionToEdit,
  defaultRound = 1,
  onSaveQuestion
}) => {
  const [round, setRound] = useState<1 | 2 | 3>(defaultRound);
  const [language, setLanguage] = useState<Language>('c');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [buggyCode, setBuggyCode] = useState('');
  const [correctSolution, setCorrectSolution] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [marks, setMarks] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(3);
  const [isPublished, setIsPublished] = useState(true);

  // Dynamic test cases list
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 'tc-1', input: '', expectedOutput: '', description: 'Standard Test Vector', isHidden: false },
    { id: 'tc-2', input: '', expectedOutput: '', description: 'Hidden Edge Assertion', isHidden: true }
  ]);

  // Load existing question if editing
  useEffect(() => {
    if (questionToEdit) {
      setRound(questionToEdit.round);
      setLanguage(questionToEdit.language);
      setTitle(questionToEdit.title);
      setDescription(questionToEdit.description);
      setBugDescription(questionToEdit.bugDescription);
      setBuggyCode(questionToEdit.buggyCode);
      setCorrectSolution(questionToEdit.correctSolution);
      setExpectedOutput(questionToEdit.expectedOutput);
      setMarks(questionToEdit.marks);
      setDifficulty(questionToEdit.difficulty);
      setTimeLimitMinutes(questionToEdit.timeLimitMinutes);
      setIsPublished(questionToEdit.isPublished);

      const combined: TestCase[] = [
        ...questionToEdit.visibleTestCases.map((tc) => ({ ...tc, isHidden: false })),
        ...questionToEdit.hiddenTestCases.map((tc) => ({ ...tc, isHidden: true }))
      ];
      setTestCases(combined.length > 0 ? combined : [
        { id: 'tc-1', input: '', expectedOutput: questionToEdit.expectedOutput, isHidden: false }
      ]);
    } else {
      // Defaults for new question
      setRound(defaultRound);
      setLanguage('c');
      setTitle('');
      setDescription('');
      setBugDescription('');
      setBuggyCode(
        language === 'c'
          ? `#include <stdio.h>\n\nint main() {\n    // TODO: Write buggy C code here\n    int val = 0;\n    printf("%d\\n", val);\n    return 0;\n}`
          : `def solve():\n    # TODO: Write buggy Python code here\n    return 42\n\nprint(solve())`
      );
      setCorrectSolution('');
      setExpectedOutput('');
      setMarks(defaultRound === 1 ? 5 : defaultRound === 2 ? 10 : 20);
      setDifficulty(defaultRound === 1 ? 'Easy' : defaultRound === 2 ? 'Medium' : 'Hard');
      setTimeLimitMinutes(defaultRound === 1 ? 3 : defaultRound === 2 ? 5 : 10);
      setIsPublished(true);
      setTestCases([
        { id: 'tc-1', input: '', expectedOutput: '', description: 'Visible Test Case 1', isHidden: false },
        { id: 'tc-2', input: '', expectedOutput: '', description: 'Hidden Boundary Assertion', isHidden: true }
      ]);
    }
  }, [questionToEdit, defaultRound, isOpen]);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      {
        id: `tc-${Date.now()}`,
        input: '',
        expectedOutput: '',
        description: `Assertion ${testCases.length + 1}`,
        isHidden: false
      }
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleUpdateTestCase = (index: number, updates: Partial<TestCase>) => {
    setTestCases(testCases.map((tc, i) => (i === index ? { ...tc, ...updates } : tc)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !buggyCode.trim()) {
      alert('Title and Buggy Code are required.');
      return;
    }

    const visibleTestCases = testCases.filter((tc) => !tc.isHidden);
    const hiddenTestCases = testCases.filter((tc) => !!tc.isHidden);

    // If no expectedOutput in question, use first test case's expected output
    const fallbackExpected = expectedOutput.trim() || testCases[0]?.expectedOutput || 'Success';

    onSaveQuestion({
      ...(questionToEdit ? { id: questionToEdit.id } : {}),
      round,
      language,
      title: title.trim(),
      description: description.trim(),
      bugDescription: bugDescription.trim(),
      buggyCode,
      correctSolution: correctSolution || buggyCode,
      expectedOutput: fallbackExpected,
      marks: Number(marks) || 5,
      difficulty,
      timeLimitMinutes: Number(timeLimitMinutes) || 3,
      visibleTestCases: visibleTestCases.length > 0 ? visibleTestCases : [
        { id: 'tc-v1', input: '', expectedOutput: fallbackExpected, isHidden: false }
      ],
      hiddenTestCases: hiddenTestCases.length > 0 ? hiddenTestCases : [
        { id: 'tc-h1', input: '', expectedOutput: fallbackExpected, isHidden: true }
      ],
      isPublished
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Organizer Question Authoring Suite
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {questionToEdit ? `Edit Question: ${questionToEdit.id}` : `Add New Buggy Code Problem`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Target Round</label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value={1}>Round 1 (Basic Debugging)</option>
                <option value={2}>Round 2 (Core Programming)</option>
                <option value={3}>Round 3 (Advanced Debugging)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium uppercase font-mono"
              >
                <option value="c">C (GCC 13+)</option>
                <option value="python">Python 3.12+</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Marks Awarded</label>
              <input
                type="number"
                min={1}
                max={50}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Problem Title</label>
              <input
                type="text"
                placeholder="e.g. Dangling Else in Grade Evaluator"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Candidate Problem Statement
              </label>
              <textarea
                rows={2}
                placeholder="Explain the problem requirement without giving away the exact bug..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-amber-900 mb-1">
                Planted Bug Description (Organizer Internal Notes)
              </label>
              <input
                type="text"
                placeholder="e.g. Semicolon missing on line 9 and sum uninitialized"
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50/50 text-amber-900 text-xs"
              />
            </div>
          </div>

          {/* Code Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Buggy Starter Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Buggy Code (Shown to Candidate)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Student starts with this</span>
              </div>
              <textarea
                rows={10}
                value={buggyCode}
                onChange={(e) => setBuggyCode(e.target.value)}
                required
                spellCheck={false}
                className="w-full p-3 font-mono text-xs bg-slate-950 text-slate-100 rounded-lg border border-slate-800 resize-y leading-5 selection:bg-rose-900/60"
              />
            </div>

            {/* Reference Solution Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Reference Working Solution (Hidden)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Used for auto-grading</span>
              </div>
              <textarea
                rows={10}
                value={correctSolution}
                onChange={(e) => setCorrectSolution(e.target.value)}
                placeholder="Paste the bug-free correct solution..."
                spellCheck={false}
                className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-300 rounded-lg border border-slate-800 resize-y leading-5 selection:bg-emerald-900/60"
              />
            </div>

          </div>

          {/* Expected Output */}
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Primary Expected Output (stdout)
            </label>
            <input
              type="text"
              placeholder="e.g. 150"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs"
            />
          </div>

          {/* Dynamic Test Cases Builder */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-900">Test Cases Assertion Suite</h4>
                <p className="text-[11px] text-slate-500">
                  Visible tests are displayed in candidate arena. Hidden tests prevent hardcoded cheat solutions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTestCase}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Case</span>
              </button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={tc.id || idx} className="bg-white border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">
                      Case #{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateTestCase(idx, { isHidden: !tc.isHidden })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 border ${
                          tc.isHidden
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {tc.isHidden ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden Assertion</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Visible to Candidate</span>
                          </>
                        )}
                      </button>

                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Input (stdin):</span>
                      <input
                        type="text"
                        placeholder="Leave empty if no stdin required"
                        value={tc.input}
                        onChange={(e) => handleUpdateTestCase(idx, { input: e.target.value })}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">Expected Output (stdout):</span>
                      <input
                        type="text"
                        placeholder="Expected output string"
                        value={tc.expectedOutput}
                        onChange={(e) => handleUpdateTestCase(idx, { expectedOutput: e.target.value })}
                        required
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="font-semibold text-slate-900 cursor-pointer">
              Publish immediately to Round {round} candidate pool
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg font-bold shadow-sm transition-colors"
            >
              {questionToEdit ? 'Save Changes' : 'Create & Inject Question'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
