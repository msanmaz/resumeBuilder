// src/utils/__tests__/experienceUtils.test.js
import { determineExperienceLevel } from '../experienceUtils';

// Mock current year to ensure tests are consistent regardless of when they run
const originalDate = global.Date;
beforeAll(() => {
  // Mock Date to always return 2025-01-01
  global.Date = class extends Date {
    constructor() {
      super();
      return new originalDate('2025-01-01');
    }
  };
});

afterAll(() => {
  global.Date = originalDate;
});

describe('experienceUtils', () => {
  describe('determineExperienceLevel', () => {
    it('should determine entry level for short experience', () => {
      const position = {
        position: 'Developer',
        startDate: '2023',
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('entry');
    });
    
    it('should determine mid level for medium experience', () => {
      const position = {
        position: 'Developer',
        startDate: '2020',
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('mid');
    });
    
    it('should determine senior level for longer experience', () => {
      const position = {
        position: 'Developer',
        startDate: '2015',
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('senior');
    });
    
    it('should determine executive level for very long experience', () => {
      const position = {
        position: 'Developer',
        startDate: '2010',
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('executive');
    });
    
    it('should recognize senior from title keywords', () => {
      const position = {
        position: 'Senior Developer',
        startDate: '2023', // Only 2 years experience
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('senior'); // Title should override years
    });
    
    it('should recognize executive from title keywords', () => {
      const position = {
        position: 'VP of Engineering',
        startDate: '2023', // Only 2 years experience
        endDate: '2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('executive'); // Title should override years
    });
    
    it('should handle "present" as current year', () => {
      const position = {
        position: 'Developer',
        startDate: '2022',
        endDate: 'Present'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('entry'); // 2022 to 2025 = 3 years (entry level)
    });
    
    it('should handle date formats with month', () => {
      const position = {
        position: 'Developer',
        startDate: 'Jan 2020',
        endDate: 'Dec 2025'
      };
      
      const level = determineExperienceLevel(position);
      
      expect(level).toBe('mid'); // 2020 to 2025 = 5 years (mid level)
    });
  });
});