import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export default function ResumePreview({ data, previewRef }: ResumePreviewProps) {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-zinc-900 shadow-2xl min-h-[1000px] flex overflow-hidden" ref={previewRef}>
      {/* Sidebar */}
      <aside className="w-[30%] bg-[#1a2533] text-white p-8 flex flex-col gap-10">
        {/* Contact Section */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-1">Contact</h2>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-bold text-xs uppercase text-white/60 mb-1">Address</div>
              <div className="text-white/90">{data.personalInfo.location || 'Your Location'}</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase text-white/60 mb-1">Phone</div>
              <div className="text-white/90">{data.personalInfo.phone || 'Your Phone'}</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase text-white/60 mb-1">Email</div>
              <div className="text-white/90 break-all">{data.personalInfo.email || 'Your Email'}</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-1">Skills</h2>
          <ul className="space-y-2 text-sm text-white/90">
            {data.skills.map((skill, i) => (
              skill && <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Languages Section */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-1">Languages</h2>
            <ul className="space-y-2 text-sm text-white/90">
              {data.languages.map((lang, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  {lang}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies Section */}
        {data.hobbies && data.hobbies.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-1">Hobbies</h2>
            <ul className="space-y-2 text-sm text-white/90">
              {data.hobbies.map((hobby, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  {hobby}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-[70%] p-12 bg-white">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-zinc-900 uppercase tracking-tight mb-2">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-xl text-zinc-600 font-medium tracking-wide">
            {data.experience[0]?.position || 'Professional Title'}
          </p>
        </header>

        {/* Profile Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 border-b-2 border-zinc-900 pb-1 inline-block">Profile</h2>
          <p className="text-zinc-700 leading-relaxed mt-4">
            {data.personalInfo.summary || 'Summary will appear here...'}
          </p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 border-b-2 border-zinc-900 pb-1 inline-block">Work Experience</h2>
          <div className="space-y-8 mt-6">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-zinc-900">{exp.position || 'Position'}</h3>
                  <span className="text-sm text-zinc-500 font-medium">{exp.duration}</span>
                </div>
                <div className="text-zinc-600 font-bold text-sm mb-3">
                  {exp.company}
                </div>
                <ul className="space-y-2">
                  {exp.description.split('\n').map((line, j) => (
                    line.trim() && (
                      <li key={j} className="text-zinc-700 text-sm flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-zinc-900 rounded-full flex-shrink-0" />
                        {line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 border-b-2 border-zinc-900 pb-1 inline-block">Education</h2>
          <div className="space-y-6 mt-6">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-zinc-900">{edu.degree || 'Degree'}</h3>
                  <span className="text-sm text-zinc-500 font-medium">{edu.year}</span>
                </div>
                <div className="text-zinc-600 text-sm font-medium">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
