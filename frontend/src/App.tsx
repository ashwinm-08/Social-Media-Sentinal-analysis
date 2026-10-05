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
import { ProtectedRoute } from './components/ProtectedRoute';

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

              {/* Protected Operational & Dashboard Pages */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <AlertsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review-queue"
                element={
                  <ProtectedRoute>
                    <ReviewQueuePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/batch"
                element={
                  <ProtectedRoute>
                    <BatchAnalysisPage />
                  </ProtectedRoute>
                }
              />

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
