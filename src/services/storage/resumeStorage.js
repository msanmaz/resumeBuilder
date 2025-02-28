import { v4 as uuidv4 } from 'uuid';
import { generateThumbnail } from '../../utils/pdfThumbnail';

const STORAGE_KEY = 'resumes'; // Single storage key

export const resumeStorage = {
  // Get all resumes
  getAllResumes: () => {
    try {
      const resumes = localStorage.getItem(STORAGE_KEY);
      return resumes ? JSON.parse(resumes) : {};
    } catch (error) {
      console.error('Error getting resumes:', error);
      return {};
    }
  },

  saveResumeWithThumbnail: async (resumeData, template, id = uuidv4()) => {
    try {
      // Input validation
      if (!resumeData || !template) {
        throw new Error('Missing required resume data or template');
      }

      console.log('Generating thumbnail as part of save operation...');
      
      // Generate thumbnail using the new reliable method
      const thumbnail = await generateThumbnail(
        { resume: resumeData },
        template
      );

      // Get existing resumes
      const resumes = resumeStorage.getAllResumes();
      const timestamp = new Date().toISOString();

      // Create/update resume entry
      resumes[id] = {
        id,
        data: resumeData,
        template,
        thumbnail,
        createdAt: resumes[id]?.createdAt || timestamp,
        lastModified: timestamp,
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      
      return {
        success: true,
        id,
        thumbnail
      };
    } catch (error) {
      console.error('Error saving resume with thumbnail:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Save resume
  saveResume: (resumeData, template, thumbnail, id = uuidv4()) => {
    try {
      // Input validation
      if (!resumeData || !template) {
        throw new Error('Missing required resume data or template');
      }

      // Get existing resumes
      const resumes = resumeStorage.getAllResumes();
      const timestamp = new Date().toISOString();

      // Create/update resume entry
      resumes[id] = {
        id,
        data: resumeData,
        template,
        thumbnail,
        createdAt: resumes[id]?.createdAt || timestamp,
        lastModified: timestamp,
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      
      return {
        success: true,
        id
      };
    } catch (error) {
      console.error('Error saving resume:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete a resume
  deleteResume: (id) => {
    try {
      if (!id) {
        throw new Error('Resume ID is required');
      }

      const resumes = resumeStorage.getAllResumes();
      delete resumes[id];
      localStorage.removeItem(STORAGE_KEY, JSON.stringify(resumes));

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting resume:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Clear all resumes
  clearResumes: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error clearing resumes:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get a single resume by ID
  getResumeById: (id) => {
    try {
      const resumes = resumeStorage.getAllResumes();
      return resumes[id] || null;
    } catch (error) {
      console.error('Error getting resume:', error);
      return null;
    }
  }
};