// src/presentation/hooks/useContentEnhancement.js
import { useState } from 'react';
import { useEnhanceContentMutation } from '../../services/api/resumeApi';

export const useContentEnhancement = (section, contextBuilder) => {
  const [enhanceContent] = useEnhanceContentMutation();
  const [enhancedText, setEnhancedText] = useState('');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const enhance = async (content, contextData) => {
    try {
      // Reset errors
      setError(null);
      setFieldErrors({});
      
      if (!content?.trim()) {
        setError('Please enter some content before generating');
        return;
      }
      setIsLoading(true);

      const context = contextBuilder(contextData);
      
      const result = await enhanceContent({
        section,
        content,
        ...context
      }).unwrap();

      setEnhancedText(result.enhanced);
      setIsEnhanced(true);
    } catch (error) {
      console.error('Enhancement error:', error);
      
      console.log('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.data && error.data.code === 'VALIDATION_ERROR' && Array.isArray(error.data.validationErrors)) {
        // Handle validation errors from our backend
        const errorsMap = {};
        error.data.validationErrors.forEach(err => {
          errorsMap[err.field] = err.message;
        });
        setFieldErrors(errorsMap);
        setError('Please check the highlighted fields and try again.');
      } else if (error.data && error.data.message) {
        // Simple error with a message property
        setError(error.data.message);
      } else {
        // Fallback for unexpected error formats
        setError('Failed to enhance content. Please try again.');
      }
      
      setIsEnhanced(false);
    } finally {
      setIsLoading(false);
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
    setError
  };
};