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
import { ChartDataPoint, TrendPoint } from '../types';

const PIE_COLORS = ['#e2e8f0', '#d97706']; // Slate-200, Amber-600

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, action }) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col h-[400px] transition-all duration-300 hover:shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
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
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-amber-600 font-medium">
          {payload[0].name}: {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const DepartmentBarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  return (
    <ChartContainer title="Consumption by Department">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} 
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fffbeb' }} />
          <Bar 
            dataKey="value" 
            name="Sheets Used" 
            fill="#d97706" 
            radius={[0, 6, 6, 0]} 
            barSize={24}
            fillOpacity={0.9} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const EfficiencyPieChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
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
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

interface UsageTrendChartProps {
  data: TrendPoint[];
  variant?: 'line' | 'bar'; // Support switching between types
}

export const UsageTrendChart: React.FC<UsageTrendChartProps> = ({ data, variant = 'line' }) => {
  const title = variant === 'bar' ? 'Yearly Usage Overview' : 'Monthly Usage Trend';

  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'bar' ? (
           <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
             <XAxis 
               dataKey="date" 
               tick={{ fontSize: 12, fill: '#64748b' }} 
               axisLine={false}
               tickLine={false}
             />
             <YAxis 
               tick={{ fontSize: 12, fill: '#64748b' }} 
               axisLine={false}
               tickLine={false}
             />
             <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fffbeb' }} />
             <Bar 
               dataKey="sheets" 
               name="Sheets Used" 
               fill="#d97706" 
               radius={[6, 6, 0, 0]} 
               barSize={40}
             />
           </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              tickMargin={15}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sheets" 
              name="Sheets Used"
              stroke="#d97706" 
              strokeWidth={4}
              dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#d97706' }} 
              activeDot={{ r: 8, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};