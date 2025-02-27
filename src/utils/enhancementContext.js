// src/utils/enhancementContexts.js
import { determineExperienceLevel } from './experienceUtils';

// Common parameters that might be shared between sections
const baseParameters = {
  temperature: 0.7,
  style: "professional",
  preserveKeywords: true
};

export const workContextBuilder = (data) => ({
  context: {
    role: data.position || '',
    industry: data.company || '',
    experienceLevel: determineExperienceLevel(data)
  },
  parameters: {
    ...baseParameters,
    focusAreas: [
      "keywords",
      "achievements",
      "metrics",
      "action_verbs"
    ]
  }
});

export const educationContextBuilder = (data) => ({
  context: {
    degree: data.degree || '',
    institution: data.institution || '',
    field: extractFieldFromDegree(data.degree || '')
  },
  parameters: {
    ...baseParameters,
    focusAreas: [
      "academic_achievements",
      "coursework",
      "research",
      "skills"
    ]
  }
});

// Helper function to extract field of study from degree
function extractFieldFromDegree(degree) {
  const degreeTypes = ['BS', 'BA', 'MS', 'MA', 'PHD', 'BACHELOR', 'MASTER', 'DOCTORATE'];
  const degreePattern = new RegExp(`(${degreeTypes.join('|')})\\s*(OF|IN)?\\s*(.+)`, 'i');
  
  const match = degree.match(degreePattern);
  if (match && match[3]) {
    return match[3].trim();
  }
  return degree; // Return full degree if pattern doesn't match
}
