// src/presentation/context/resumeContext/__tests__/resumeReducer.test.js
import { resumeReducer } from '../resumeReducer';
import { ACTIONS, TEMPLATES, defaultNavigationItems } from '../resumeConstants';

// Mock lodash/isEqual directly without trying to access the original
jest.mock('lodash/isEqual', () => jest.fn((a, b) => JSON.stringify(a) === JSON.stringify(b)));

// Import the mocked module
import isEqual from 'lodash/isEqual';

describe('resumeReducer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UPDATE_FORM action', () => {
    it('should update form data when it changes', () => {
      const initialState = {
        resume: {
          personal: {}
        }
      };
      
      const action = {
        type: ACTIONS.UPDATE_FORM,
        section: 'personal',
        payload: { fullName: 'John Doe', email: 'john@example.com' }
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState).not.toBe(initialState); // Should create new reference
      expect(newState.resume.personal).toEqual({ fullName: 'John Doe', email: 'john@example.com' });
    });

    it('should not create new state if data has not changed', () => {
      const personalData = { fullName: 'John Doe', email: 'john@example.com' };
      const initialState = {
        resume: {
          personal: personalData
        }
      };
      
      const action = {
        type: ACTIONS.UPDATE_FORM,
        section: 'personal',
        payload: personalData
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(isEqual).toHaveBeenCalled();
      expect(newState).toBe(initialState); // Should return same reference
    });

    it('should handle array updates correctly', () => {
      const initialState = {
        resume: {
          work: [{ company: 'Old Company' }]
        }
      };
      
      const action = {
        type: ACTIONS.UPDATE_FORM,
        section: 'work',
        payload: [{ company: 'New Company' }]
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.resume.work).toEqual([{ company: 'New Company' }]);
      expect(newState.resume.work).not.toBe(initialState.resume.work); // New array reference
    });
  });

  describe('SET_SECTION action', () => {
    it('should update current section', () => {
      const initialState = {
        ui: { currentSection: 'personal' }
      };
      
      const action = {
        type: ACTIONS.SET_SECTION,
        payload: 'education'
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.currentSection).toBe('education');
    });

    it('should not create new state if section has not changed', () => {
      const initialState = {
        ui: { currentSection: 'personal' }
      };
      
      const action = {
        type: ACTIONS.SET_SECTION,
        payload: 'personal'
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState).toBe(initialState); // Same reference
    });
  });

  describe('SET_TEMPLATE action', () => {
    it('should update template selection', () => {
      const initialState = {
        ui: { selectedTemplate: TEMPLATES.CLASSIC }
      };
      
      const action = {
        type: ACTIONS.SET_TEMPLATE,
        payload: TEMPLATES.MODERN
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.selectedTemplate).toBe(TEMPLATES.MODERN);
    });

    it('should default to CLASSIC template if invalid template provided', () => {
      const initialState = {
        ui: { selectedTemplate: TEMPLATES.MODERN }
      };
      
      const action = {
        type: ACTIONS.SET_TEMPLATE,
        payload: 'INVALID_TEMPLATE'
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.selectedTemplate).toBe(TEMPLATES.CLASSIC);
    });
  });

  describe('SET_PDF_STATUS action', () => {
    it('should update PDF generation status', () => {
      const initialState = {
        ui: { isGeneratingPDF: false }
      };
      
      const action = {
        type: ACTIONS.SET_PDF_STATUS,
        payload: true
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.isGeneratingPDF).toBe(true);
    });
  });

  describe('SET_SECTION_ORDER action', () => {
    it('should update section order when valid array provided', () => {
      const initialState = {
        ui: { sectionOrder: defaultNavigationItems }
      };
      
      const newOrder = [
        defaultNavigationItems[1],
        defaultNavigationItems[0],
        ...defaultNavigationItems.slice(2)
      ];
      
      const action = {
        type: ACTIONS.SET_SECTION_ORDER,
        payload: newOrder
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.sectionOrder).toEqual(newOrder);
      expect(newState.ui.sectionOrder).not.toBe(initialState.ui.sectionOrder);
    });

    it('should use default navigation items if invalid payload provided', () => {
      const initialState = {
        ui: { sectionOrder: [] }
      };
      
      const action = {
        type: ACTIONS.SET_SECTION_ORDER,
        payload: 'invalid'
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.ui.sectionOrder).toEqual(defaultNavigationItems);
    });
  });

  describe('BATCH_UPDATE action', () => {
    it('should process multiple updates in sequence', () => {
      const initialState = {
        resume: {
          personal: {},
          education: []
        },
        ui: {
          currentSection: 'personal'
        }
      };
      
      const action = {
        type: 'BATCH_UPDATE',
        updates: [
          {
            type: ACTIONS.UPDATE_FORM,
            section: 'personal',
            payload: { fullName: 'John Doe' }
          },
          {
            type: ACTIONS.SET_SECTION,
            payload: 'education'
          }
        ]
      };
      
      const newState = resumeReducer(initialState, action);
      
      expect(newState.resume.personal).toEqual({ fullName: 'John Doe' });
      expect(newState.ui.currentSection).toBe('education');
    });

    it('should skip updates that would not change state', () => {
      const personalData = { fullName: 'John Doe' };
      const initialState = {
        resume: {
          personal: personalData
        },
        ui: {
          currentSection: 'education'
        }
      };
      
      const action = {
        type: 'BATCH_UPDATE',
        updates: [
          {
            type: ACTIONS.UPDATE_FORM,
            section: 'personal',
            payload: personalData // Same data
          },
          {
            type: ACTIONS.SET_SECTION,
            payload: 'work'
          }
        ]
      };
      
      const newState = resumeReducer(initialState, action);
      
      // Personal data should be unchanged and maintain same reference
      expect(newState.resume.personal).toBe(initialState.resume.personal);
      // But section should be updated
      expect(newState.ui.currentSection).toBe('work');
    });
  });
});