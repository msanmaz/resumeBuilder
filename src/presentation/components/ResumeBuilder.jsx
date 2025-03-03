import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useResume } from '../context/resumeContext/useResume';
import isEqual from 'lodash/isEqual';
import LeftSidebar from './LeftSideBar.jsx';
import FormSection from './formSection/index';
import PDFDocument from '../../domain/pdf/PDFDocument';
import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate2 from '../../domain/pdf/PDFDocument2';
import PDFTemplate3 from '../../domain/pdf/PDFDocument3';
import { ACTIONS, TEMPLATES } from '../context/resumeContext/resumeConstants';
import { generateThumbnail } from '../../utils/pdfThumbnail';
import { resumeStorage } from '../../services/storage/resumeStorage';
import { v4 as uuidv4 } from 'uuid';
import { PageLoader } from './common/loading.jsx';

// Debug utilities
const debugState = (label, state) => {
  console.group(`[Debug] ${label}`);
  console.log('Resume:', {
    personal: !!state.resume.personal,
    education: state.resume.education?.length,
    work: state.resume.work?.length,
    skills: state.resume.skills?.length
  });
  console.log('UI:', {
    template: state.ui.selectedTemplate,
    sectionOrder: state.ui.sectionOrder?.length,
    currentSection: state.ui.currentSection
  });
  console.groupEnd();
};

const getSelectedTemplate = (templateName) => {
  switch (templateName) {
    case TEMPLATES.MODERN: return PDFTemplate2;
    case TEMPLATES.ELEGANT: return PDFTemplate3;
    case TEMPLATES.CLASSIC: default: return PDFDocument;
  }
};

// Optimize memo comparison for PDF Preview
const MemoizedPDFPreview = React.memo(({ Template, data }) => {
  console.log('[Debug] PDF Preview rendering');
  return (
    <PDFViewer width="100%" height="100%" className="border-0">
      <Template data={data} />
    </PDFViewer>
  );
}, (prev, next) => {
  // First check references
  if (prev.Template === next.Template && prev.data === next.data) {
    console.log('[Debug] PDF Preview memo: references match');
    return true;
  }

  // Then do deep comparison if references changed
  const result = prev.Template === next.Template && isEqual(prev.data, next.data);
  console.log('[Debug] PDF Preview memo: deep comparison result:', result);
  return result;
});

MemoizedPDFPreview.displayName = 'MemoizedPDFPreview';

