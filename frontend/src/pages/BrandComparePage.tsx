import React, { useEffect, useState } from 'react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { getBrands, getBrandComparison } from '../services/api';

export const BrandComparePage: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3]);
  const [comparison, setComparison] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getBrands().then((bList) => {
      setBrands(bList);
      if (bList.length >= 2) {
        setSelectedIds(bList.slice(0, 3).map((b: any) => b.id));
      }
    });
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      getBrandComparison(selectedIds)
        .then(setComparison)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedIds]);

  const toggleBrand = (id: number) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Format aspect strength radar data
  const aspectsList = ['price', 'quality', 'packaging', 'service', 'delivery'];
  const radarData = aspectsList.map(aspect => {
    const item: any = { aspect: aspect.toUpperCase() };
    if (comparison?.brands) {
      comparison.brands.forEach((b: any) => {
        item[b.brand_name] = b.aspect_strengths?.[aspect] || 50;
      });
    }
    return item;
  });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Competitive Brand Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              Demo data
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Side-by-side benchmarking of volume share, perception impact scores, and aspect strengths.
          </p>
        </div>

        {/* Brand Selector chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Pick (2-4):</span>
          {brands.map((b) => {
            const isSelected = selectedIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBrand(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      )}

      {!loading && comparison && (
        <>
          {/* Side-by-side summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparison.brands.map((b: any, idx: number) => (
              <div
                key={b.brand_id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {b.brand_name}
                    </h3>
                    <span className="text-xs text-slate-400">{b.industry}</span>
                  </div>
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Perception Score:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {b.perception_score} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${b.perception_score}%`,
                          backgroundColor: colors[idx % colors.length]
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-400">Volume</span>
                      <span className="font-bold text-xs">{b.total_posts}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-500">Positive</span>
                      <span className="font-bold text-xs text-emerald-600">{b.pct_positive}%</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-rose-500">Negative</span>
                      <span className="font-bold text-xs text-rose-600">{b.pct_negative}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Benchmark Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bar Chart Sentiment Comparison */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Sentiment Rate Comparison
              </h3>
              <p className="text-xs text-slate-400 mb-4">Positive vs Negative ratio across brands</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison.brands}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="brand_name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pct_positive" fill="#10b981" name="Positive %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pct_negative" fill="#ef4444" name="Negative %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar / Aspect Strength Breakdown */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Aspect Strengths Radar
              </h3>
              <p className="text-xs text-slate-400 mb-4">% Positive ratio across core product dimensions</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid opacity={0.2} />
                    <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {comparison.brands.map((b: any, idx: number) => (
                      <Radar
                        key={b.brand_id}
                        name={b.brand_name}
                        dataKey={b.brand_name}
                        stroke={colors[idx % colors.length]}
                        fill={colors[idx % colors.length]}
                        fillOpacity={0.25}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
