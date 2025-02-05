import '@testing-library/jest-dom';
import dotenv from 'dotenv';

dotenv.config();
process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5173';

beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg) => {
      if (!msg.includes("Missing `Description` or `aria-describedby`")) {
        return; // Apenas ignora o warning, sem chamar console.warn novamente
      }
    });
  
    jest.spyOn(console, 'error').mockImplementation((msg) => {
        const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
        if (!message.includes("Warning: An unhandled error")) {
          return;
        }
      });      
  });
  
  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });
  