import { ACTIONS, TEMPLATES } from './resumeConstants';

export const actions = {
  updateForm: (section, payload) => ({
    type: ACTIONS.UPDATE_FORM,
    section,
    payload
  }),
  setSection: (section) => ({
    type: ACTIONS.SET_SECTION,
    payload: section
  }),
  setTemplate: (template) => {
    // Validate template
    const validTemplate = Object.values(TEMPLATES).includes(template) 
      ? template 
      : TEMPLATES.CLASSIC;
      
    return {
      type: ACTIONS.SET_TEMPLATE,
      payload: validTemplate
    };
  },
  setPdfStatus: (status) => ({
    type: ACTIONS.SET_PDF_STATUS,
    payload: status
  }),
  setValidation: (validationData) => ({
    type: ACTIONS.SET_VALIDATION,
    payload: validationData
  }),
  setCurrentPage: (page) => ({
    type: ACTIONS.SET_CURRENT_PAGE,
    payload: page
  }),
  setTotalPages: (total) => ({
    type: ACTIONS.SET_TOTAL_PAGES,
    payload: total
  }),
  setSectionOrder: (order) => ({
    type: ACTIONS.SET_SECTION_ORDER,
    payload: order
  })
};