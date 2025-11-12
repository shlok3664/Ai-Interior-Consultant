import React, { useRef, useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginCardRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1

    if (blob1Ref.current) {
      blob1Ref.current.style.transform = `translateX(${x * -40}px) translateY(${y * -20}px)`;
    }
    if (blob2Ref.current) {
      blob2Ref.current.style.transform = `translateX(${x * 30}px) translateY(${y * 50}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (blob1Ref.current) blob1Ref.current.style.transform = 'translate(0px, 0px)';
    if (blob2Ref.current) blob2Ref.current.style.transform = 'translate(0px, 0px)';
  };

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please fill in both email and password.');
      loginCardRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        loginCardRef.current?.classList.remove('animate-shake');
        setError('');
      }, 600);
      return;
    }
    onLogin();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative"
    >
      {/* Interactive Background Blobs */}
      <div 
        ref={blob1Ref} 
        className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500 rounded-full opacity-30 dark:opacity-40 filter blur-3xl transition-transform duration-300 ease-out"
      />
      <div 
        ref={blob2Ref} 
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500 rounded-full opacity-30 dark:opacity-40 filter blur-3xl transition-transform duration-300 ease-out"
      />

      <div 
        ref={loginCardRef}
        className="login-card z-10 max-w-md w-full text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight mb-4">
            <span className="font-extrabold bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">Welcome Back</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Sign in to continue your journey into AI-powered interior design.
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon />
                </span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow bg-white/80 shadow-sm dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-violet-400"
                />
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockIcon />
                </span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow bg-white/80 shadow-sm dark:bg-slate-700/80 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-violet-400"
                />
            </div>

            {error && <p className="text-sm text-red-500 dark:text-red-400 animate-fade-in-up" style={{ animationDelay: '0s', opacity: 0, animationName: 'fade-in-up' }}>{error}</p>}

            <div className="relative group pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-rose-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    type="submit"
                    className="relative w-full flex items-center justify-center bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all"
                >
                    <LoginIcon />
                    Sign In
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};