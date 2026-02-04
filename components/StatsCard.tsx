import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight group-hover:text-amber-600 transition-colors">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
      </div>
      {subtitle && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-gray-500">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;