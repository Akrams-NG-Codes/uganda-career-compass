
export interface Career {
  name: string;
  description: string;
  subjectCombination: string;
  educationPathway: string;
  matchCriteria: {
    subjects: string[];
    interests: string[];
    workingStyles: string[];
  };
  averageSalary?: string;
  universities?: string[];
}

export const careers: Career[] = [
  {
    name: "Software Engineer",
    description: "Develops computer applications and systems to solve problems and improve efficiency.",
    subjectCombination: "PCM (Physics, Chemistry, Mathematics)",
    educationPathway: "A-level PCM + Bachelor's degree in Computer Science or Software Engineering",
    matchCriteria: {
      subjects: ["mathematics", "physics", "computer", "ict"],
      interests: ["technology", "computers", "programming", "problem solving", "innovation"],
      workingStyles: ["analytical", "independent", "creative", "technical", "data"]
    },
    averageSalary: "2,000,000 - 5,000,000 UGX monthly (entry-level to experienced)",
    universities: ["Makerere University", "Uganda Technology and Management University", "Mbarara University"]
  },
  {
    name: "Doctor",
    description: "Diagnoses and treats illnesses and injuries in patients.",
    subjectCombination: "PCB (Physics, Chemistry, Biology)",
    educationPathway: "A-level PCB + Bachelor of Medicine and Surgery (5 years) + Internship",
    matchCriteria: {
      subjects: ["biology", "chemistry", "physics", "science"],
      interests: ["medicine", "health", "helping people", "research"],
      workingStyles: ["people", "caring", "analytical", "detail-oriented"]
    },
    averageSalary: "3,000,000 - 8,000,000 UGX monthly (depending on specialization)",
    universities: ["Makerere University", "Mbarara University of Science and Technology", "Kampala International University"]
  },
  {
    name: "Teacher",
    description: "Educates students and helps them develop knowledge and skills.",
    subjectCombination: "Arts or Sciences (depending on teaching subject)",
    educationPathway: "A-level + Bachelor's degree in Education or Bachelor's degree + Postgraduate Diploma in Education",
    matchCriteria: {
      subjects: ["any subject", "literature", "languages", "history", "geography", "mathematics", "sciences"],
      interests: ["teaching", "helping others", "education", "knowledge sharing"],
      workingStyles: ["people", "communication", "patience", "organizing"]
    },
    averageSalary: "800,000 - 2,500,000 UGX monthly (public to private institutions)",
    universities: ["Kyambogo University", "Makerere University", "Uganda Christian University"]
  },
  {
    name: "Nurse",
    description: "Provides care for patients and supports overall health and wellbeing.",
    subjectCombination: "PCB (Physics, Chemistry, Biology) or BCM (Biology, Chemistry, Mathematics)",
    educationPathway: "A-level PCB/BCM + Diploma or Bachelor's degree in Nursing",
    matchCriteria: {
      subjects: ["biology", "chemistry", "health science"],
      interests: ["healthcare", "helping people", "medicine"],
      workingStyles: ["people", "caring", "detail-oriented", "practical"]
    },
    averageSalary: "1,000,000 - 3,000,000 UGX monthly",
    universities: ["Mulago School of Nursing and Midwifery", "Makerere University", "Kampala International University"]
  },
  {
    name: "Accountant",
    description: "Manages financial records and provides financial advice to businesses and individuals.",
    subjectCombination: "MEG (Mathematics, Economics, Geography) or MEC (Mathematics, Economics, Commerce)",
    educationPathway: "A-level with Mathematics + Bachelor's degree in Accounting/Finance + ACCA/CPA certification",
    matchCriteria: {
      subjects: ["mathematics", "economics", "commerce", "business studies"],
      interests: ["business", "finance", "economics", "organizations"],
      workingStyles: ["analytical", "detail-oriented", "data", "organized"]
    },
    averageSalary: "1,500,000 - 6,000,000 UGX monthly (entry-level to experienced)",
    universities: ["Makerere University Business School", "Kyambogo University", "Uganda Management Institute"]
  },
  {
    name: "Agricultural Officer",
    description: "Provides expertise and guidance on farming practices and agricultural development.",
    subjectCombination: "BCG (Biology, Chemistry, Geography) or PCB (Physics, Chemistry, Biology)",
    educationPathway: "A-level BCG/PCB + Bachelor's degree in Agriculture or related field",
    matchCriteria: {
      subjects: ["biology", "agriculture", "chemistry", "geography"],
      interests: ["agriculture", "farming", "environment", "rural development", "food security"],
      workingStyles: ["practical", "outdoors", "people", "hands-on"]
    },
    averageSalary: "1,200,000 - 3,500,000 UGX monthly",
    universities: ["Makerere University", "Gulu University", "Busitema University"]
  },
  {
    name: "Lawyer",
    description: "Provides legal advice and representation to individuals and organizations.",
    subjectCombination: "HEG (History, Economics, Geography) or LEG (Literature, Economics, Geography)",
    educationPathway: "A-level Arts subjects + Bachelor of Laws (LLB) + Diploma in Legal Practice",
    matchCriteria: {
      subjects: ["literature", "history", "economics", "english"],
      interests: ["law", "justice", "politics", "debate", "reading"],
      workingStyles: ["analytical", "communication", "critical thinking", "research"]
    },
    averageSalary: "2,000,000 - 10,000,000+ UGX monthly (depending on specialization and experience)",
    universities: ["Makerere University", "Uganda Christian University", "Law Development Centre (for post-graduate diploma)"]
  },
  {
    name: "Entrepreneur/Business Owner",
    description: "Starts and manages businesses, identifying opportunities and taking calculated risks.",
    subjectCombination: "Various - often MEG (Mathematics, Economics, Geography) or MEC (Mathematics, Economics, Commerce)",
    educationPathway: "A-level + Bachelor's degree in Business Administration, Entrepreneurship, or related field (optional)",
    matchCriteria: {
      subjects: ["economics", "business studies", "entrepreneurship", "mathematics"],
      interests: ["business", "innovation", "leadership", "independence", "creating"],
      workingStyles: ["creative", "risk-taking", "leadership", "communication", "adaptable"]
    },
    averageSalary: "Variable - depends on business success",
    universities: ["Makerere University Business School", "Uganda Management Institute", "Enterprise Uganda (for training)"]
  }
];

