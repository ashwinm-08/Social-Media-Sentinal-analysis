import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Layers, AlertCircle, ArrowRight, 
  BarChart, Zap, CheckCircle2, LineChart
} from 'lucide-react';


export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            B.E. (AI & ML) Capstone Project
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Social Media Sentiment Intelligence for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Product Perception Modeling
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform high-volume social media streams into actionable product intelligence.
            Detect real-time sentiment trajectories, pinpoint aspect-level drivers, and automatically identify anomalous negative spikes before they escalate.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="h-5 w-5" />
              Try Live Analyzer
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition"
            >
              <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              View Demo Dashboard
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Swappable ML Model Layer
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Aspect-Based Polarity
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Statistical Spike Detection
            </span>
          </div>
        </div>
      </section>

      {/* 3 Core Value Cards */}
      <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">
              Comprehensive Perception Intelligence
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for precision beyond simple polarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                1. Sentiment & Uncertainty
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Classifies posts into Negative, Neutral, and Positive with full confidence calibration.
                Flags low-confidence predictions and detects sarcastic nuances.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Calibrated probability distributions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Sarcasm & ambiguity flags
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                2. Multi-Aspect Diagnostics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Deconstructs opinions into 5 core product aspects: <strong className="text-slate-800 dark:text-slate-200">Price, Quality, Packaging, Service</strong>, and <strong className="text-slate-800 dark:text-slate-200">Delivery</strong>.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Granular aspect-level breakdown
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Actionable departmental insights
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                3. Root-Cause Spike Alerts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Monitors statistical z-score thresholds on negative volume ratios.
                Generates instant plain-English explanations identifying the exact culprit aspect and topic.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Automated z-score statistical trigger
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Root-cause causal explanation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Pipeline Diagram */}
      <section className="py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">
              System Architecture
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Processing Pipeline
            </p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              How unstructured social media text flows through our perception model into executive actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">STAGE 1</span>
              <h4 className="text-base font-semibold mt-1 text-slate-900 dark:text-white">Ingestion & Hygiene</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Public social feeds collected and cleaned: tokenization, anonymization, and noise filtration.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">STAGE 2</span>
              <h4 className="text-base font-semibold mt-1 text-slate-900 dark:text-white">Swappable Model Layer</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Pluggable architecture (`MockProvider` or `HuggingFaceProvider`) extracting calibrated probabilities & sarcasm.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">STAGE 3</span>
              <h4 className="text-base font-semibold mt-1 text-slate-900 dark:text-white">Aspect Extraction</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Multi-aspect decomposition classifying Price, Quality, Packaging, Service, and Delivery.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">STAGE 4</span>
              <h4 className="text-base font-semibold mt-1 text-slate-900 dark:text-white">Perception Analytics</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Z-score spike alerting with causal explanations, review queues for human-in-the-loop retraining.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-12 bg-blue-600 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Ready to test model inference?</h3>
            <p className="text-blue-100 text-sm mt-1">
              Explore the real-time analyzer or test synthetic brand perception trends.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/analyzer"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-blue-700 hover:bg-blue-50 shadow transition"
            >
              Analyze Text Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
