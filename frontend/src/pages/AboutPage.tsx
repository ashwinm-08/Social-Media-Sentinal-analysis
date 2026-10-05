import { BookOpen, Cpu, ShieldCheck, Scale, AlertCircle } from 'lucide-react';


export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          Academic & Engineering Documentation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Methodology & Project Architecture
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Comprehensive review of model architectures, evaluation metrics, statistical spike formulation, and ethical safeguards for "Social Media Sentiment Intelligence for Product Perception Modeling".
        </p>
      </div>

      {/* Model Architectures Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-600" />
          1. Model Architectures & Pipeline Design
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Baseline (VADER & Naive Bayes)</h3>
            <p>
              Provides fast heuristic lexicon benchmarking with deterministic sentiment scoring. Effective for preliminary screening but limited in detecting syntactical nuances and contextual negation.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recurrent Models (Bi-LSTM)</h3>
            <p>
              Captures sequential token dependencies and long-distance sentiment inversion. Trained on GloVe/Word2Vec word embeddings to understand sentence syntax.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transformers (BERT & RoBERTa)</h3>
            <p>
              Pre-trained bidirectional representations fine-tuned for aspect-based sentiment classification (ABSC). Uses self-attention heads to assign localized sentiment polarities to specific product features.
            </p>
          </div>
        </div>
      </div>

      {/* Measured Results Placeholder - STRICT REQUIREMENT: No invented numbers */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="h-5 w-5 text-indigo-600" />
          2. Empirical Evaluation & Benchmarks
        </h2>
        <p className="text-xs text-slate-500">
          Standard classification metrics: Accuracy, Macro F1-Score, Aspect Extraction Precision, and Sarcasm Detection AUC-ROC.
        </p>

        {/* Clearly marked placeholder area */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/80 bg-amber-50/40 dark:bg-amber-950/20 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            [PLACEHOLDER: Empirical Experimental Results to be Inserted]
          </h3>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 max-w-xl mx-auto">
            Note: Per academic integrity guidelines, no synthetic or invented accuracy numbers are displayed here. Measured test set evaluation numbers from the final PyTorch/Transformers training runs will be populated upon model training completion.
          </p>
        </div>
      </div>

      {/* Ethics & Privacy */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          3. Ethical Governance & Data Hygiene
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">Public Data Only:</h4>
            <p>
              The system operates exclusively on publicly accessible social media posts, discussion threads, and customer feedback with no personal identification metadata retained.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">Author Anonymization:</h4>
            <p>
              Usernames, author handles, and PII are stripped or pseudonymized prior to inference and database storage to respect individual user privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