export const matchCareers = (
  subjects: string[],
  interests: string[],
  workingStyles: string[]
): Career[] => {
  const normalizeInput = (input: string): string => {
    return input.toLowerCase().trim();
  };

  // Calculate match score for each career
  const careerScores = careers.map(career => {
    let score = 0;
    
    // Check subjects match
    subjects.forEach(subject => {
      if (career.matchCriteria.subjects.some(s => normalizeInput(subject).includes(normalizeInput(s)) || 
          normalizeInput(s).includes(normalizeInput(subject)))) {
        score += 2;
      }
    });
    
    // Check interests match
    interests.forEach(interest => {
      if (career.matchCriteria.interests.some(i => normalizeInput(interest).includes(normalizeInput(i)) || 
          normalizeInput(i).includes(normalizeInput(interest)))) {
        score += 3;
      }
    });
    
    // Check working style match
    workingStyles.forEach(style => {
      if (career.matchCriteria.workingStyles.some(ws => normalizeInput(style).includes(normalizeInput(ws)) || 
          normalizeInput(ws).includes(normalizeInput(style)))) {
        score += 2;
      }
    });
    
    return {
      career,
      score
    };
  });
  
  // Sort by score and return top 3
  const sortedCareers = careerScores
    .sort((a, b) => b.score - a.score)
    .map(item => item.career)
    .slice(0, 3);
  
  return sortedCareers;
};

export const getMatchReasons = (
  career: Career,
  subjects: string[],
  interests: string[],
  workingStyles: string[]
): string => {
  const normalizeInput = (input: string): string => {
    return input.toLowerCase().trim();
  };
  
  const matchedSubjects: string[] = [];
  const matchedInterests: string[] = [];
  const matchedStyles: string[] = [];
  
  // Find matched subjects
  subjects.forEach(subject => {
    career.matchCriteria.subjects.forEach(s => {
      if (normalizeInput(subject).includes(normalizeInput(s)) || 
          normalizeInput(s).includes(normalizeInput(subject))) {
        matchedSubjects.push(subject);
      }
    });
  });
  
  // Find matched interests
  interests.forEach(interest => {
    career.matchCriteria.interests.forEach(i => {
      if (normalizeInput(interest).includes(normalizeInput(i)) || 
          normalizeInput(i).includes(normalizeInput(interest))) {
        matchedInterests.push(interest);
      }
    });
  });
  
  // Find matched working styles
  workingStyles.forEach(style => {
    career.matchCriteria.workingStyles.forEach(ws => {
      if (normalizeInput(style).includes(normalizeInput(ws)) || 
          normalizeInput(ws).includes(normalizeInput(style))) {
        matchedStyles.push(style);
      }
    });
  });
  
  // Build reason string
  let reason = "This career matches your profile because ";
  
  if (matchedSubjects.length > 0) {
    reason += `it aligns with your strong subjects (${matchedSubjects.join(", ")}), `;
  }
  
  if (matchedInterests.length > 0) {
    reason += `it involves your interests in ${matchedInterests.join(", ")}, `;
  }
  
  if (matchedStyles.length > 0) {
    reason += `and it suits your preferred working style (${matchedStyles.join(", ")}).`;
  }
  
  return reason;
};
