import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SimpleResumeFormProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export default function SimpleResumeForm({ onSubmit, isLoading }: SimpleResumeFormProps) {
  const [input, setInput] = useState('');

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Details</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I'm a software engineer with 5 years of experience in React and Node.js. I graduated from MIT with a CS degree. I worked at Google and Meta..."
              className="relative w-full h-64 bg-background/50 border border-white/10 rounded-2xl p-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-accent/50 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        <button
          onClick={() => onSubmit(input)}
          disabled={isLoading || !input.trim()}
          className="w-full py-5 rounded-2xl bg-accent text-white font-black text-lg glow-border hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Sparkles size={24} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? 'Processing Details...' : 'Generate Professional Resume'}
        </button>
      </div>
    </div>
  );
}
