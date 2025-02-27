import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../domain/pdf/PDFDocument';
import PDFTemplate2 from '../domain/pdf/PDFDocument2';
import PDFTemplate3 from '../domain/pdf/PDFDocument3';
import { TEMPLATES } from '../presentation/context/resumeContext/resumeConstants';
import * as pdfjsLib from 'pdfjs-dist';

// Use a static import with Vite’s ?url suffix for the worker (mjs version)
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const thumbnailCache = new Map();

const getTemplateComponent = (templateName) => {
  switch (templateName) {
    case TEMPLATES.MODERN: return PDFTemplate2;
    case TEMPLATES.ELEGANT: return PDFTemplate3;
    case TEMPLATES.CLASSIC: default: return PDFDocument;
  }
};

// Generate cache key for resume data
const getCacheKey = (resumeData, templateName) => {
  const relevantData = {
    personal: resumeData.resume?.personal,
    education: resumeData.resume?.education?.length,
    work: resumeData.resume?.work?.length,
    skills: resumeData.resume?.skills?.length,
    template: templateName,
    sections: resumeData.ui?.sectionOrder
  };
  return JSON.stringify(relevantData);
};

export const generateThumbnail = async (resumeData, templateName) => {
  try {
    // Check cache first
    const cacheKey = getCacheKey(resumeData, templateName);
    if (thumbnailCache.has(cacheKey)) {
      console.log('Using cached thumbnail');
      return thumbnailCache.get(cacheKey);
    }

    console.log('Generating new thumbnail');
    const Template = getTemplateComponent(templateName);

    // Create PDF blob using @react-pdf/renderer
    const pdfBlob = await pdf(<Template data={resumeData} />).toBlob();

    // Use pdf.js to load the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdfDoc.getPage(1); // Get first page

    // Render page to canvas with higher resolution
    const viewport = page.getViewport({ scale: 2.0 }); // Increased scale for better quality
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size to higher resolution, maintaining A4 ratio (8.5in x 11in)
    canvas.width = 1600; // Increased width for higher resolution
    canvas.height = (1600 * 11) / 8.5; // Maintain A4 aspect ratio (≈2070px height)

    const renderContext = {
      canvasContext: context,
      viewport: page.getViewport({ scale: canvas.width / viewport.width })
    };
    await page.render(renderContext).promise;

    // Convert canvas to data URL with PNG (lossless) for better quality
    const thumbnail = canvas.toDataURL('image/png'); // Changed to PNG for sharper text

    // Cache the thumbnail
    thumbnailCache.set(cacheKey, thumbnail);

    // Cleanup
    URL.revokeObjectURL(pdfUrl);

    return thumbnail;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    // Return placeholder image on error
    return '/placeholder-thumbnail.png';
  }
};

export const clearThumbnailCache = () => {
  thumbnailCache.clear();
};