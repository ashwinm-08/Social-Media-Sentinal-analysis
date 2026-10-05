import React, { useState } from 'react';
import { 
  Sparkles, Send, AlertTriangle, AlertCircle, 
  HelpCircle, RefreshCw
} from 'lucide-react';

import { predictSentiment } from '../services/api';
import type { PredictionResult } from '../types/sentiment';


const EXAMPLE_POSTS = [
  {
    title: "Strong Positive (Quality & Delivery)",
    text: "I absolutely love this smartphone! The quality and build is amazing and delivery was super fast, arrived next day."
  },
  {
    title: "Severe Negative (Service & Price)",
    text: "Terrible customer service and rude staff. Defective item, total waste of money and overpriced garbage!"
  },
  {
    title: "Sarcastic Post (Spike Trigger)",
    text: "Oh great, another package delayed by two weeks and arrived damaged. Total genius courier /s"
  },
  {
    title: "Mixed Aspects (Good Packaging, Poor Delivery)",
    text: "The packaging was nice and sturdy, but delivery took forever and the shipping courier was completely unresponsive."
  }
];

export const LiveAnalyzerPage: React.FC = () => {
  const [inputText, setInputText] = useState(EXAMPLE_POSTS[0].text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionResult[] | null>(null);

  const handleAnalyze = async (textToRun?: string) => {
    const text = textToRun || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    // Support single text or multi-line batch paste
    const lines = text
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0);


    try {
      const response = await predictSentiment(lines);
      setResults(response.results);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sentiment classification.');
    } finally {
      setLoading(false);
    }
  };

  const selectExample = (text: string) => {
    setInputText(text);
    handleAnalyze(text);
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'negative':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getAspectBadgeColor = (polarity: string) => {
    switch (polarity) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300';
      case 'negative':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/60 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Sentiment & Aspect Analyzer
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Input any social media post, review, or customer feedback to evaluate overall sentiment, calibrated probability, sarcasm risk, and decomposed aspect sentiment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Input Text (Single post or multiple lines):
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              placeholder="Paste social media post or customer feedback here..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {inputText.split('\n').filter((l: string) => l.trim().length > 0).length} post(s) ready
              </span>

              <button
                onClick={() => handleAnalyze()}
                disabled={loading || !inputText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Analyze Sentiment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Example Posts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Click an example to test:
            </h3>
            <div className="space-y-2">
              {EXAMPLE_POSTS.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => selectExample(ex.text)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 transition group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                      {ex.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    "{ex.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!results && !loading && !error && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No Analysis Performed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Type or select an example post on the left and click "Analyze Sentiment" to inspect the output.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Displaying {results.length} result(s)</span>
                <span className="italic">Calibrated Probabilities: [Neg, Neu, Pos]</span>
              </div>

              {results.map((res: PredictionResult, index: number) => (
                <div
                  key={index}

                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                >
                  {/* Top Text & Label */}
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                      "{res.text}"
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Sentiment Label Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getLabelColor(res.label)}`}>
                        {res.label}
                      </span>

                      {/* Confidence Score */}
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Confidence: {(res.confidence * 100).toFixed(0)}%
                      </span>

                      {/* Uncertain Badge */}
                      {res.uncertain && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                          <HelpCircle className="h-3 w-3" /> Uncertain Prediction
                        </span>
                      )}

                      {/* Sarcasm Flag Badge */}
                      {res.sarcasm && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300">
                          <AlertTriangle className="h-3 w-3" /> Possible Sarcasm Detected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Probability distribution bars */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      <span>Probability Distribution</span>
                      <span className="text-[11px] text-slate-400">
                        Neg: {(res.probabilities[0] * 100).toFixed(0)}% | Neu: {(res.probabilities[1] * 100).toFixed(0)}% | Pos: {(res.probabilities[2] * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${res.probabilities[0] * 100}%` }}
                        className="bg-rose-500 h-full transition-all duration-300"
                        title={`Negative: ${(res.probabilities[0] * 100).toFixed(0)}%`}
                      />
                      <div
                        style={{ width: `${res.probabilities[1] * 100}%` }}
                        className="bg-slate-400 h-full transition-all duration-300"
                        title={`Neutral: ${(res.probabilities[1] * 100).toFixed(0)}%`}
                      />
                      <div
                        style={{ width: `${res.probabilities[2] * 100}%` }}
                        className="bg-emerald-500 h-full transition-all duration-300"
                        title={`Positive: ${(res.probabilities[2] * 100).toFixed(0)}%`}
                      />
                    </div>
                  </div>

                  {/* Per-Aspect Polarity Chips */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                      Product Aspect Sentiment:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {['price', 'quality', 'packaging', 'service', 'delivery'].map((aspectKey) => {
                        const aspectData = res.aspects?.[aspectKey];
                        const polarity = aspectData?.polarity || 'neutral';
                        const conf = aspectData?.confidence ? Math.round(aspectData.confidence * 100) : 50;

                        return (
                          <div
                            key={aspectKey}
                            className={`p-2.5 rounded-xl border text-center ${getAspectBadgeColor(polarity)}`}
                          >
                            <span className="block text-[11px] font-bold capitalize">
                              {aspectKey}
                            </span>
                            <span className="block text-[10px] uppercase font-semibold mt-0.5 opacity-90">
                              {polarity}
                            </span>
                            <span className="block text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {conf}% conf
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
