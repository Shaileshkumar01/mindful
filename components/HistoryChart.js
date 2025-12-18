
import { html } from 'htm/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const HistoryChart = ({ data }) => {
  const chartData = [...data]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(item => ({
      date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mood: item.mood,
    }));

  if (chartData.length < 2) {
    return html`
      <div className="h-48 flex items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
        <p className="text-sm">Log more entries to see trends</p>
      </div>
    `;
  }

  return html`
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Mood Trend</h3>
      <div className="h-48 w-full">
        <${ResponsiveContainer} width="100%" height="100%">
          <${AreaChart} data=${chartData}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity=${0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity=${0}/>
              </linearGradient>
            </defs>
            <${CartesianGrid} strokeDasharray="3 3" vertical=${false} stroke="#f1f5f9" />
            <${XAxis} 
              dataKey="date" 
              axisLine=${false} 
              tickLine=${false} 
              tick=${{ fontSize: 10, fill: '#94a3b8' }} 
              interval="preserveStartEnd"
            />
            <${YAxis} 
              hide 
              domain=${[1, 5]} 
            />
            <${Tooltip} 
              contentStyle=${{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle=${{ color: '#0284c7', fontWeight: 600 }}
            />
            <${Area} 
              type="monotone" 
              dataKey="mood" 
              stroke="#0ea5e9" 
              strokeWidth=${3}
              fillOpacity=${1} 
              fill="url(#colorMood)" 
            />
          <//>
        <//>
      </div>
    </div>
  `;
};

export default HistoryChart;
