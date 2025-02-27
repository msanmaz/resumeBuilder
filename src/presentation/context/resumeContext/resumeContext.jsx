import { createContext, useReducer } from 'react';
import { initialState } from './resumeConstants';
import { resumeReducer } from './resumeReducer';
import { actions } from './resumeActions';
import testFormData from '../../hooks/testData';

export const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(
    resumeReducer, 
    { ...initialState}
  );

  const value = {
    state,
    dispatch,
    actions
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}