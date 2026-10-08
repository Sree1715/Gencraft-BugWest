import React from 'react';
import { User } from '../../types';
import { Terminal, Shield, LogOut, Trophy, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  activeView: string;
  onLogout: () => void;
  onOpenLogin: (role: 'participant' | 'organizer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigate,
  activeView,
  onLogout,
  onOpenLogin
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Text Wordmark Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-600 transition-colors">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                GENCRAFT
              </span>
              <span className="text-xs font-semibold text-blue-600 tracking-wider block -mt-0.5">
                BUG FEST
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-slate-900 ${
              activeView === 'landing' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>

          {currentUser?.role === 'participant' && (
            <button
              onClick={() => onNavigate('participant-dashboard')}
              className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 ${
                activeView === 'participant-dashboard' || activeView === 'coding-arena'
                  ? 'text-blue-600 font-semibold'
                  : ''
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Event Instructions & Arena</span>
            </button>
          )}

          {currentUser?.role === 'organizer' && (
            <button
              onClick={() => onNavigate('organizer-dashboard')}
              className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 ${
                activeView === 'organizer-dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Organizer Console</span>
            </button>
          )}

          {currentUser?.role === 'organizer' && (
            <button
              onClick={() => onNavigate('leaderboard')}
              className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 ${
                activeView === 'leaderboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Scoreboard & Rankings</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {currentUser.userId} · {currentUser.role === 'organizer' ? 'Organizer' : 'Candidate'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 font-bold text-xs uppercase">
                  {currentUser.userId.slice(0, 2)}
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap hidden sm:block">
                Department of Artificial Intelligence
              </span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
