import { useState, useEffect, useRef } from 'react';
import {
  useSubmitEnhancementJobMutation,
  useLazyCheckJobStatusQuery
} from '../../services/api/resumeApi';

// Poll interval in milliseconds
const POLL_INTERVAL = 2000;
const MAX_POLL_TIME = 30000; // 30 seconds max polling time

export const useContentEnhancement = (section, contextBuilder) => {
  const [submitJob] = useSubmitEnhancementJobMutation();
  const [checkJobStatus, { data: jobStatusData }] = useLazyCheckJobStatusQuery();

  const [enhancedText, setEnhancedText] = useState('');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Store the current job ID being processed and track it for polling
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Use a ref to track the active polling job ID to avoid race conditions
  const activePollingJobIdRef = useRef(null);

  // Polling setup
  const pollingIntervalRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

  // Start polling for a specific job ID
  const startPolling = (jobId) => {
    if (!jobId) return;
    
    console.log(`Starting polling for job: ${jobId}`);
    
    // Store the job ID we're actively polling
    activePollingJobIdRef.current = jobId;
    
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    
    // Start new polling
    pollingIntervalRef.current = setInterval(() => {
      console.log(`Polling for job status: ${activePollingJobIdRef.current}`);
      checkJobStatus(activePollingJobIdRef.current);
    }, POLL_INTERVAL);
    
    // Set a timeout to stop polling after MAX_POLL_TIME
    pollingTimeoutRef.current = setTimeout(() => {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      
      // Only update state if this is still the active polling job
      if (activePollingJobIdRef.current === jobId) {
        setIsLoading(false);
        setError("Request timed out. Please try again.");
        activePollingJobIdRef.current = null;
      }
    }, MAX_POLL_TIME);
    
    // Initial check
    checkJobStatus(jobId);
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  // Process job status updates
  useEffect(() => {
    if (!jobStatusData) return;
    
    // Get the job ID from the response
    const responseJobId = jobStatusData.jobId;
    console.log(`Received job status update for: ${responseJobId}, active polling job: ${activePollingJobIdRef.current}`);
    
    // Only process this update if it's for the job we're currently polling
    if (responseJobId !== activePollingJobIdRef.current) {
      console.log(`Ignoring status update for outdated job: ${responseJobId}`);
      return;
    }

    if (jobStatusData.status === 'completed' && jobStatusData.result) {
      // Job completed successfully
      console.log(`Job ${responseJobId} completed successfully`);
      setEnhancedText(jobStatusData.result.enhanced || jobStatusData.result);
      setIsEnhanced(true);
      setIsLoading(false);
      setCurrentJobId(null);
      activePollingJobIdRef.current = null;

      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    } else if (jobStatusData.status === 'failed') {
      // Job failed
      console.log(`Job ${responseJobId} failed: ${jobStatusData.error}`);
      setError(jobStatusData.error || 'Enhancement failed');
      setIsLoading(false);
      setCurrentJobId(null);
      activePollingJobIdRef.current = null;

      // Stop polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
    }
    // For 'pending' or 'processing' status, keep polling
  }, [jobStatusData]);

  const enhance = async (content, contextData) => {
    try {
      // Reset states
      setError(null);
      setFieldErrors({});
      setIsEnhanced(false);

      if (!content?.trim()) {
        setError('Please enter some content before generating');
        return;
      }

      setIsLoading(true);
      const context = contextBuilder(contextData);

      console.log(`Submitting enhancement job for content: ${content.substring(0, 50)}...`);
      
      // Submit the job
      const result = await submitJob({
        section,
        content,
        ...context
      }).unwrap();

      // Store the job ID and start polling
      if (result?.jobId) {
        console.log(`New job submitted with ID: ${result.jobId}`);
        setCurrentJobId(result.jobId);
        startPolling(result.jobId);
      } else {
        throw new Error('No job ID returned from API');
      }
    } catch (error) {
      console.error('Enhancement job submission error:', error);

      // Handle various error types
      if (error.data && error.data.code === 'VALIDATION_ERROR' && Array.isArray(error.data.validationErrors)) {
        const errorsMap = {};
        error.data.validationErrors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
        setError('Please check the highlighted fields and try again.');
      } else if (error.data && error.data.message) {
        setError(error.data.message);
      } else {
        setError('Failed to submit enhancement job. Please try again.');
      }

      setIsLoading(false);
      setIsEnhanced(false);
      setCurrentJobId(null);
      activePollingJobIdRef.current = null;
    }
  };

  return {
    enhancedText,
    isEnhanced,
    isLoading,
    error,
    fieldErrors,
    enhance,
    setEnhancedText,
    setIsEnhanced,
    setError,
    // Include job status info for UI
    jobStatus: currentJobId ? 'processing' : null,
    currentJobId
  };
};