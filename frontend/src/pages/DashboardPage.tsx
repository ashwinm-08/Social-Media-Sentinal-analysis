import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, 
  HelpCircle, ShieldAlert, Filter, Calendar
} from 'lucide-react';

import { 
  LineChart, Line, BarChart as RechartsBar, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getBrands, getDashboardData } from '../services/api';

export const DashboardPage: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getBrands().then(setBrands).catch(console.error);
  }, []);

  const fetchData = () => {
    setLoading(true);
    getDashboardData(selectedBrand, selectedPlatform, selectedDays)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedBrand, selectedPlatform, selectedDays]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Perception Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              Demo data
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time aggregate sentiment trajectories, aspect sentiment drivers, and anomaly spike alerts.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-slate-500">
            <Filter className="h-3.5 w-3.5 text-blue-600" />
            <span>Brand:</span>
          </div>
          <select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value ? Number(e.target.value) : undefined)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Brands (Aggregate)</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-slate-500">
            <span>Platform:</span>
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Sources</option>
            <option value="twitter">Twitter / X</option>
            <option value="reddit">Reddit</option>
            <option value="youtube">YouTube</option>
            <option value="reviews">Product Reviews</option>
          </select>

          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Window:</span>
          </div>
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      )}

      {/* 4 KPI Cards + Perception Score Card */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1: Posts Analysed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Posts Analysed</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Demo data</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
              {data.total_posts.toLocaleString()}
            </p>
            <span className="mt-1 block text-xs text-slate-400">across social media channels</span>
          </div>

          {/* Card 2: Positive Sentiment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Positive Ratio</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {data.pct_positive}%
            </p>
            <span className="mt-1 block text-xs text-slate-400">of total conversations</span>
          </div>

          {/* Card 3: Negative Sentiment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Negative Ratio</span>
              <TrendingDown className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {data.pct_negative}%
            </p>
            <span className="mt-1 block text-xs text-slate-400">of total conversations</span>
          </div>

          {/* Card 4: Active Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Active Spike Alerts</span>
              <ShieldAlert className="h-4 w-4" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {data.active_alerts}
            </p>
            <span className="mt-1 block text-xs text-slate-400">statistical z-score anomalies</span>
          </div>

          {/* Card 5: Perception Impact Score */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md relative group">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-100">
              <span>Perception Score</span>
              <div className="relative cursor-help" title="Formula: 50 + (Positive% - Negative%) * 0.5. Calibrated to 0-100 representing composite brand sentiment health.">
                <HelpCircle className="h-4 w-4 text-blue-200" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight">
              {data.perception_score} <span className="text-sm font-normal text-blue-200">/ 100</span>
            </p>
            <span className="mt-1 block text-[11px] text-blue-100 font-medium">
              Hover icon for methodology tooltip
            </span>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sentiment Trend Line Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Sentiment Trajectory
                </h3>
                <span className="text-xs text-slate-400">30-day temporal trend of conversation volume</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Demo data
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend_data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2.5} name="Positive" dot={false} />
                  <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={1.5} name="Neutral" dot={false} />
                  <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} name="Negative" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aspect Stacked Bar Chart */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Aspect Polarity Breakdown
                </h3>
                <span className="text-xs text-slate-400">Distribution across 5 product dimensions</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Demo data
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar data={data.aspect_breakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="aspect" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" stackId="a" fill="#10b981" name="Positive" />
                  <Bar dataKey="neutral" stackId="a" fill="#9ca3af" name="Neutral" />
                  <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                </RechartsBar>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Lower Tables: Topic Themes & Recent Spike Alerts */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Topic Themes Table */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Top Topic Themes
            </h3>
            <p className="text-xs text-slate-400 mb-4">Unsupervised topic clustering assignments</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">Cluster Topic</th>
                    <th className="pb-3 font-semibold text-right">Volume</th>
                    <th className="pb-3 font-semibold text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.top_topics.map((t: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        {t.topic}
                      </td>
                      <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                        {t.volume}
                      </td>
                      <td className="py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                        {(t.relevance * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Alerts List */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Recent Negative Spike Incidents
            </h3>
            <p className="text-xs text-slate-400 mb-4">Detected through statistical z-score triggers</p>

            <div className="space-y-3">
              {data.recent_alerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No open spike alerts.</p>
              ) : (
                data.recent_alerts.map((alt: any) => (
                  <div
                    key={alt.id}
                    className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        {alt.brand_name} • Spike Detected
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        {alt.severity} (z={alt.z_score})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {alt.explanation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
