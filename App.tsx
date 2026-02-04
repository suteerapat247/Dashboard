import React, { useEffect, useState, useMemo } from 'react';
import { fetchPaperData } from './services/dataService';
import { calculateOverallStats, getUsageByDepartment, getEfficiencyRatio, getMonthlyTrend, getYearlyTrend } from './utils/analytics';
import { PaperRecord, DashboardStats } from './types';
import StatsCard from './components/StatsCard';
import { DepartmentBarChart, EfficiencyPieChart, UsageTrendChart } from './components/Charts';

// --- Icons ---
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Impact Icons
const TreeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.294-2.708.826-3.91a.75.75 0 01.722-.516 11.208 11.208 0 007.686-3.153zM11.25 19.25v-6.5a.75.75 0 011.5 0v6.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75z" clipRule="evenodd" />
  </svg>
);

const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" clipRule="evenodd" />
  </svg>
);

const WaterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" clipRule="evenodd" />
  </svg>
);

// --- Helpers ---
const getYearFromDate = (dateStr: string): string => {
  if (!dateStr) return 'Unknown';
  const parts = dateStr.split(/[/-]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) return parts[2]; 
    if (parts[0].length === 4) return parts[0]; 
  }
  return 'Unknown';
};

const App: React.FC = () => {
  const [data, setData] = useState<PaperRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [yearFilter, setYearFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  useEffect(() => {
    const initData = async () => {
      try {
        const result = await fetchPaperData();
        setData(result);
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const { years, departments } = useMemo(() => {
    const uniqueYears = new Set<string>();
    const uniqueDepts = new Set<string>();

    data.forEach(item => {
      uniqueYears.add(getYearFromDate(item.date));
      if(item.department) uniqueDepts.add(item.department);
    });

    return {
      years: Array.from(uniqueYears).sort(),
      departments: Array.from(uniqueDepts).sort(),
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const year = getYearFromDate(item.date);
      const matchesYear = yearFilter === 'All' || year === yearFilter;
      const matchesDept = deptFilter === 'All' || item.department === deptFilter;
      return matchesYear && matchesDept;
    });
  }, [data, yearFilter, deptFilter]);

  const stats: DashboardStats | null = useMemo(() => {
    if (filteredData.length === 0) return null;
    return calculateOverallStats(filteredData);
  }, [filteredData]);

  const deptData = useMemo(() => getUsageByDepartment(filteredData), [filteredData]);
  const efficiencyData = useMemo(() => getEfficiencyRatio(filteredData), [filteredData]);
  
  // Intelligent Trend Logic
  const trendData = useMemo(() => {
     if (yearFilter === 'All') {
       return getYearlyTrend(filteredData);
     } else {
       return getMonthlyTrend(filteredData);
     }
  }, [filteredData, yearFilter]);

  const hasActiveFilters = yearFilter !== 'All' || deptFilter !== 'All';

  const clearFilters = () => {
    setYearFilter('All');
    setDeptFilter('All');
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    // Define CSV Headers
    const headers = ['Date', 'Department', 'User Type', 'Pages/Sheet', 'Total Pages', 'Copies', 'Sheets Used'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','), // Header row
      ...filteredData.map(row => {
        // Handle fields that might contain commas by wrapping in quotes
        const dept = `"${row.department.replace(/"/g, '""')}"`; 
        const user = `"${row.user_type.replace(/"/g, '""')}"`;
        return [
          row.date,
          dept,
          user,
          row.pages_per_sheet,
          row.total_pages,
          row.copies,
          row.sheet_used
        ].join(',');
      })
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ecoprint_analytics_${timestamp}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
           <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-gray-600 font-medium tracking-wide">Initializing Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-800">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
           <p className="text-xl font-bold mb-2">Error Loading Data</p>
           <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl text-white shadow-lg shadow-amber-500/30">
               <LeafIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">EcoPrint</h1>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Analytics Dashboard</span>
            </div>
          </div>
          <div className="hidden md:block text-sm text-gray-400 font-medium">
            v1.3.1 • Corporate Sustainability
          </div>
        </div>
      </nav>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <FilterIcon />
            <span className="font-semibold text-sm">Filter Data:</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center overflow-x-auto pb-1 sm:pb-0">
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="block flex-1 sm:flex-none w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg transition-shadow cursor-pointer hover:bg-white border hover:border-amber-300"
            >
              <option value="All">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="block flex-1 sm:flex-none w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg transition-shadow cursor-pointer hover:bg-white border hover:border-amber-300"
            >
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm whitespace-nowrap"
                title="Download filtered data as CSV"
              >
                <DownloadIcon />
                <span className="hidden sm:inline">Export</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all shadow-sm whitespace-nowrap"
                  title="Reset all filters"
                >
                  <XMarkIcon />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h2>
            <p className="text-gray-500 mt-2 text-lg">
              Showing usage data for <span className="font-semibold text-amber-600">{yearFilter}</span> in <span className="font-semibold text-amber-600">{deptFilter === 'All' ? 'All Departments' : deptFilter}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Sheets Used" 
            value={stats?.totalSheets.toLocaleString() || 0} 
            subtitle="sheets processed"
            icon={<DocumentIcon />}
          />
          <StatsCard 
            title="Total Requests" 
            value={stats?.totalRequests.toLocaleString() || 0} 
            subtitle="printing jobs"
            icon={<ChartBarIcon />}
          />
           <StatsCard 
            title="Eco-Savings (Est.)" 
            value={stats?.totalSavedSheets.toLocaleString() || 0} 
            subtitle="sheets saved via duplex"
            icon={<LeafIcon />}
          />
        </div>

        {/* New Feature: Environmental Impact Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
           <div className="flex items-center gap-2 mb-4">
              <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <LeafIcon />
              </span>
              <h3 className="text-lg font-bold text-gray-800">Environmental Impact</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                 <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <TreeIcon />
                 </div>
                 <div>
                    <p className="text-sm text-gray-500 font-medium">Trees Consumed</p>
                    <p className="text-xl font-bold text-gray-800">{stats?.treesConsumed.toFixed(2)} <span className="text-xs font-normal text-gray-400">trees</span></p>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                 <div className="p-3 bg-gray-100 text-gray-600 rounded-full">
                    <CloudIcon />
                 </div>
                 <div>
                    <p className="text-sm text-gray-500 font-medium">CO2 Emissions</p>
                    <p className="text-xl font-bold text-gray-800">{stats?.co2Emissions.toFixed(1)} <span className="text-xs font-normal text-gray-400">kg</span></p>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <WaterIcon />
                 </div>
                 <div>
                    <p className="text-sm text-gray-500 font-medium">Water Usage</p>
                    <p className="text-xl font-bold text-gray-800">{stats?.waterUsage.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-xs font-normal text-gray-400">liters</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart - Dynamic (Yearly/Monthly) */}
          <div className="lg:col-span-2">
            <UsageTrendChart 
              data={trendData} 
              variant={yearFilter === 'All' ? 'bar' : 'line'} 
            />
          </div>

          {/* Efficiency Pie */}
          <div className="lg:col-span-1">
            <EfficiencyPieChart data={efficiencyData} />
          </div>

          {/* Department Bar */}
          <div className="lg:col-span-3">
            <DepartmentBarChart data={deptData} />
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;