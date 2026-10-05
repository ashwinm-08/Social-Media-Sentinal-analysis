import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, HelpCircle, AlertTriangle, 
  RotateCcw
} from 'lucide-react';

import { getReviewQueue, submitReviewCorrection } from '../services/api';

export const ReviewQueuePage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    getReviewQueue()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLabelCorrection = async (itemId: number, label: string) => {
    try {
      await submitReviewCorrection(itemId, label);
      setItems(items.filter(it => it.id !== itemId));
      setFeedbackSuccess(`Post #${itemId} corrected as "${label}". Saved for model retraining.`);
      setTimeout(() => setFeedbackSuccess(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Human-in-the-Loop Review Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Active Retraining Buffer
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Audit posts flagged with low confidence (&lt;65%) or potential sarcasm. Your corrections are stored to supervise future model fine-tuning.
          </p>
        </div>

        <button
          onClick={fetchItems}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Refresh Buffer
        </button>
      </div>

      {feedbackSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {feedbackSuccess}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Queue is Clear!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All ambiguous predictions and sarcasm flags have been reviewed. Outstanding performance.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Post #{item.post_id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] capitalize text-slate-500">{item.platform}</span>

                  {item.flag_reason === 'sarcasm' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      <AlertTriangle className="h-3 w-3" /> Sarcasm Flag
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <HelpCircle className="h-3 w-3" /> Low Confidence ({(item.confidence * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Predicted As:</span>
                  <span className="font-bold uppercase text-slate-700 dark:text-slate-300">
                    {item.original_label}
                  </span>
                </div>
              </div>

              {/* Action Buttons for One-Click Correction */}
              <div className="space-y-2 shrink-0 text-right">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-left md:text-right">
                  Assign True Label:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLabelCorrection(item.id, 'negative')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 transition shadow-sm"
                  >
                    Negative
                  </button>
                  <button
                    onClick={() => handleLabelCorrection(item.id, 'neutral')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-600 text-slate-700 hover:text-white border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 transition shadow-sm"
                  >
                    Neutral
                  </button>
                  <button
                    onClick={() => handleLabelCorrection(item.id, 'positive')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 transition shadow-sm"
                  >
                    Positive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
