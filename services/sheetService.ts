import { GOOGLE_SHEET_CSV_URL } from '../constants';
import { Doctor } from '../types';

/**
 * Simple CSV Parser that handles basic quoted fields.
 */
const parseCSV = (text: string): Doctor[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result: Doctor[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const obj: Doctor = {};
    let currentLine: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    // Robust split by comma ignoring commas inside quotes
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentLine.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    currentLine.push(currentValue.trim().replace(/^"|"$/g, '')); // Push last value

    // Map headers to values
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] || '';
    });

    result.push(obj);
  }

  return result;
};

export const fetchDoctorData = async (): Promise<string> => {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const csvText = await response.text();
    const data = parseCSV(csvText);
    
    // Convert back to a formatted string for the LLM to read easily
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw new Error("Could not retrieve the latest doctor data. Please ensure the Google Sheet is public (Anyone with the link can view).");
  }
};