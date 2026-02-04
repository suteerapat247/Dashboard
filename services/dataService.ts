import { PaperRecord } from '../types';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXy6umbvwYr67X3EGHGzYuTR40Rk40K6pvLnbb9ELWbKnhjwm2yeBus3kcLesP5NGZpQYwr9xCHttp/pub?gid=0&single=true&output=csv';

// Helper to clean header keys to match our interface
const normalizeHeader = (header: string): string => {
  // Replace spaces and special chars with underscores to ensure safe keys
  return header.trim().toLowerCase().replace(/[\s/]+/g, '_').replace(/[^\w_]/g, '');
};

export const fetchPaperData = async (): Promise<PaperRecord[]> => {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const text = await response.text();
    return parseCSV(text);
  } catch (error) {
    console.error("Error fetching paper data:", error);
    throw error;
  }
};

const parseCSV = (csvText: string): PaperRecord[] => {
  // Handle BOM (Byte Order Mark) at the beginning of the file if present
  const content = csvText.trim().replace(/^\uFEFF/, '');
  
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(normalizeHeader);
  
  const records: PaperRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting
    const currentLine = lines[i].split(',');
    
    // We removed strict length check (currentLine.length !== headers.length)
    // to allow rows with missing trailing columns or slight formatting issues.

    const record: any = {};
    
    headers.forEach((header, index) => {
      let value = currentLine[index] ? currentLine[index].trim() : '';

      // Remove wrapping quotes if present (common in CSV)
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      
      // Map to specific type based on column name
      if (['pages_per_sheet', 'total_pages', 'copies', 'sheet_used'].includes(header)) {
        // Handle number parsing (remove commas like "1,000")
        const num = Number(value.replace(/,/g, ''));
        record[header] = isNaN(num) ? 0 : num;
      } else {
        record[header] = value;
      }
    });

    // Validate essential fields: as long as we have a date or department, we try to keep it.
    if (record.date || record.department) {
      // Ensure numeric fields have defaults
      record.sheet_used = record.sheet_used ?? 0;
      records.push(record as PaperRecord);
    }
  }

  return records;
};