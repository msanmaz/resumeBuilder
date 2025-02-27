// jest.setup.js
import '@testing-library/jest-dom';

// Mock window.matchMedia which is not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock FontFace which is not implemented in JSDOM
global.FontFace = class FontFace {
  constructor() {
    return { load: () => Promise.resolve() };
  }
};

