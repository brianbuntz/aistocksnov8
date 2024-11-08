import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import AIStocksDashboard from './components/AIStocksDashboard.jsx';

// Mock window.fs for GitHub Pages
window.fs = {
    readFile: async (filename) => {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return '[]'; // Return empty array as fallback
        }
    }
};

const root = createRoot(document.getElementById('root'));
root.render(createElement(AIStocksDashboard));
