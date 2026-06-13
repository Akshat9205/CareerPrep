import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearningModules from "./pages/LearningModules";
import ModuleLesson from "./pages/ModuleLesson";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MockInterview from "./pages/MockInterview";
import NotFound from "./pages/NotFound";
import LoginChoice from "./pages/LoginChoice";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import InterviewScreen from "./pages/InterviewScreen";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import AboutUsPage from "./pages/AboutUsPage";
import ResumeAI from "./pages/ResumeAI";
import JobTracker from "./pages/JobTracker";

const queryClient = new QueryClient();

// Utility component to ensure page scrolls to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't scroll to top if navigating to a specific hash (handled separately)
    if (!window.location.hash) {
      // Use instant behavior so the user doesn't see the page forcefully zip up
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="careerprep-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login-choice" element={<LoginChoice />} />
            
            {/* User Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute><LearningModules /></ProtectedRoute>} />
            <Route path="/resume-builder" element={
              <ProtectedRoute>
                <ResumeAI />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <JobTracker />
              </ProtectedRoute>
            } />
            <Route path="/interview" element={
              <ProtectedRoute>
                <InterviewScreen />
              </ProtectedRoute>
            } />
            <Route path="/module/:moduleId" element={
              <ProtectedRoute>
                <ModuleLesson />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
