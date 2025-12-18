
import { html } from 'htm/react';
import { useState } from 'react';
import { mockSignIn, mockSignUp } from '../services/dataService.js';
import { Loader2, Mail, Lock, HeartPulse } from 'lucide-react';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const user = await mockSignIn(email, password);
        onAuthSuccess(user);
      } else {
        const user = await mockSignUp(email, password);
        onAuthSuccess(user);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return html`
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600">
            <${HeartPulse} size=${24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">MindfulStudent</h1>
          <p className="text-slate-500 mt-2">Track your mental wellness journey.</p>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <${Mail} className="absolute left-3 top-3 text-slate-400" size=${18} />
              <input
                type="email"
                required
                value=${email}
                onChange=${(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="student@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <${Lock} className="absolute left-3 top-3 text-slate-400" size=${18} />
              <input
                type="password"
                required
                value=${password}
                onChange=${(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          ${error && html`
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md text-center">
              ${error}
            </div>
          `}

          <button
            type="submit"
            disabled=${isLoading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            ${isLoading ? html`<${Loader2} className="animate-spin" size=${20} />` : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          ${isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick=${() => setIsLogin(!isLogin)}
            className="text-brand-600 font-semibold hover:underline"
          >
            ${isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  `;
};

export default AuthScreen;
