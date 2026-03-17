import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { EvaluationData } from '../types';
import { motion } from 'motion/react';

interface EvaluationSectionProps {
  data: EvaluationData;
}

export default function EvaluationSection({ data }: EvaluationSectionProps) {
  const chartData = [
    { name: 'Score', value: data.overallScore },
    { name: 'Remaining', value: 100 - data.overallScore }
  ];

  const criteria = [
    { label: 'Clarity', value: data.criteria.clarity },
    { label: 'Skill', value: data.criteria.skill },
    { label: 'Experience', value: data.criteria.experience },
    { label: 'Education', value: data.criteria.education },
    { label: 'Work', value: data.criteria.work }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-surface/30 backdrop-blur-xl p-12 rounded-3xl border border-white/10">
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                startAngle={90}
                endAngle={450}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="var(--color-accent)" className="glow-border" />
                <Cell fill="rgba(255,255,255,0.05)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white glow-text">{data.overallScore}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Overall Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {criteria.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                <span className="text-zinc-400">{c.label}</span>
                <span className="text-accent glow-text">{c.value}/100</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-accent glow-border"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-sm font-bold text-accent glow-text uppercase tracking-widest mb-3">AI Feedback</h3>
          <p className="text-zinc-400 text-sm leading-relaxed italic">"{data.feedback}"</p>
        </div>
      </div>
    </div>
  );
}