const ResumeBuilder = () => {
  const { state, dispatch } = useResume();
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const lastSavedContentRef = useRef(null);
  

  // Initial load effect in ResumeBuilder.jsx
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const loadInitialData = async () => {
      console.group('[Debug] Initial Load');
      console.time('Initial load duration');

      try {
        const savedResumes = resumeStorage.getAllResumes();
        console.log('Found saved resumes:', {
          count: Object.keys(savedResumes).length,
          ids: Object.keys(savedResumes)
        });

        if (savedResumes && Object.keys(savedResumes).length > 0) {
          const sortedResumes = Object.values(savedResumes).sort((a, b) =>
            new Date(b.lastModified) - new Date(a.lastModified)
          );
          const mostRecentResume = sortedResumes[0];

          console.log('Most recent resume:', {
            id: mostRecentResume.id,
            hasData: !!mostRecentResume.data,
            dataKeys: mostRecentResume.data ? Object.keys(mostRecentResume.data) : [],
            template: mostRecentResume.template,
            lastModified: mostRecentResume.lastModified
          });

          // Only set ID and dispatch if we have valid data
          if (mostRecentResume.data &&
            typeof mostRecentResume.data === 'object' &&
            Object.keys(mostRecentResume.data).length > 0) {

            // Extract and validate data
            const cleanResumeData = {
              personal: mostRecentResume.data.personal || {},
              summary: mostRecentResume.data.summary || '',
              education: mostRecentResume.data.education || [],
              work: mostRecentResume.data.work || [],
              skills: mostRecentResume.data.skills || []
            };

            console.log('Cleaned resume data:', {
              sections: Object.keys(cleanResumeData),
              hasPersonal: !!cleanResumeData.personal,
              education: cleanResumeData.education.length,
              work: cleanResumeData.work.length,
              skills: cleanResumeData.skills.length
            });

            // Explicitly set the resumeId to the existing ID
            setResumeId(mostRecentResume.id);
            console.log('[Debug] Setting resumeId to existing:', mostRecentResume.id);

            // Update each section individually
            dispatch({
              type: 'BATCH_UPDATE',
              updates: [
                ...Object.entries(cleanResumeData).map(([section, data]) => ({
                  type: ACTIONS.UPDATE_FORM,
                  section,
                  payload: data
                })),
                { type: ACTIONS.SET_TEMPLATE, payload: mostRecentResume.template || TEMPLATES.CLASSIC }
              ]
            });
          } else {
            console.warn('Most recent resume had invalid data structure, creating new');
            const newId = uuidv4();
            console.log('[Debug] Generated new resumeId:', newId);
            setResumeId(newId);
          }
        } else {
          console.log('No saved resumes found, creating new');
          const newId = uuidv4();
          console.log('[Debug] Generated new resumeId:', newId);
          setResumeId(newId);
        }
      } catch (error) {
        console.error('Load error:', error);
        const newId = uuidv4();
        console.log('[Debug] Generated new resumeId on error:', newId);
        setResumeId(newId);
      } finally {
        setIsLoading(false);
        console.timeEnd('Initial load duration');
        console.groupEnd();
      }
    };

    loadInitialData();
  }, [dispatch]);


  // Simplified PDF state that only changes when content actually changes
  const pdfState = useMemo(() => {
    const newState = {
      resume: {
        personal: state.resume.personal,
        summary: state.resume.summary,
        education: state.resume.education,
        work: state.resume.work,
        skills: state.resume.skills
      },
      ui: {
        sectionOrder: state.ui.sectionOrder,
        selectedTemplate: state.ui.selectedTemplate
      }
    };

    // Only update if content actually changed
    if (lastSavedContentRef.current &&
      isEqual(lastSavedContentRef.current, newState)) {
      return lastSavedContentRef.current;
    }

    return newState;
  }, [
    state.resume.personal,
    state.resume.summary,
    state.resume.education,
    state.resume.work,
    state.resume.skills,
    state.ui.sectionOrder,
    state.ui.selectedTemplate
  ]);


  useEffect(() => {
    if (!resumeId) return;  // Only proceed if we have a valid resumeId

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('[Debug] Saving resume with ID:', resumeId); // Add logging for debugging
        const thumbnail = await generateThumbnail(pdfState, state.ui.selectedTemplate);
        await resumeStorage.saveResume(
          pdfState.resume,
          state.ui.selectedTemplate,
          thumbnail,
          resumeId  // Use the consistent resumeId
        );

        // Update last saved content after successful save
        lastSavedContentRef.current = pdfState;
      } catch (error) {
        console.error('Save operation failed:', error);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.resume, state.ui.selectedTemplate, resumeId, pdfState]);

  // Memoized PDF preview with optimized comparison
  const PDFPreview = useMemo(() => (
    <MemoizedPDFPreview
      Template={getSelectedTemplate(state.ui.selectedTemplate)}
      data={pdfState}
    />
  ), [pdfState, state.ui.selectedTemplate]);

  if (isLoading) return <PageLoader text="Loading your resume..." />;


  console.log('[Debug] ResumeBuilder rendering');
  debugState('Current State', state);

  return (
    <div className="h-screen overflow-hidden text-white">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2 border-r border-neutral-700">
          <LeftSidebar />
        </div>
        <div className="col-span-5 border-r border-gray-700">
          <div className="h-full">
            <FormSection />
          </div>
        </div>
        <div className="col-span-5 bg-gray-900">
          <div className="h-full p-6">
            <div className="h-full bg-white rounded-lg overflow-hidden shadow-xl">
              {PDFPreview}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;