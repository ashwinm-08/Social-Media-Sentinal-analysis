import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { Navbar, Footer } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LiveAnalyzerPage } from './pages/LiveAnalyzerPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrandComparePage } from './pages/BrandComparePage';
import { AlertsPage } from './pages/AlertsPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { BatchAnalysisPage } from './pages/BatchAnalysisPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';


export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyzer" element={<LiveAnalyzerPage />} />
              <Route path="/compare" element={<BrandComparePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* All operational views accessible */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/review-queue" element={<ReviewQueuePage />} />
              <Route path="/batch" element={<BatchAnalysisPage />} />


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
