import { ACTIONS, defaultNavigationItems, TEMPLATES } from './resumeConstants';
import isEqual from 'lodash/isEqual';

export function resumeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_FORM: {
      // Don't create new state unless absolutely necessary
      if (isEqual(state.resume[action.section], action.payload)) {
        return state;
      }
      // Check if resume actually changed before creating new reference
      const newResume = {
        ...state.resume,
        [action.section]: action.payload
      };
      return isEqual(state.resume, newResume) ? state : {
        ...state,
        resume: newResume
      };
    }

    case ACTIONS.SET_SECTION: {
      if (state.ui.currentSection === action.payload) return state;
      return {
        ...state,
        ui: { ...state.ui, currentSection: action.payload }
      };
    }
    case ACTIONS.SET_TEMPLATE: {
      const newTemplate = Object.values(TEMPLATES).includes(action.payload)
        ? action.payload
        : TEMPLATES.CLASSIC;
      if (state.ui.selectedTemplate === newTemplate) return state;
      return {
        ...state,
        ui: { ...state.ui, selectedTemplate: newTemplate }
      };
    }
    case ACTIONS.SET_PDF_STATUS: {
      if (state.ui.isGeneratingPDF === action.payload) return state;
      return {
        ...state,
        ui: { ...state.ui, isGeneratingPDF: action.payload }
      };
    }
    case ACTIONS.SET_VALIDATION: {
      if (isEqual(state.validation, action.payload)) return state;
      return {
        ...state,
        validation: { ...state.validation, ...action.payload }
      };
    }
    case ACTIONS.SET_CURRENT_PAGE: {
      if (state.ui.currentPage === action.payload) return state;
      return {
        ...state,
        ui: { ...state.ui, currentPage: action.payload }
      };
    }
    case ACTIONS.SET_TOTAL_PAGES: {
      if (state.ui.totalPages === action.payload) return state;
      return {
        ...state,
        ui: { ...state.ui, totalPages: action.payload }
      };
    }
    case ACTIONS.SET_SECTION_ORDER: {
      const newOrder = Array.isArray(action.payload) ? action.payload : defaultNavigationItems;
      if (isEqual(state.ui.sectionOrder, newOrder)) return state;
      return {
        ...state,
        ui: { ...state.ui, sectionOrder: newOrder }
      };
    }
    case 'BATCH_UPDATE': {
      return action.updates.reduce((currentState, update) => {
        // Skip updates that don't change anything
        if (update.type === ACTIONS.UPDATE_FORM &&
          isEqual(currentState.resume[update.section], update.payload)) {
          return currentState;
        }
        return resumeReducer(currentState, update);
      }, state);
    }
    default:
      return state;
  }
}