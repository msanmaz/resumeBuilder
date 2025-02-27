// src/utils/experienceUtils.js
const CURRENT_YEAR = 2025;

const experienceLevels = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  EXECUTIVE: 'executive'
};

const titleLevelMap = {
  'SENIOR': experienceLevels.SENIOR,
  'LEAD': experienceLevels.SENIOR,
  'MANAGER': experienceLevels.EXECUTIVE,
  'EXECUTIVE': experienceLevels.EXECUTIVE,
  'DIRECTOR': experienceLevels.EXECUTIVE,
  'VP': experienceLevels.EXECUTIVE,
  'HEAD': experienceLevels.EXECUTIVE,
  'CHIEF': experienceLevels.EXECUTIVE,
};

const parseYear = (dateString) => {
  if (!dateString) return null;
  if (dateString.toLowerCase() === 'present') return CURRENT_YEAR;
  
  // Handle both "2001" and "Dec 2023" formats
  const yearMatch = dateString.match(/\d{4}/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
};

const calculateYearsOfExperience = (startDate, endDate) => {
  const startYear = parseYear(startDate);
  const endYear = parseYear(endDate);
  
  if (!startYear || !endYear) return 0;
  return endYear - startYear;
};

const getExperienceLevelFromYears = (years) => {
  if (years <= 2) return experienceLevels.ENTRY;
  if (years <= 5) return experienceLevels.MID;
  if (years <= 10) return experienceLevels.SENIOR;
  return experienceLevels.EXECUTIVE;
};

const getExperienceLevelFromTitle = (title) => {
  if (!title) return null;
  
  const upperTitle = title.toUpperCase();
  for (const [keyword, level] of Object.entries(titleLevelMap)) {
    if (upperTitle.includes(keyword)) {
      return level;
    }
  }
  return null;
};

export const determineExperienceLevel = (position) => {
  // Check title first
  const titleLevel = getExperienceLevelFromTitle(position.position);
  
  // Calculate years
  const years = calculateYearsOfExperience(position.startDate, position.endDate);
  const yearsLevel = getExperienceLevelFromYears(years);
  
  // Return the higher level between title and years
  const levels = [experienceLevels.ENTRY, experienceLevels.MID, experienceLevels.SENIOR, experienceLevels.EXECUTIVE];
  const titleIndex = titleLevel ? levels.indexOf(titleLevel) : -1;
  const yearsIndex = levels.indexOf(yearsLevel);
  
  return titleIndex > yearsIndex ? titleLevel : yearsLevel;
};