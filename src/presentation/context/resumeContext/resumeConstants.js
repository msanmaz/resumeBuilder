export const TEMPLATES = {
  CLASSIC: 'PDFDocument',
  MODERN: 'PDFTemplate2',
  ELEGANT: 'PDFTemplate3'
};

export const defaultNavigationItems = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'summary', label: 'Summary', icon: 'FileText' },
  { id: 'education', label: 'Education', icon: 'BookOpen' },
  { id: 'work', label: 'Work Experience', icon: 'Briefcase' },
  { id: 'skills', label: 'Skills', icon: 'Code' }
];

export const initialState = {
  resume: {
    personal: {},
    summary: '',
    education: [{
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: []
    }],
    work: [{
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: ['']
    }],
    skills: []
  },
  ui: {
    currentSection: 'personal',
    isGeneratingPDF: false,
    selectedTemplate: TEMPLATES.CLASSIC,
    currentPage: 1,
    totalPages: 1,
    sectionOrder: defaultNavigationItems
  },
  validation: {}
};

export const ACTIONS = {
  UPDATE_FORM: 'UPDATE_FORM',
  SET_SECTION: 'SET_SECTION',
  SET_TEMPLATE: 'SET_TEMPLATE',
  SET_PDF_STATUS: 'SET_PDF_STATUS',
  SET_VALIDATION: 'SET_VALIDATION',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_TOTAL_PAGES: 'SET_TOTAL_PAGES',
  SET_SECTION_ORDER: 'SET_SECTION_ORDER',
  RESET_STATE: 'RESET_STATE',
};