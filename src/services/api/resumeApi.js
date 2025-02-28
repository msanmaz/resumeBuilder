// src/services/api/resumeApi.js
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
    enhanceContent: builder.mutation({
      query: (data) => {
        console.log('enhanceContent request data:', data);
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
          console.log('enhanceContent request successful');
        } catch (error) {
          console.error('enhanceContent request failed:', error);
          console.error('Error details:', error.error);
        }
      },
      transformResponse: (response) => {
        console.log('Raw response:', response);
        if (response.status === 'success') {
          const { data } = response;
          
          // Safely clean enhanced content if it exists
          if (data.enhanced) {
            return {
              ...data,
              enhanced: cleanEnhancedContent(data.enhanced.enhanced)
            };
          }
          return data;
        }
        throw new Error('Failed to enhance content');
      },
      transformErrorResponse: (response) => {
        console.error('Transform error response:', response);
        return response || 'An error occurred';
      }
    }),
  }),
  tagTypes: ['Resume'],
});

export const { useEnhanceContentMutation } = resumeApi;