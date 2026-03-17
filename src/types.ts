export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
  languages: string[];
  hobbies: string[];
}

export interface EvaluationData {
  overallScore: number;
  criteria: {
    clarity: number;
    skill: number;
    experience: number;
    education: number;
    work: number;
  };
  feedback: string;
}
