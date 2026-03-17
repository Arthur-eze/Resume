import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Download, Sparkles, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SimpleResumeForm from './components/SimpleResumeForm';
import ResumePreview from './components/ResumePreview';
import EvaluationSection from './components/EvaluationSection';
import { evaluateResume, refineResumeContent, parseResumeInput } from './services/ai';
import { ResumeData, EvaluationData } from './types';

import { CrackersLogo } from './components/CrackersLogo';

export default function App() {
  const [craftText, setCraftText] = useState('FUTURE');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const handleGenerate = async (input: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Parse natural language input
      const parsedData = await parseResumeInput(input);
      
      // 2. Refine content with AI
      const refined = await refineResumeContent(parsedData);
      setResumeData(refined);
      
      // 3. Evaluate with AI
      const evalData = await evaluateResume(refined);
      setEvaluation(evalData);
      
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating resume:', err);
      setError(err.message || 'An unexpected error occurred while generating your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resume-${resumeData?.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center glow-border">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="text-xl font-black tracking-tighter glow-text">PRORESUME</span>
        </div>
        <div className="flex items-center gap-6">
          {showResults && resumeData && (
            <button
              onClick={downloadPDF}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all font-bold text-sm"
            >
              <Download size={16} /> DOWNLOAD
            </button>
          )}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-accent/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
              <CrackersLogo />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div style={{ opacity, scale }} className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} /> AI-Powered Career Growth
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none flex flex-col items-center"
          >
            <span>CRAFT YOUR</span>
            {showResults && resumeData ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={downloadPDF}
                className="mt-4 px-12 py-6 rounded-2xl bg-accent text-white font-bold text-2xl md:text-4xl glow-border hover:scale-105 transition-all flex items-center gap-4 animate-float shadow-[0_0_50px_rgba(168,85,247,0.4)]"
              >
                <Download size={40} /> DOWNLOAD PDF
              </motion.button>
            ) : (
              <input
                type="text"
                value={craftText}
                onChange={(e) => setCraftText(e.target.value.toUpperCase())}
                className="bg-transparent text-center border-none outline-none text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400 glow-text w-full max-w-4xl cursor-text placeholder:opacity-20"
                placeholder="ENTER TEXT"
                spellCheck={false}
              />
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            The next generation of resume building. Professional design, AI-driven refinement, and instant evaluation to land your dream job.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 rounded-full bg-accent text-white font-bold text-lg glow-border hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </section>

      {/* Builder Section */}
      <section id="builder" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Your Details</h2>
            <p className="text-zinc-500">Describe your career in your own words, and we'll handle the rest.</p>
          </div>
          <SimpleResumeForm onSubmit={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center max-w-2xl mx-auto"
            >
              {error}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && resumeData && evaluation && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 px-4 bg-surface/20"
          >
            <div className="max-w-7xl mx-auto space-y-32">
              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tight mb-4">EVALUATION & PREVIEW</h2>
                <p className="text-zinc-500">Here's how your professional profile stacks up.</p>
              </div>

              <EvaluationSection data={evaluation} />

              <div className="space-y-12">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={downloadPDF}
                    className="px-8 py-4 rounded-xl bg-accent text-white font-bold glow-border hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <Download size={20} /> Download PDF
                  </button>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ResumePreview data={resumeData} previewRef={previewRef} />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <Sparkles className="text-white" size={14} />
            </div>
            <span className="text-lg font-black tracking-tighter glow-text">PRORESUME</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Proresume. Built for the future of work.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors"><Github size={20} /></a>
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-zinc-500 hover:text-accent transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
