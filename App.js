
import { html } from 'htm/react';
import { useState, useEffect } from 'react';
import { getCurrentUser, mockSignOut, getHistory, saveCheckIn, seedInitialData } from './services/dataService.js';
import AuthScreen from './components/AuthScreen.js';
import CheckInFlow from './components/CheckInFlow.js';
import HistoryChart from './components/HistoryChart.js';
import { Plus, LogOut, Calendar, AlertCircle, TrendingUp, BarChart2, ShieldAlert, Check } from 'lucide-react';

// --- Helper Components for Dashboard ---

const MoodBadge = ({ mood }) => {
  const labels = ['Very Bad', 'Bad', 'Okay', 'Good', 'Great'];
  const label = labels[mood - 1] || 'Unknown';
  
  let colorClass;
  if (mood <= 2) {
    colorClass = 'bg-red-100 text-red-700';
  } else if (mood === 3) {
    colorClass = 'bg-yellow-100 text-yellow-800'; 
  } else {
    colorClass = 'bg-green-100 text-green-700';
  }

  return html`
    <span className=${`px-2 py-1 rounded-md text-xs font-bold ${colorClass}`}>
      ${label}
    </span>
  `;
};

const getMoodBorderColor = (mood) => {
  if (mood <= 2) return 'border-l-red-500';
  if (mood === 3) return 'border-l-yellow-500';
  return 'border-l-green-500';
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      seedInitialData(storedUser.uid); 
      loadData(storedUser.uid);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadData = async (uid) => {
    setIsLoading(true);
    const history = await getHistory(uid);
    setCheckIns(history);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await mockSignOut();
    setUser(null);
    setCheckIns([]);
  };

  const handleCheckInSubmit = async (data) => {
    if (!user) return;
    await saveCheckIn(data);
    await loadData(user.uid);
    setShowCheckIn(false);
  };

  const recentLogs = checkIns.slice(0, 7);
  const avgMood = recentLogs.length > 0 
    ? (recentLogs.reduce((acc, curr) => acc + curr.mood, 0) / recentLogs.length).toFixed(1) 
    : "N/A";
  
  const stressorCounts = {};
  recentLogs.forEach(log => {
    stressorCounts[log.stressor] = (stressorCounts[log.stressor] || 0) + 1;
  });
  const topStressor = Object.entries(stressorCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || "None";


  if (!user) {
    return html`<${AuthScreen} onAuthSuccess=${(u) => { setUser(u); loadData(u.uid); }} />`;
  }

  return html`
    <div className="min-h-screen bg-gray-50 pb-24">
      
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-semibold text-slate-800">MindfulStudent</span>
          </div>
          <button 
            onClick=${handleLogout}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <${LogOut} size=${20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Hello, ${user.displayName || 'Student'}</h1>
          <p className="text-slate-500">
            Let's check in on your mental health today.
          </p>
        </div>

        ${checkIns.length > 0 && html`
          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-2 text-slate-500 mb-2">
                 <${TrendingUp} size=${16} />
                 <span className="text-xs font-bold uppercase tracking-wider">7-Day Avg</span>
               </div>
               <div className="text-2xl font-bold text-slate-800 flex items-baseline gap-1">
                 ${avgMood} <span className="text-sm font-normal text-slate-400">/ 5</span>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
               <div className="flex items-center gap-2 text-slate-500 mb-2">
                 <${BarChart2} size=${16} />
                 <span className="text-xs font-bold uppercase tracking-wider">Top Stressor</span>
               </div>
               <div className="text-lg sm:text-xl font-bold text-brand-600 truncate">
                 ${topStressor}
               </div>
            </div>
          </section>
        `}

        <section>
          <${HistoryChart} data=${checkIns} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <${Calendar} size=${18} className="text-brand-500" />
              Recent Logs
            </h2>
            <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
              ${checkIns.length} entries
            </span>
          </div>

          <div className="space-y-3">
            ${isLoading ? html`
               <div className="text-center py-10 text-slate-400">Loading history...</div>
            ` : checkIns.length === 0 ? html`
               <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                 <p className="text-slate-500">No logs yet. Start your journey today!</p>
               </div>
            ` : (
              checkIns.map((log) => html`
                <div 
                  key=${log.id} 
                  className=${`bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow border-l-4 ${getMoodBorderColor(log.mood)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <${MoodBadge} mood=${log.mood} />
                      <span className="text-xs text-slate-400">
                        ${new Date(log.timestamp).toLocaleDateString()} • ${new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <${AlertCircle} size=${16} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Stressor: <span className="text-brand-600">${log.stressor}</span>
                      </p>
                      ${log.note && html`
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          "${log.note}"
                        </p>
                      `}
                    </div>
                  </div>
                </div>
              `)
            )}
          </div>
        </section>

        <footer className="pt-8 pb-4 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
            <${ShieldAlert} size=${14} />
            <span className="text-xs font-bold uppercase tracking-wider">Disclaimer</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            This tool is for self-reflection only and does not replace professional medical advice.
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs">
            <a href="#" className="text-brand-600 hover:underline">Campus Counseling</a>
            <span className="text-slate-300">|</span>
            <a href="#" className="text-brand-600 hover:underline">Emergency Resources</a>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <button
            onClick=${() => setShowCheckIn(true)}
            className="pointer-events-auto bg-brand-600 hover:bg-brand-700 text-white pl-5 pr-6 py-3 rounded-full shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <${Plus} size=${24} />
            <span className="font-semibold text-lg">Check In</span>
          </button>
      </div>

      ${showCheckIn && html`
        <${CheckInFlow} 
          userId=${user.uid}
          onClose=${() => setShowCheckIn(false)}
          onSubmit=${handleCheckInSubmit}
        />
      `}
    </div>
  `;
};

export default App;
