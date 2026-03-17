import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export default function ResumePreview({ data, previewRef }: ResumePreviewProps) {
  return (
    <div 
      className="w-full max-w-[800px] mx-auto shadow-2xl min-h-[1000px] flex overflow-hidden" 
      style={{ backgroundColor: '#ffffff', color: '#18181b' }}
      ref={previewRef}
    >
      {/* Sidebar */}
      <aside className="w-[30%] p-8 flex flex-col gap-10" style={{ backgroundColor: '#1a2533', color: '#ffffff' }}>
        {/* Contact Section */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Contact</h2>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-bold text-xs uppercase mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Address</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo?.location || 'Your Location'}</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Phone</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo?.phone || 'Your Phone'}</div>
            </div>
            <div>
              <div className="font-bold text-xs uppercase mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Email</div>
              <div className="break-all" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo?.email || 'Your Email'}</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Skills</h2>
          <ul className="space-y-2 text-sm">
            {data.skills?.map((skill, i) => (
              skill && <li key={i} className="flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* Languages Section */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Languages</h2>
            <ul className="space-y-2 text-sm">
              {data.languages?.map((lang, i) => (
                <li key={i} className="flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
                  {lang}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies Section */}
        {data.hobbies && data.hobbies.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 pb-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>Hobbies</h2>
            <ul className="space-y-2 text-sm">
              {data.hobbies?.map((hobby, i) => (
                <li key={i} className="flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
                  {hobby}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-[70%] p-12" style={{ backgroundColor: '#ffffff' }}>
        <header className="mb-12">
          <h1 className="text-5xl font-bold uppercase tracking-tight mb-2" style={{ color: '#18181b' }}>
            {data.personalInfo?.fullName || 'Your Name'}
          </h1>
          <p className="text-xl font-medium tracking-wide" style={{ color: '#52525b' }}>
            {data.experience?.[0]?.position || 'Professional Title'}
          </p>
        </header>

        {/* Profile Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 pb-1 inline-block" style={{ borderBottom: '2px solid #18181b', color: '#18181b' }}>Profile</h2>
          <p className="leading-relaxed mt-4" style={{ color: '#3f3f46' }}>
            {data.personalInfo?.summary || 'Summary will appear here...'}
          </p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 pb-1 inline-block" style={{ borderBottom: '2px solid #18181b', color: '#18181b' }}>Work Experience</h2>
          <div className="space-y-8 mt-6">
            {data.experience?.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg" style={{ color: '#18181b' }}>{exp.position || 'Position'}</h3>
                  <span className="text-sm font-medium" style={{ color: '#71717a' }}>{exp.duration}</span>
                </div>
                <div className="font-bold text-sm mb-3" style={{ color: '#52525b' }}>
                  {exp.company}
                </div>
                <ul className="space-y-2">
                  {exp.description?.split('\n').map((line, j) => (
                    line.trim() && (
                      <li key={j} className="text-sm flex gap-3" style={{ color: '#3f3f46' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#18181b' }} />
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
          <h2 className="text-xl font-bold uppercase tracking-widest mb-2 pb-1 inline-block" style={{ borderBottom: '2px solid #18181b', color: '#18181b' }}>Education</h2>
          <div className="space-y-6 mt-6">
            {data.education?.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold" style={{ color: '#18181b' }}>{edu.degree || 'Degree'}</h3>
                  <span className="text-sm font-medium" style={{ color: '#71717a' }}>{edu.year}</span>
                </div>
                <div className="text-sm font-medium" style={{ color: '#52525b' }}>{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
