
import { html } from 'htm/react';
import { useState } from 'react';
import { StressorType } from '../types.js';
import { X, Check, Lightbulb, Activity } from 'lucide-react';

const MOODS = [
  { value: 1, label: 'Very Bad', color: 'bg-red-100 text-red-600 border-red-200', icon: '😫' },
  { value: 2, label: 'Bad', color: 'bg-orange-100 text-orange-600 border-orange-200', icon: '😔' },
  { value: 3, label: 'Okay', color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: '😐' },
  { value: 4, label: 'Good', color: 'bg-lime-100 text-lime-600 border-lime-200', icon: '🙂' },
  { value: 5, label: 'Great', color: 'bg-green-100 text-green-600 border-green-200', icon: '😁' },
];

const STRESSORS = Object.values(StressorType);

const getCopingTip = (mood, stressor) => {
  // Positive Moods (4-5)
  if (mood >= 4) {
    switch (stressor) {
      case StressorType.EXAMS:
        return "You're in a great mindset! Use this energy to organize your study notes or help a classmate.";
      case StressorType.ASSIGNMENTS:
        return "Momentum is on your side. Tackle the hardest part of your assignment now while you feel good.";
      case StressorType.WORK:
        return "Productivity is high! Knock out your tasks so you can enjoy your free time later.";
      case StressorType.RELATIONSHIPS:
      case StressorType.FAMILY:
        return "Share your positivity! It's a great time to reach out to someone you care about.";
      default:
        return "You're doing great! Keep building on this positive momentum and enjoy your day.";
    }
  }

  // Neutral Mood (3)
  if (mood === 3) {
    return "You're holding steady. A moment of mindfulness now can help keep you balanced.";
  }

  // Negative Moods (1-2)
  switch (stressor) {
    case StressorType.EXAMS:
      return "Stop and breathe. You are more than your grades. Take a 10-minute break to reset.";
    case StressorType.ASSIGNMENTS:
      return "Overwhelmed? Don't look at the whole mountain. Just write one sentence right now.";
    case StressorType.MONEY:
      return "Financial stress is heavy. Remind yourself this situation is temporary and focus on today.";
    case StressorType.RELATIONSHIPS:
    case StressorType.FAMILY:
      return "Conflict hurts. It's okay to step back. Protect your peace and set boundaries if you need to.";
    case StressorType.HEALTH:
      return "Listen to your body. Rest is productive. Treat yourself with kindness today.";
    case StressorType.WORK:
      return "Leave work at work. Your mental health is more important than that deadline.";
    default:
      return "It's a tough day. Be gentle with yourself and take things one small step at a time.";
  }
};

const getRecommendedActivity = (mood, stressor) => {
  if (mood >= 4) {
    return "High Energy: Go for a run, hit the gym, try a new creative hobby, or meet up with friends!";
  }
  if (mood === 3) {
     return "Maintenance: Take a brisk 20-minute walk outside, tidy your room, or listen to a favorite podcast.";
  }
  switch (stressor) {
    case StressorType.EXAMS:
    case StressorType.ASSIGNMENTS:
    case StressorType.WORK:
       return "Desk Break: Stand up, stretch your arms overhead, and do 10 slow neck rolls to release tension.";
    case StressorType.MONEY:
    case StressorType.OTHER:
       return "Grounding: Hold an ice cube in your hand or splash cold water on your face to reset your nervous system.";
    case StressorType.FAMILY:
    case StressorType.RELATIONSHIPS:
       return "Release: Try progressive muscle relaxation. Tense shoulders for 5s, then release. Repeat for hands and legs.";
    case StressorType.HEALTH:
       return "Gentle Flow: Do 5 minutes of slow yoga stretches or lie in 'Child's Pose' to rest your body.";
    default:
       return "Comfort: Wrap yourself in a blanket, drink warm tea, or step outside for fresh air.";
  }
};

const CheckInFlow = ({ userId, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(null);
  const [stressor, setStressor] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (!mood || !stressor) return;
    setIsSubmitting(true);
    await onSubmit({
      userId,
      mood,
      stressor,
      note,
      timestamp: Date.now(),
    });
    setIsSubmitting(false);
  };

  return html`
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            ${step === 1 ? 'How are you feeling?' : 'What is impacting you?'}
          </h2>
          <button onClick=${onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <${X} size=${20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          
          ${step === 1 && html`
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                ${MOODS.map((m) => html`
                  <button
                    key=${m.value}
                    onClick=${() => setMood(m.value)}
                    className=${`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all group ${
                      mood === m.value 
                        ? `${m.color} border-current ring-1 ring-offset-2 ring-current` 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-200">${m.icon}</span>
                      <span className="font-medium text-lg text-slate-700">${m.label}</span>
                    </span>
                    ${mood === m.value && html`<${Check} size=${20} />`}
                  </button>
                `)}
              </div>
            </div>
          `}

          ${step === 2 && html`
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Main Stressor</label>
                <div className="flex flex-wrap gap-2">
                  ${STRESSORS.map((s) => html`
                    <button
                      key=${s}
                      onClick=${() => setStressor(s)}
                      className=${`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        stressor === s
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                      }`}
                    >
                      ${s}
                    </button>
                  `)}
                </div>
              </div>

              ${stressor && mood && html`
                <div className="grid grid-cols-1 gap-3">
                  <div className="animate-fade-in p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                    <${Lightbulb} className="text-indigo-600 flex-shrink-0 mt-0.5" size=${18} />
                    <div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">Mindful Tip</h4>
                      <p className="text-indigo-900 text-sm leading-relaxed">
                        ${getCopingTip(mood, stressor)}
                      </p>
                    </div>
                  </div>

                  <div className="animate-fade-in p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3">
                    <${Activity} className="text-teal-600 flex-shrink-0 mt-0.5" size=${18} />
                    <div>
                      <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-1">Recommended Activity</h4>
                      <p className="text-teal-900 text-sm leading-relaxed">
                        ${getRecommendedActivity(mood, stressor)}
                      </p>
                    </div>
                  </div>
                </div>
              `}

              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Notes (Optional)</label>
                <textarea
                  value=${note}
                  onChange=${(e) => setNote(e.target.value)}
                  placeholder="Anything specific happening today?"
                  className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
                />
              </div>
            </div>
          `}

        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
          ${step === 2 ? html`
            <button
              onClick=${() => setStep(1)}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          ` : html`<div></div>`}

          ${step === 1 ? html`
             <button
               disabled=${mood === null}
               onClick=${() => setStep(2)}
               className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-semibold shadow-sm transition-all"
             >
               Next
             </button>
          ` : html`
            <button
              disabled=${stressor === null || isSubmitting}
              onClick=${handleFinish}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              ${isSubmitting ? 'Saving...' : 'Finish'}
              ${!isSubmitting && html`<${Check} size=${18} />`}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
};

export default CheckInFlow;
