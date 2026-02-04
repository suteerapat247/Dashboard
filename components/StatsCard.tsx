import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:bg-slate-750 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-500 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-300">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;