// src/services/api/resumeApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper function to safely clean enhanced content
const cleanEnhancedContent = (content) => {
  if (typeof content === 'string' && content.trim().startsWith('Enhanced Content:')) {
    return content.replace(/^Enhanced Content:\s*/i, '').trim();
  }
  return content;
};

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/v1/',
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  endpoints: (builder) => ({
    enhanceContent: builder.mutation({
      query: (data) => ({
        url: 'llm/generate',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
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
        return response || 'An error occurred';
      }
    }),
  }),
  tagTypes: ['Resume'],
});

export const {
  useEnhanceContentMutation
} = resumeApi;