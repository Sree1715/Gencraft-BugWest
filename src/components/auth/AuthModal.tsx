import React, { useState } from 'react';
import { User } from '../../types';
import { competitionStore, SAMPLE_USERS } from '../../store/competitionStore';
import { 
  X, 
  Lock, 
  Key, 
  Users, 
  ShieldAlert, 
  ArrowRight,
  Shield,
  HelpCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'participant' | 'organizer';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  role: initialRole,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'participant' | 'organizer'>(initialRole);
  
  // Participant Form state (Strictly: Team Name + Bugfest Code)
  const [teamName, setTeamName] = useState('');
  const [bugfestCode, setBugfestCode] = useState('');

  // Organizer Form state
  const [orgId, setOrgId] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  
  // Organizer OTP state
  const [orgEmail, setOrgEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync tab on role change or open
  React.useEffect(() => {
    setActiveTab(initialRole);
    setError(null);
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  // Handle participant login with Team Name + Bugfest Code
  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await competitionStore.loginParticipantWithTeamCode(teamName, bugfestCode);
      setLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setError(result.error || 'Invalid Team Name or Bugfest Code. Please check the code provided by the organizing coordination team.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred while logging in.');
    }
  };

  // Handle organizer login via ID
  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanId = orgId.trim().toUpperCase();
      const orgAccount = SAMPLE_USERS.ORG001;

      if (cleanId !== 'ORG001' && cleanId !== 'ORG-9999' && cleanId !== 'ORGANIZER') {
        setError('Invalid Organizer ID. Please verify your credentials.');
        setLoading(false);
        return;
      }

      if (orgPassword.trim() !== orgAccount.passwordHash) {
        setError('Incorrect password. Please verify your credentials.');
        setLoading(false);
        return;
      }

      setLoading(false);
      competitionStore.loginByCodeOrId(cleanId);
      onLoginSuccess(orgAccount.user);
      onClose();
    }, 250);
  };

  const handleSendOtp = () => {
    if (!orgEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setError(null);
    console.log(`[System] Sent OTP ${newOtp} to ${orgEmail}`);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
       const orgAccount = SAMPLE_USERS.ORG001;
       competitionStore.loginByCodeOrId('ORG001');
       onLoginSuccess(orgAccount.user);
       onClose();
    } else {
       setError('Invalid verification code.');
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Tabs */}
        <div className="px-6 pt-5 pb-0 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                GENCRAFT — BUG FEST
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {activeTab === 'participant' ? 'Participant Login' : 'Organizer Authentication'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('participant');
                setError(null);
              }}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'participant'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Participant Login
            </button>
            <button
              onClick={() => {
                setActiveTab('organizer');
                setError(null);
              }}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'organizer'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Organizer Portal
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 1: PARTICIPANT LOGIN (TEAM NAME + BUGFEST CODE) */}
          {/* ==================================================== */}
          {activeTab === 'participant' && (
            <form onSubmit={handleParticipantSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Team Name
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Team Alpha or ByteWarriors"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/30 text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Enter your registered team designation for the competition.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Bugfest Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={bugfestCode}
                    onChange={(e) => setBugfestCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BF-R1-XXXXXX"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm font-mono font-bold tracking-wider uppercase border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/30 text-slate-900"
                  />
                </div>
                <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-500">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    The Bugfest Code is generated in the organizer portal and provided manually to all teams by the event coordination desk for this round.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Verifying Credentials...' : 'Access Event & Instructions'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* ==================================================== */}
          {/* TAB 2: ORGANIZER LOGIN */}
          {/* ==================================================== */}
          {activeTab === 'organizer' && (
            <div className="space-y-6">
              

              {/* Method B: Email OTP */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800">Login with Email</h3>
                {!otpSent ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      placeholder="Enter organizer email"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Send Code
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        className="w-full px-3 py-2 text-sm font-mono tracking-widest border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        Verify
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-blue-600 hover:underline self-start"
                    >
                      Resend Code
                    </button>
                  </div>
                )}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Method C: Organizer ID */}
              <form onSubmit={handleOrganizerSubmit} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800">Login with Organizer ID</h3>
                <div>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={orgId}
                      onChange={(e) => setOrgId(e.target.value.toUpperCase())}
                      placeholder="Enter Organizer ID"
                      className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : 'Sign In with ID'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
