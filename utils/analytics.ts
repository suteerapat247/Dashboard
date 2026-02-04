import { PaperRecord, ChartDataPoint, TrendPoint, DashboardStats } from '../types';

// Helper to parse various date formats
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  // Try standard constructor first (YYYY-MM-DD, MM/DD/YYYY)
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Try parsing DD/MM/YYYY or DD-MM-YYYY (Common in many regions)
  const parts = dateStr.split(/[/-]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
    const year = parseInt(parts[2], 10);
    
    // Validate parts
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const d2 = new Date(year, month, day);
      if (!isNaN(d2.getTime())) return d2;
    }
  }

  return null;
};

export const calculateOverallStats = (data: PaperRecord[]): DashboardStats => {
  let totalSheets = 0;
  let totalRequests = data.length;
  let totalSavedSheets = 0;

  data.forEach(record => {
    totalSheets += record.sheet_used;
    if (record.pages_per_sheet === 2) {
      totalSavedSheets += record.sheet_used; 
    }
  });

  // Environmental Impact Calculations (Approximations)
  // Source: Environmental Paper Network & generic industry averages
  // 1 Tree ~= 8,333 sheets (standard copy paper)
  // 1 Sheet ~= 0.0045 kg CO2 (4.5g)
  // 1 Sheet ~= 0.3 liters of water (lifecycle)
  
  const treesConsumed = totalSheets / 8333;
  const co2Emissions = totalSheets * 0.0045;
  const waterUsage = totalSheets * 0.3;

  return { 
    totalSheets, 
    totalRequests, 
    totalSavedSheets,
    treesConsumed,
    co2Emissions,
    waterUsage
  };
};

export const getUsageByDepartment = (data: PaperRecord[]): ChartDataPoint[] => {
  const map: Record<string, number> = {};
  
  data.forEach(record => {
    const dept = record.department || 'Unknown';
    map[dept] = (map[dept] || 0) + record.sheet_used;
  });

  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); 
};

export const getEfficiencyRatio = (data: PaperRecord[]): ChartDataPoint[] => {
  let singlePageCount = 0;
  let doublePageCount = 0;

  data.forEach(record => {
    if (record.pages_per_sheet > 1) {
      doublePageCount++;
    } else {
      singlePageCount++;
    }
  });

  return [
    { name: '1 Page/Sheet', value: singlePageCount, color: '#f87171' }, 
    { name: '2+ Pages/Sheet', value: doublePageCount, color: '#34d399' }, 
  ];
};

export const getMonthlyTrend = (data: PaperRecord[]): TrendPoint[] => {
  const map: Record<string, number> = {};

  data.forEach(record => {
    const dateObj = parseDate(record.date);
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      map[key] = (map[key] || 0) + record.sheet_used;
    }
  });

  return Object.entries(map)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, sheets]) => {
      const [year, month] = key.split('-').map(Number);
      const date = new Date(year, month - 1);
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { date: dateLabel, sheets };
    });
};

export const getYearlyTrend = (data: PaperRecord[]): TrendPoint[] => {
  const map: Record<string, number> = {};

  data.forEach(record => {
    const dateObj = parseDate(record.date);
    if (dateObj) {
      const year = dateObj.getFullYear();
      const key = `${year}`;
      map[key] = (map[key] || 0) + record.sheet_used;
    }
  });

  return Object.entries(map)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, sheets]) => ({ date: key, sheets }));
};