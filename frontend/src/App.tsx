import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, Footer } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LiveAnalyzerPage } from './pages/LiveAnalyzerPage';

// Placeholder views for subsequent phases
const PlaceholderPage: React.FC<{ title: string; phase: string }> = ({ title, phase }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
    <p className="mt-2 text-slate-500">Scheduled for implementation in {phase}.</p>
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyzer" element={<LiveAnalyzerPage />} />
              <Route path="/dashboard" element={<PlaceholderPage title="Executive Perception Dashboard" phase="Phase 3" />} />
              <Route path="/alerts" element={<PlaceholderPage title="Spike Detection & Root Cause Alerts" phase="Phase 4" />} />
              <Route path="/review-queue" element={<PlaceholderPage title="Human-in-the-Loop Review Queue" phase="Phase 4" />} />
              <Route path="/compare" element={<PlaceholderPage title="Competitive Brand Compare" phase="Phase 3" />} />
              <Route path="/batch" element={<PlaceholderPage title="Batch CSV Sentiment Analysis" phase="Phase 4" />} />
              <Route path="/about" element={<PlaceholderPage title="Methodology & Architecture Details" phase="Phase 5" />} />
              <Route path="/login" element={<PlaceholderPage title="Security & Authentication" phase="Phase 5" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
