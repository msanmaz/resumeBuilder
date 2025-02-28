// src/utils/accurateThumbnailGenerator.js
import { TEMPLATES } from '../presentation/context/resumeContext/resumeConstants';

// New function that better matches the PDF templates' styling
export const generateAccurateThumbnail = (resumeData, templateName) => {
  return new Promise(resolve => {
    // Run outside of React's render cycle
    setTimeout(() => {
      try {
        console.log('Generating accurate thumbnail for template:', templateName);
        
        // Extract resume data
        const { resume } = resumeData;
        const name = resume?.personal?.fullName || '';
        const title = resume?.personal?.title || '';
        
        // Create canvas with A4 proportions
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1131; // A4 proportions
        
        const ctx = canvas.getContext('2d');
        
        // Fill background white (like PDF)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Different styling based on template
        switch(templateName) {
          case TEMPLATES.MODERN:
            // Modern template with header background
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, 150);
            
            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(name.toUpperCase(), 50, 80, canvas.width - 100);
            
            // Title
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText(title, 50, 120, canvas.width - 100);
            
            // Experience
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Experience', 50, 200);
            
            // Line under Experience
            ctx.fillStyle = '#3498db';
            ctx.fillRect(50, 210, 700, 2);
            
            // Education
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('Education', 50, 400);
            
            // Line under Education
            ctx.fillStyle = '#3498db';
            ctx.fillRect(50, 410, 700, 2);
            break;
            
          case TEMPLATES.ELEGANT:
            // Elegant template with darker styling
            ctx.fillStyle = '#ffffff';
            
            // Name
            ctx.fillStyle = '#212121';
            ctx.font = 'bold 36px Times New Roman';
            ctx.textAlign = 'center';
            ctx.fillText(name.toUpperCase(), canvas.width/2, 100, canvas.width - 100);
            
            // Title
            ctx.fillStyle = '#424242';
            ctx.font = 'italic 20px Times New Roman';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvas.width/2, 140, canvas.width - 100);
            
            // Divider
            ctx.fillStyle = '#9c27b0';
            ctx.fillRect(canvas.width/2 - 50, 160, 100, 1);
            
            // Section headers in elegant styling
            ctx.fillStyle = '#212121';
            ctx.font = 'bold 22px Times New Roman';
            ctx.textAlign = 'left';
            ctx.fillText('Experience', 100, 220);
            ctx.fillText('Education', 100, 400);
            break;
            
          case TEMPLATES.CLASSIC:
          default:
            // Classic template (default)
            // Name
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 28px Garamond, Times New Roman';
            ctx.textAlign = 'center';
            ctx.fillText(name.toUpperCase(), canvas.width/2, canvas.height/3);
            
            // If no name, use placeholder text to match the preview
            if (!name) {
              ctx.fillText("ERTERRWERQQWWE", canvas.width/2, canvas.height/3);
            }
            
            // Dots above the name (as in your preview)
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.arc(canvas.width/2 - 10, canvas.height/3 - 50, 3, 0, Math.PI * 2);
            ctx.arc(canvas.width/2 + 10, canvas.height/3 - 50, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Title (if any)
            if (title) {
              ctx.fillStyle = '#666666';
              ctx.font = 'italic 18px Garamond, Times New Roman';
              ctx.fillText(title, canvas.width/2, canvas.height/3 + 40);
            }
            break;
        }
        
        // Generate data URL
        const thumbnail = canvas.toDataURL('image/png');
        console.log('Accurate thumbnail generated successfully');
        resolve(thumbnail);
      } catch (error) {
        console.error('Error creating thumbnail:', error);
        resolve('/placeholder-thumbnail.png');
      }
    }, 0);
  });
};