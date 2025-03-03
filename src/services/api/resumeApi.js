import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper function to safely clean enhanced content
const cleanEnhancedContent = (content) => {
  if (typeof content === 'string' && content.trim().startsWith('Enhanced Content:')) {
    return content.replace(/^Enhanced Content:\s*/i, '').trim();
  }
  return content;
};

// Debug API key loading
const API_KEY = import.meta.env.VITE_API_KEY || 'your-default-api-key-for-development';
console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 4)}...` : 'missing');
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/');

// Create a custom fetchBaseQuery with logging
const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  },
  prepareHeaders: (headers, { getState }) => {
    // Log all headers to debug
    console.log('Request headers:', Object.fromEntries(headers.entries()));
    return headers;
  }
});

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: customFetchBaseQuery,
  endpoints: (builder) => ({
    // Submit a job to enhance content
    submitEnhancementJob: builder.mutation({
      query: (data) => {
        console.log('submitEnhancementJob request data:', data);
        return {
          url: 'llm/generate',
          method: 'POST',
          body: data,
        };
      },
      // Add more detailed error logging
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('submitEnhancementJob request successful');
        } catch (error) {
          console.error('submitEnhancementJob request failed:', error);
          console.error('Error details:', error.error);
        }
      },
      transformResponse: (response) => {
        console.log('Raw job submission response:', response);
        if (response.status === 'success') {
          return {
            jobId: response.data.jobId,
            status: response.data.status,
            checkStatusUrl: response.data.checkStatusUrl
          };
        }
        throw new Error('Failed to submit enhancement job');
      },
      transformErrorResponse: (response) => {
        console.error('Transform error response:', response);
        return response || 'An error occurred';
      }
    }),
    
    // Check job status
    checkJobStatus: builder.query({
      query: (jobId) => {
        console.log('Checking job status for:', jobId);
        return {
          url: `llm/status/${jobId}`,
          method: 'GET',
        };
      },
      transformResponse: (response) => {
        console.log('Job status response:', response);
        if (response.status === 'success') {
          return {
            jobId: response.data.jobId,
            status: response.data.status,
            result: cleanEnhancedContent(response.data.result),
            error: response.data.error
          };
        }
        throw new Error('Failed to check job status');
      },
      transformErrorResponse: (response) => {
        console.error('Job status check error:', response);
        return response || 'An error occurred while checking job status';
      }
    }),
  }),
  tagTypes: ['Resume'],
});

export const { 
  useSubmitEnhancementJobMutation,
  useCheckJobStatusQuery,
  useLazyCheckJobStatusQuery
} = resumeApi;