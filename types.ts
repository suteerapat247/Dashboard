
export interface PaperRecord {
  date: string;
  user_type: string;
  department: string;
  pages_per_sheet: number; // 1 or 2
  total_pages: number;
  copies: number;
  sheet_used: number;
}

export interface DashboardStats {
  totalSheets: number;
  totalRequests: number;
  totalSavedSheets: number; // Estimated savings from 2-up printing
  // Environmental Impact
  treesConsumed: number;
  co2Emissions: number; // in kg
  waterUsage: number; // in liters
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TrendPoint {
  date: string; // Represents the time period (e.g., "Jan 2023" or "2023")
  sheets: number;
}
