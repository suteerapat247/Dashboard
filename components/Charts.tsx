import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { ChartDataPoint, TrendPoint } from '../types.ts';

const PIE_COLORS = ['#e2e8f0', '#d97706']; // Light Mode: Slate-200, Amber-600
const PIE_COLORS_DARK = ['#334155', '#fbbf24']; // Dark Mode: Slate-700, Amber-400

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, action }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-700 flex flex-col h-[400px] transition-all duration-300 hover:shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">{title}</h3>
      {action}
    </div>
    <div className="flex-1 w-full min-h-0">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 text-sm">
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
        <p className="text-amber-600 dark:text-amber-400 font-medium">
          {payload[0].name}: {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

interface ChartProps {
  data: any[];
  isDarkMode?: boolean;
}

export const DepartmentBarChart: React.FC<ChartProps> = ({ data, isDarkMode = false }) => {
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';
  const barColor = isDarkMode ? '#fbbf24' : '#d97706';

  return (
    <ChartContainer title="Consumption by Department">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{ fontSize: 12, fill: textColor, fontWeight: 500 }} 
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#fffbeb' }} />
          <Bar 
            dataKey="value" 
            name="Sheets Used" 
            fill={barColor} 
            radius={[0, 6, 6, 0]} 
            barSize={24}
            fillOpacity={0.9} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const EfficiencyPieChart: React.FC<ChartProps> = ({ data, isDarkMode = false }) => {
  const colors = isDarkMode ? PIE_COLORS_DARK : PIE_COLORS;
  
  return (
    <ChartContainer title="Eco-Efficiency (Pages/Sheet)">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className={`font-medium ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

interface UsageTrendChartProps extends ChartProps {
  variant?: 'line' | 'bar';
}

export const UsageTrendChart: React.FC<UsageTrendChartProps> = ({ data, variant = 'line', isDarkMode = false }) => {
  const title = variant === 'bar' ? 'Yearly Usage Overview' : 'Monthly Usage Trend';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';
  const primaryColor = isDarkMode ? '#fbbf24' : '#d97706';

  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'bar' ? (
           <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
             <XAxis 
               dataKey="date" 
               tick={{ fontSize: 12, fill: textColor }} 
               axisLine={false}
               tickLine={false}
             />
             <YAxis 
               tick={{ fontSize: 12, fill: textColor }} 
               axisLine={false}
               tickLine={false}
             />
             <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#fffbeb' }} />
             <Bar 
               dataKey="sheets" 
               name="Sheets Used" 
               fill={primaryColor} 
               radius={[6, 6, 0, 0]} 
               barSize={40}
             />
           </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: textColor }} 
              tickMargin={15}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: textColor }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sheets" 
              name="Sheets Used"
              stroke={primaryColor} 
              strokeWidth={4}
              dot={{ r: 6, fill: isDarkMode ? '#1e293b' : '#fff', strokeWidth: 3, stroke: primaryColor }} 
              activeDot={{ r: 8, fill: primaryColor, stroke: isDarkMode ? '#1e293b' : '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};