
export const loadFonts = async () => {
    const fontPath = '/EB_Garamond/static/';
    
    const fonts = [
      {
        name: 'EBGaramond',
        source: `${fontPath}EBGaramond-Regular.ttf`,
        descriptors: { weight: '400', style: 'normal' }
      },
      {
        name: 'EBGaramond',
        source: `${fontPath}EBGaramond-Bold.ttf`,
        descriptors: { weight: '700', style: 'normal' }
      },
      {
        name: 'EBGaramond',
        source: `${fontPath}EBGaramond-Italic.ttf`,
        descriptors: { weight: '400', style: 'italic' }
      }
    ];
  
    try {
      const loadedFonts = await Promise.all(
        fonts.map(async ({ name, source, descriptors }) => {
          const font = new FontFace(name, `url(${source})`, descriptors);
          const loadedFont = await font.load();
          document.fonts.add(loadedFont);
          return loadedFont;
        })
      );
      
      console.log('All fonts loaded successfully');
      return loadedFonts;
    } catch (error) {
      console.error('Error loading fonts:', error);
      throw error;
    }
  };