
import React, { useMemo } from 'react';
import { DailyMenu, Selection } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsDashboardProps {
  menu: DailyMenu | null;
  selections: Selection[];
  mini?: boolean;
}

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

const StatsDashboard: React.FC<StatsDashboardProps> = ({ menu, selections, mini = false }) => {
  const chartData = useMemo(() => {
    if (!menu) return [];
    
    const counts: Record<string, number> = {};
    menu.meals.forEach(m => (counts[m.id] = 0));
    
    selections.forEach(s => {
      s.mealIds.forEach(id => {
        if (counts[id] !== undefined) counts[id]++;
      });
    });

    return menu.meals.map(m => ({
      name: m.name,
      count: counts[m.id]
    })).sort((a, b) => b.count - a.count);
  }, [menu, selections]);

  if (!menu || chartData.length === 0) {
    return <div className="text-slate-400 text-center py-8">Waiting for menu & selections...</div>;
  }

  const topMeals = chartData.slice(0, 5);
  const totalOrders = selections.length;

  return (
    <div className="space-y-6">
      {!mini && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <span className="text-slate-500 text-xs block mb-1">Total Colleagues</span>
            <span className="text-2xl font-bold text-orange-600">{totalOrders}</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <span className="text-slate-500 text-xs block mb-1">Items in Menu</span>
            <span className="text-2xl font-bold text-blue-600">{menu.meals.length}</span>
          </div>
        </div>
      )}

      <div className={mini ? "h-48" : "h-64"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-700">Detailed Rankings</h3>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-5 text-slate-400 font-mono">#{i + 1}</span>
                <span className="text-slate-700 font-medium">{item.name}</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold text-xs">
                {item.count} picks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
