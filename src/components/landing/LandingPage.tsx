import React, { useState } from 'react';
import { 
  Bug, 
  Terminal, 
  Code2, 
  Cpu, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Trophy, 
  Clock, 
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { LeaderboardEntry } from '../../types';

interface LandingPageProps {
  onOpenLogin: (role: 'participant' | 'organizer') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What languages are supported in Bug Fest?',
      a: 'Bug Fest exclusively focuses on C and Python. Questions range from syntax edge-cases and pointer manipulation in C to object-oriented dunder methods and algorithmic bugs in Python.'
    },
    {
      q: 'How are answers evaluated?',
      a: 'Submissions are tested dynamically against both visible test vectors and hidden edge cases. Points are awarded based on test case pass rates, not just surface code text matches.'
    },
    {
      q: 'Can participants move back and forth between questions in a round?',
      a: 'Yes, during an active round, candidates can navigate freely between questions, run intermediate tests, refine their fixes, and submit whenever confident.'
    },
    {
      q: 'What happens when the round timer runs out?',
      a: 'The platform automatically freezes modifications, submits all current drafts for grading against test vectors, and navigates candidates to their round result summary.'
    },
    {
      q: 'Can organizers add or customize questions during the event?',
      a: 'Yes! The Organizer Command Console includes a full Question Authoring Suite allowing organizers to add, edit, or customize buggy code snippets, expected outputs, marks, and test cases for each round.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white pt-16 pb-16 md:pt-20 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-md text-xs font-semibold text-blue-700 mb-6">
              <Terminal className="w-3.5 h-3.5" />
              <span>COLLEGIATE TECHNICAL SYMPOSIUM 2026</span>
              <span className="text-blue-300">·</span>
              <span>C + PYTHON DEBUGGING ARENA</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight text-balance">
              GENCRAFT <span className="text-blue-600">—</span> BUG FEST
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-600 mb-6 tracking-tight">
              &ldquo;Find the Bug. Fix the Code. Prove Your Logic.&rdquo;
            </p>

            <p className="text-base text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed text-balance">
              The premier collegiate technical debugging championship. Test your analytical acumen across 
              three high-stakes rounds designed to uncover subtle memory leaks, logic traps, and syntax pitfalls in C and Python.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenLogin('participant')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
              >
                <span>Participant Login</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onOpenLogin('organizer')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>Organizer Login</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* About Bug Fest */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Championship Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Why Debugging Separates Good Coders from Great Engineers
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Writing new code is only half the craft. In high-performance engineering environments, finding 
              subtle off-by-one errors, race conditions, dangling pointers, and type misalignments under time pressure 
              is the true test of deep computer science logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Authentic Bug Vectors
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Problems are carefully drafted based on real production bugs: uninitialized memory, dangling pointers, 
                dangling elses, mutable default arguments, and MRO resolution errors.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                In-Browser Code Arena
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Integrated browser editor with syntax highlighting, line numbers, test execution console, and 
                controlled execution without exposing hidden regression vectors.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Live Organizer Control
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organizers retain complete sovereignty: adjust round timers live, author custom bugs, 
                inspect code diffs, and control progression gates between rounds.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3 Competition Rounds Breakdown */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Tournament Structure
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Three Rigorous Competition Rounds
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Candidates progress sequentially from foundational syntax traps to professional memory anomalies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Round 1 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                    ROUND 1
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    20 Questions · 100 Marks
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Basic Debugging
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Quick identification of syntax and introductory logic flaws.
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>For and While Loop condition flaws</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Missing semicolons & uninitialized variables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Python indentation & string immutability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Dangling else & operator precedence</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Format: C & Python</span>
                <span>Speed: Fast-Paced</span>
              </div>
            </div>

            {/* Round 2 */}
            <div className="bg-white rounded-xl border-2 border-blue-600 shadow-sm p-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Core Qualifier
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                    ROUND 2
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    10 Questions · 100 Marks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Core Programming & Debugging
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Structural algorithms, pointer math, and data structure bugs.
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Pointer dereferencing & address swap errors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Dynamic memory malloc/free & struct pointers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Python dunder methods (__eq__, __hash__)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Singly linked list pointer severing</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Format: C & Python</span>
                <span>Depth: Comprehensive</span>
              </div>
            </div>

            {/* Round 3 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
                    ROUND 3
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    5 Questions · 100 Marks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Advanced Professional Debugging
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Hard memory corruption, MRO linearization, and complex algorithms.
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Double free & dangling pointers in stack nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Diamond inheritance & cooperative super() flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Lomuto partition index underflow on duplicates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>LRU Cache doubly linked list node corruption</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Format: C & Python</span>
                <span>Tier: Master Level</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* C + Python Topics Syllabus */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Competition Scope
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Languages & Core Domains Tested
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We strictly test language fundamentals, runtime semantics, and standard data structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* C Track */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-900 text-white font-mono font-bold text-sm flex items-center justify-center">
                  C
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">C Language Debugging</h3>
                  <span className="text-xs text-slate-500">GCC 13+ standard semantics</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Pointers & Addresses (&, *)</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Dynamic Memory (malloc/free)</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Struct Pointers & Arrays</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Null Byte Terminators</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Switch Fallthrough & Loops</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Operator Precedence</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Linked Lists & Stacks</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Sorting & Partitioning</span>
              </div>
            </div>

            {/* Python Track */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-yellow-600 text-white font-mono font-bold text-sm flex items-center justify-center">
                  Py
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Python 3 Debugging</h3>
                  <span className="text-xs text-slate-500">Python 3.12+ runtime model</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-700">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">List Slicing & Mutability</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Mutable Default Args</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Scope & Global Variables</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">OOP Dunder (__eq__, __hash__)</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Multiple Inheritance & super()</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Exceptions & Control Flow</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Generators & Iterators</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded">Dynamic Programming Caches</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Workflow
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              How the Competition Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center mx-auto mb-4 font-mono">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Login to Arena</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log in with your designated access code or participant credentials to enter your personal workspace.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center mx-auto mb-4 font-mono">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Analyze Buggy Code</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Read the problem statement and inspect the faulty starter code in the split editor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center mx-auto mb-4 font-mono">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Run Test Vectors</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Modify code and click Run to verify fixes against visible test assertions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4 font-mono">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Submit & Score</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit solution for grading against hidden test cases and earn points on the leaderboard.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Rules Section */}
      <section className="py-16 border-b border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Fair Play
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Competition Rules & Code of Conduct
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <div>
                <strong className="block text-slate-900 mb-0.5">Strict Time Limits</strong>
                Rounds are timed strictly according to organizer settings. Once the clock hits 00:00, all answers are submitted automatically.
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <div>
                <strong className="block text-slate-900 mb-0.5">Automated Test Grading</strong>
                Scores are determined by passing hidden regression test cases, preventing hardcoded outputs from scoring full credit.
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <div>
                <strong className="block text-slate-900 mb-0.5">No Tab Switching / External Assistance</strong>
                Participant sessions log activity timestamps. External compiler scraping or collaboration is strictly prohibited.
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                4
              </span>
              <div>
                <strong className="block text-slate-900 mb-0.5">Sequential Round Unlocks</strong>
                Candidates must complete each round before progressing to the subsequent stage under organizer coordination.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-600 block mb-2">
              Assistance
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      openFaq === index ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 py-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-10 bg-slate-900 text-white text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                GENCRAFT — BUG FEST
              </span>
              <span className="text-[11px] text-slate-400">
                Collegiate Debugging Competition Arena
              </span>
            </div>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            <span>&copy; 2026 Gencraft Technical Symposium. All rights reserved.</span>
            <div className="mt-1 flex items-center justify-center md:justify-end gap-4 text-slate-400">
              <span>C (GCC 13+)</span>
              <span>·</span>
              <span>Python 3.12+</span>
              <span>·</span>
              <span>3 Rounds (35 Debugging Problems)</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
