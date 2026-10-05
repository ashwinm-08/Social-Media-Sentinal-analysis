import React, { useEffect, useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { getAlerts, updateAlertStatus } from '../services/api';


export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const fetchAlertsList = () => {
    setLoading(true);
    getAlerts(filterStatus)
      .then((data) => {
        setAlerts(data);
        if (data.length > 0 && !selectedAlert) {
          setSelectedAlert(data[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlertsList();
  }, [filterStatus]);

  const handleStatusChange = async (alertId: number, newStatus: string) => {
    try {
      await updateAlertStatus(alertId, newStatus);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert({ ...selectedAlert, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Spike Detection & Root Cause Alerts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              Demo data
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Automated statistical anomaly detection flagging negative sentiment surges with causal aspect diagnosis.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {['all', 'open', 'acknowledged', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      )}

      {/* Grid: Alerts Table (Left) + Detail & Root Cause Panel (Right) */}
      {!loading && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Table Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Incident Registry ({alerts.length})
            </span>
            <span className="text-[11px] text-slate-400">Click row to open root-cause detail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Negative %</th>
                  <th className="py-3 px-4">Z-Score</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {alerts.map((alt) => (
                  <tr
                    key={alt.id}
                    onClick={() => setSelectedAlert(alt)}
                    className={`cursor-pointer transition ${
                      selectedAlert?.id === alt.id
                        ? 'bg-blue-50/60 dark:bg-blue-900/30 font-medium'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {alt.brand_name}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">
                      {alt.negative_ratio}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      z = {alt.z_score}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityBadge(alt.severity)}`}>
                        {alt.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Root Cause Panel (Right) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedAlert ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Alert Investigation #{selectedAlert.id}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedAlert.brand_name}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getSeverityBadge(selectedAlert.severity)}`}>
                  {selectedAlert.severity} Severity
                </span>
              </div>

              {/* Statistical Metrics */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Negative Ratio</span>
                  <p className="text-xl font-bold text-rose-600">{selectedAlert.negative_ratio}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Standard Deviations</span>
                  <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">+{selectedAlert.z_score} σ</p>
                </div>
              </div>

              {/* Plain-English "Why it happened" Section */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                  <Info className="h-4 w-4" />
                  <span>Why It Happened (Causal Root-Cause Breakdown)</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedAlert.explanation}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Top Contributing Aspect: <strong className="text-slate-900 dark:text-white uppercase">{selectedAlert.top_aspect || 'Quality'}</strong></span>
                  <span>•</span>
                  <span>Cluster: <strong className="text-slate-900 dark:text-white">{selectedAlert.top_topic || 'Battery & Heating'}</strong></span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update Investigation Status:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['open', 'acknowledged', 'closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedAlert.id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border ${
                        selectedAlert.status === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              Select an alert from the table to inspect details.
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

