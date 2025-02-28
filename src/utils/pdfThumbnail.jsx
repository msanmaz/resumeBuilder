// utils/pdfThumbnail.jsx - simplified version
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../domain/pdf/PDFDocument';
import PDFTemplate2 from '../domain/pdf/PDFDocument2';
import PDFTemplate3 from '../domain/pdf/PDFDocument3';
import { TEMPLATES } from '../presentation/context/resumeContext/resumeConstants';
import * as pdfjsLib from 'pdfjs-dist';
import ReactDOM from 'react-dom/client';
import React from 'react';



// Use a static import with Vite's ?url suffix for the worker
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const getTemplateComponent = (templateName) => {
  switch (templateName) {
    case TEMPLATES.MODERN: return PDFTemplate2;
    case TEMPLATES.ELEGANT: return PDFTemplate3;
    case TEMPLATES.CLASSIC: default: return PDFDocument;
  }
};

// Modified generateThumbnail function with enhanced logging
export const generateThumbnail = async (resumeData, templateName) => {
  const thumbnailId = Math.random().toString(36).substring(2, 8); // Generate a unique ID for this generation
  console.log(`[Thumbnail ${thumbnailId}] Starting generation for template: ${templateName}`);
  
  try {
    const Template = getTemplateComponent(templateName);
    console.log(`[Thumbnail ${thumbnailId}] Got template component: ${Template.displayName || Template.name || 'Unknown'}`);
    
    // Clone the resume data to break any React state references
    console.log(`[Thumbnail ${thumbnailId}] Cloning resume data...`);
    const clonedData = JSON.parse(JSON.stringify(resumeData));
    
    console.log(`[Thumbnail ${thumbnailId}] Creating isolated render container...`);
    // Create an isolated PDF blob using a detached render container
    const pdfBlob = await new Promise((resolve, reject) => {
      // Create a detached container for isolated rendering
      const containerEl = document.createElement('div');
      containerEl.style.position = 'absolute';
      containerEl.style.left = '-9999px';
      containerEl.style.top = '-9999px';
      containerEl.setAttribute('data-thumbnail-id', thumbnailId);
      document.body.appendChild(containerEl);
      
      console.log(`[Thumbnail ${thumbnailId}] Container created, scheduling isolated render...`);
      // Use setTimeout to move rendering out of the current cycle
      setTimeout(async () => {
        console.log(`[Thumbnail ${thumbnailId}] Starting isolated render...`);
        try {
          console.log(`[Thumbnail ${thumbnailId}] Creating React root...`);
          // Use ReactDOM.createRoot for React 18 compatibility
          const root = ReactDOM.createRoot(containerEl);
          
          console.log(`[Thumbnail ${thumbnailId}] Initial render of template...`);
          // Render the component once to initialize it
          root.render(<Template data={clonedData} />);
          
          console.log(`[Thumbnail ${thumbnailId}] Waiting for render to complete...`);
          // Wait a tick for the render to complete
          setTimeout(async () => {
            console.log(`[Thumbnail ${thumbnailId}] Generating PDF blob...`);
            try {
              // Check if any React state updates occurred during this process
              console.log(`[Thumbnail ${thumbnailId}] About to call pdf() function - check if React DevTools shows any re-renders after this`);
              performance.mark(`thumbnail-pdf-start-${thumbnailId}`);
              
              // Now generate the PDF with the component
              const blob = await pdf(<Template data={clonedData} />).toBlob();
              
              performance.mark(`thumbnail-pdf-end-${thumbnailId}`);
              performance.measure(
                `Thumbnail PDF Generation ${thumbnailId}`,
                `thumbnail-pdf-start-${thumbnailId}`,
                `thumbnail-pdf-end-${thumbnailId}`
              );
              console.log(`[Thumbnail ${thumbnailId}] PDF blob generated successfully`, 
                performance.getEntriesByName(`Thumbnail PDF Generation ${thumbnailId}`)[0].duration + 'ms');
              
              // Clean up - unmount and remove container
              console.log(`[Thumbnail ${thumbnailId}] Cleaning up React root...`);
              root.unmount();
              document.body.removeChild(containerEl);
              
              resolve(blob);
            } catch (error) {
              console.error(`[Thumbnail ${thumbnailId}] PDF generation error:`, error);
              console.log(`[Thumbnail ${thumbnailId}] Cleaning up after error...`);
              root.unmount();
              document.body.removeChild(containerEl);
              reject(error);
            }
          }, 100); // Increased timeout for more reliable rendering
        } catch (error) {
          console.error(`[Thumbnail ${thumbnailId}] Render initialization error:`, error);
          document.body.removeChild(containerEl);
          reject(error);
        }
      }, 50); // Increased timeout to better separate from main thread
    });
    
    console.log(`[Thumbnail ${thumbnailId}] PDF blob created, size: ${Math.round(pdfBlob.size / 1024)}KB`);
    
    // Continue with the rest of your thumbnail generation (pdf.js part)
    console.log(`[Thumbnail ${thumbnailId}] Creating object URL...`);
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    console.log(`[Thumbnail ${thumbnailId}] Loading PDF with pdf.js...`);
    performance.mark(`thumbnail-pdfjs-start-${thumbnailId}`);
    const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
    console.log(`[Thumbnail ${thumbnailId}] PDF loaded, pages: ${pdfDoc.numPages}`);
    
    console.log(`[Thumbnail ${thumbnailId}] Getting first page...`);
    const page = await pdfDoc.getPage(1);
    performance.mark(`thumbnail-pdfjs-end-${thumbnailId}`);
    performance.measure(
      `Thumbnail PDF.js Loading ${thumbnailId}`,
      `thumbnail-pdfjs-start-${thumbnailId}`,
      `thumbnail-pdfjs-end-${thumbnailId}`
    );
    console.log(`[Thumbnail ${thumbnailId}] Page loaded in`, 
      performance.getEntriesByName(`Thumbnail PDF.js Loading ${thumbnailId}`)[0].duration + 'ms');
    
    // Add canvas rendering code to generate the actual thumbnail
    console.log(`[Thumbnail ${thumbnailId}] Setting up canvas...`);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = 1600;
    canvas.height = (1600 * 11) / 8.5; // A4 aspect ratio
    
    console.log(`[Thumbnail ${thumbnailId}] Canvas dimensions: ${canvas.width}x${canvas.height}`);
    
    const renderContext = {
      canvasContext: context,
      viewport: page.getViewport({ scale: canvas.width / viewport.width })
    };
    
    console.log(`[Thumbnail ${thumbnailId}] Rendering PDF to canvas...`);
    performance.mark(`thumbnail-render-start-${thumbnailId}`);
    await page.render(renderContext).promise;
    performance.mark(`thumbnail-render-end-${thumbnailId}`);
    performance.measure(
      `Thumbnail Canvas Rendering ${thumbnailId}`,
      `thumbnail-render-start-${thumbnailId}`,
      `thumbnail-render-end-${thumbnailId}`
    );
    console.log(`[Thumbnail ${thumbnailId}] PDF rendered to canvas in`, 
      performance.getEntriesByName(`Thumbnail Canvas Rendering ${thumbnailId}`)[0].duration + 'ms');
    
    console.log(`[Thumbnail ${thumbnailId}] Converting canvas to data URL...`);
    performance.mark(`thumbnail-dataurl-start-${thumbnailId}`);
    const thumbnail = canvas.toDataURL('image/png');
    performance.mark(`thumbnail-dataurl-end-${thumbnailId}`);
    performance.measure(
      `Thumbnail Data URL Creation ${thumbnailId}`,
      `thumbnail-dataurl-start-${thumbnailId}`,
      `thumbnail-dataurl-end-${thumbnailId}`
    );
    console.log(`[Thumbnail ${thumbnailId}] Canvas converted to data URL in`, 
      performance.getEntriesByName(`Thumbnail Data URL Creation ${thumbnailId}`)[0].duration + 'ms');
    
    // Cleanup
    console.log(`[Thumbnail ${thumbnailId}] Cleaning up resources...`);
    URL.revokeObjectURL(pdfUrl);
    
    console.log(`[Thumbnail ${thumbnailId}] Thumbnail generation complete!`);
    
    // Check for any React DevTools reported re-renders
    console.log(`[Thumbnail ${thumbnailId}] If you're seeing unexpected React re-renders in DevTools, check what components re-rendered during this process`);
    
    return thumbnail;
  } catch (error) {
    console.error(`[Thumbnail ${thumbnailId}] Error generating thumbnail:`, error);
    return '/placeholder-thumbnail.png';
  }
};