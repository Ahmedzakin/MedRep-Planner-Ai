import React, { useState } from 'react';
import { APP_PASSWORD } from '../constants';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === APP_PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">تأمين التطبيق</h1>
          <p className="text-slate-500 mt-2 text-sm">برجاء إدخال كود الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-3.5 rounded-xl border ${
                error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-200'
              } focus:outline-none focus:ring-4 transition-all text-center tracking-widest text-lg placeholder-slate-300`}
              placeholder="••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center mt-2 font-medium">الكود غير صحيح، حاول مرة أخرى.</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            دخول
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
             Protected by Ahmed Zaki
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;