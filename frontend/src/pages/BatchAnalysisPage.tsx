import React, { useState } from 'react';
import { 
  Upload, Download, AlertCircle, 
  RefreshCw, FileSpreadsheet, Sparkles
} from 'lucide-react';

import { batchAnalyzeCsv } from '../services/api';

export const BatchAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.csv')) {
        setError('Please upload a valid .csv file.');
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        setError('File size must be below 2MB.');
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await batchAnalyzeCsv(file);
      setResults(res.results);
    } catch (err: any) {
      setError(err.message || 'Batch classification failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results || results.length === 0) return;
    const headers = [
      'ID', 'Text', 'Sentiment', 'Confidence', 'Sarcasm', 
      'Price_Aspect', 'Quality_Aspect', 'Service_Aspect', 'Delivery_Aspect'
    ];
    const rows = results.map(r => [
      r.id,
      `"${r.text.replace(/"/g, '""')}"`,
      r.label,
      r.confidence,
      r.sarcasm ? 'Yes' : 'No',
      r.price_aspect,
      r.quality_aspect,
      r.service_aspect,
      r.delivery_aspect
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sentimentiq_batch_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadSampleCSV = () => {
    const sampleContent = `text,brand,platform
"Absolutely love the build quality of NovaTech, fast shipping!",NovaTech,twitter
"Horrible battery life and overheats within 10 minutes. Terrible!",NovaTech,reddit
"Average performance, packaging was slightly bent but product works.",NovaTech,reviews
"Customer service representative was extremely rude and unhelpful.",NovaTech,twitter
"The sound output and craftsmanship exceeded all expectations. 10/10!",NovaTech,youtube
"Oh great, package delayed by two weeks again. Outstanding service /s",NovaTech,reddit
"Worth every dollar! Durable finish and sleek packaging.",NovaTech,reviews
"Defective charging port, waste of money. Requesting a refund.",NovaTech,twitter
`;
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const sampleFile = new File([blob], 'sample_social_posts.csv', { type: 'text/csv' });
    setFile(sampleFile);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Batch CSV Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload social media posts in bulk. Validates structure, performs multi-aspect sentiment decomposition, and exports results.
          </p>
        </div>

        {/* Quick Sample Button */}
        <button
          onClick={loadSampleCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          Load Pre-built Sample CSV (8 posts)
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3 hover:border-blue-400 dark:hover:border-blue-600 transition">
          <Upload className="h-10 w-10 text-blue-600 mx-auto" />
          <div>
            <label className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
              <span>Click to select CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400"> or drag and drop file here</span>
          </div>
          <p className="text-xs text-slate-400">
            Accepts UTF-8 CSV containing a `text`, `content`, or `review` column (Max 2MB, up to 200 rows per run)
          </p>

          {file && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <FileSpreadsheet className="h-4 w-4" />
              <span>{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleUploadAndAnalyze}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing Batch...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze CSV Content
              </>
            )}
          </button>
        </div>
      </div>


      {/* Results Table & Export */}
      {results && results.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Batch Inference Preview ({results.length} rows)
              </h3>
              <p className="text-xs text-slate-400">All predictions generated via current model provider</p>
            </div>

            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition"
            >
              <Download className="h-4 w-4" />
              Export Results as CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Text Snippet</th>
                  <th className="py-3 px-3">Sentiment</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Quality</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 text-slate-400 font-mono">{r.id}</td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-800 dark:text-slate-200">
                      {r.text}
                    </td>
                    <td className="py-3 px-3 font-bold uppercase">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        r.label === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                        r.label === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {r.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{(r.confidence * 100).toFixed(0)}%</td>
                    <td className="py-3 px-3 capitalize">{r.quality_aspect}</td>
                    <td className="py-3 px-3 capitalize">{r.price_aspect}</td>
                    <td className="py-3 px-3 capitalize">{r.delivery_aspect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
