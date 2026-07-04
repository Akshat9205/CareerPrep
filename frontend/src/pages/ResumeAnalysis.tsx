import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Building2, ArrowRight, CheckCircle2, Loader2, AlertCircle,
  FileText, Target, BarChart, Briefcase, TrendingUp, Star, Zap,
  ShieldCheck, XCircle, ChevronRight, Award, Brain, MapPin, Clock,
  Sparkles, Download, RefreshCw, ExternalLink
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

interface Company {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  brandColor?: string;
  requirements: {
    mustHaveSkills: string[];
    preferredSkills: string[];
  };
}

interface AnalysisResult {
  analysisId: string;
  matchScores: {
    overall: number;
    skills: number;
    projects: number;
    certifications: number;
    experience: number;
    education: number;
  };
  analysis: {
    strengths: { category: string; items: string[]; description: string }[];
    weaknesses: { category: string; items: string[]; description: string; severity: string }[];
    missingSkills: string[];
    missingProjects: { type: string; description: string; priority: string }[];
    missingCertifications: string[];
    improvementSuggestions: { area: string; suggestion: string; priority: string; estimatedTime: string }[];
  };
  aiInsights: {
    summary: string;
    keyHighlights: string[];
    redFlags: string[];
    recommendations: string[];
  };
  skillGap: {
    matched: string[];
    partiallyMatched: string[];
    missing: string[];
    additional: string[];
  };
  readiness: {
    current: number;
    target: number;
    gap: number;
  };
  internships: {
    title: string;
    company: string;
    location?: { city?: string; country?: string; remote?: boolean };
    applyLink?: string;
    isTargetCompany?: boolean;
    matchAnalysis?: { matchScore: number; relevanceReason?: string };
    skills?: string[];
    salary?: string;
    source?: string;
  }[];
  company: { id: string; name: string; logo: string };
}

const SCAN_STEPS = [
  { label: 'Uploading resume', icon: Upload },
  { label: 'Parsing content', icon: Brain },
  { label: 'Calculating match score', icon: BarChart },
  { label: 'Running AI analysis', icon: Sparkles },
  { label: 'Fetching internships', icon: Briefcase },
];

const ScoreGauge = ({ score, size = 160 }: { score: number; size?: number }) => {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="12"
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
};

const ResumeAnalysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companySlug = searchParams.get('company');
  const { user } = useAuth();

  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyPicker, setShowCompanyPicker] = useState(!companySlug);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!companySlug || companies.length === 0) return;

    const normalizedSlug = companySlug.toLowerCase().replace(/[\s-]+/g, '');
    const match = companies.find((company) => {
      const normalizedName = company.name.toLowerCase().replace(/[\s-]+/g, '');
      return normalizedName === normalizedSlug || company.name.toLowerCase() === companySlug.toLowerCase();
    });

    if (match) {
      setSelectedCompany(match);
      setShowCompanyPicker(false);
    }
  }, [companySlug, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/companies`);
      const data = await response.json();
      if (data.success) setCompanies(data.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const getAuthHeaders = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (user) {
      // Try to get Firebase ID token, fall back to x-uid header
      try {
        const token = await (user as any).getIdToken?.();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch {
        // fallback
      }
      headers['x-uid'] = user.uid;
      headers['x-email'] = user.email || '';
    }
    return headers;
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const validateAndSetFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx|doc)$/i)) {
      setError('Only PDF and DOCX files are allowed'); return;
    }
    setFile(f);
    setError(null);
  };

  const advanceScanStep = (targetStep: number) => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < targetStep) {
        current++;
        setScanStep(current);
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  };

  const handleAnalyze = async () => {
    if (!selectedCompany || !file) { setError('Please select a company and upload your resume'); return; }
    setLoading(true);
    setError(null);
    setStep('analyzing');
    setScanStep(0);

    try {
      const authHeaders = await getAuthHeaders();
      
      // Step 1: Upload
      const formData = new FormData();
      formData.append('resume', file);
      setScanStep(1);

      const uploadResponse = await fetch(`${API_URL}/api/resume/upload`, {
        method: 'POST',
        headers: authHeaders,
        body: formData
      });
      const uploadData = await uploadResponse.json();
      if (!uploadData.success) throw new Error(uploadData.message || 'Upload failed');

      setScanStep(2);
      
      // Step 2-4: Analyze
      const analyzeResponse = await fetch(`${API_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ companyId: selectedCompany._id, resumeId: uploadData.data.resumeId })
      });

      setScanStep(3);
      const analyzeData = await analyzeResponse.json();
      if (!analyzeData.success) throw new Error(analyzeData.message || 'Analysis failed');

      setScanStep(4);
      await new Promise(r => setTimeout(r, 500));
      setScanStep(5);
      await new Promise(r => setTimeout(r, 400));

      setAnalysisResult(analyzeData.data);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!analysisResult?.analysisId) {
      toast.error('Analysis data missing. Please analyze your resume again.');
      return;
    }
    if (!user) {
      toast.error('Please log in to generate your roadmap.');
      return;
    }

    setRoadmapLoading(true);
    setError(null);
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ resumeAnalysisId: analysisResult.analysisId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Roadmap generated successfully!');
        navigate('/roadmap', { state: { roadmap: data.data } });
      } else {
        const message = data.message || 'Failed to generate roadmap';
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
      const message = 'Failed to generate roadmap. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 45) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500/10 border-green-500/30';
    if (score >= 45) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Moderate';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container-custom max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary tracking-wide">AI-Powered Analysis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
              Match Your Resume to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">
                Your Dream Company
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and get deep AI analysis, company-specific match scores, skill gap insights, and real-time internship recommendations.
            </p>
          </motion.div>

          {/* ── STEP 1: Upload & Company Selection ── */}
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Company Selection */}
                <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      {showCompanyPicker ? 'Select Target Company' : 'Target Company'}
                    </h2>
                    {!showCompanyPicker && selectedCompany && (
                      <button
                        onClick={() => setShowCompanyPicker(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Change company
                      </button>
                    )}
                  </div>

                  {!showCompanyPicker && selectedCompany ? (
                    <div
                      className="flex items-center gap-4 p-4 rounded-xl border-2"
                      style={{
                        borderColor: selectedCompany.brandColor || '#6366f1',
                        background: `linear-gradient(135deg, ${selectedCompany.brandColor || '#6366f1'}18, ${selectedCompany.brandColor || '#6366f1'}08)`
                      }}
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10">
                        <img
                          src={selectedCompany.logo}
                          alt={selectedCompany.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedCompany.name}&background=random`; }}
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{selectedCompany.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Resume analysis, internships, and roadmap will be tailored only for {selectedCompany.name}.
                        </p>
                      </div>
                    </div>
                  ) : companies.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                      <span className="text-muted-foreground">Loading companies...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {companies.map((company) => {
                        const isSelected = selectedCompany?._id === company._id;
                        const brandColor = company.brandColor || '#6366f1';
                        return (
                          <motion.button
                            key={company._id}
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowCompanyPicker(false);
                            }}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                              isSelected
                                ? 'border-primary shadow-lg shadow-primary/20'
                                : 'border-border/40 hover:border-border bg-muted/20 hover:bg-muted/40'
                            }`}
                            style={isSelected ? {
                              background: `linear-gradient(135deg, ${brandColor}18, ${brandColor}08)`,
                              borderColor: brandColor,
                              boxShadow: `0 4px 20px ${brandColor}25`
                            } : {}}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: brandColor }}
                              >
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10">
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=random`; }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-foreground text-center leading-tight">{company.name}</span>
                            <span className="text-[10px] text-muted-foreground text-center">{company.industry}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl">
                  <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Your Resume for {selectedCompany?.name || 'Selected Company'}
                  </h2>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? 'border-primary bg-primary/10 scale-[1.01]'
                        : file
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    />

                    <AnimatePresence mode="wait">
                      {file ? (
                        <motion.div
                          key="file-selected"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-3"
                        >
                          <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-2xl flex items-center justify-center">
                            <FileText className="w-8 h-8 text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="text-xs text-red-400 hover:text-red-300 underline"
                          >
                            Remove file
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload-prompt"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {isDragging ? 'Drop it here!' : 'Drag & drop or click to upload'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">PDF or DOCX · Max 5MB</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Analyze Button */}
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!selectedCompany || !file || loading}
                    whileHover={(!selectedCompany || !file) ? {} : { scale: 1.02 }}
                    whileTap={(!selectedCompany || !file) ? {} : { scale: 0.98 }}
                    className="w-full mt-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: selectedCompany && file
                        ? `linear-gradient(135deg, ${selectedCompany?.brandColor || '#6366f1'}, ${selectedCompany?.brandColor ? selectedCompany.brandColor + 'aa' : '#8b5cf6'})`
                        : 'rgba(99,102,241,0.3)',
                      boxShadow: selectedCompany && file
                        ? `0 4px 24px ${selectedCompany?.brandColor || '#6366f1'}40`
                        : 'none'
                    }}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Analyze Resume for {selectedCompany?.name || 'Company'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Analyzing (Scan Animation) ── */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-xl mx-auto"
              >
                <div className="glass-card p-10 rounded-2xl border border-primary/20 backdrop-blur-xl text-center">
                  {/* Animated logo */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border-2 border-primary/50"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                    />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                      {selectedCompany?.logo ? (
                        <img src={selectedCompany.logo} alt="" className="w-10 h-10 object-contain" />
                      ) : (
                        <Brain className="w-10 h-10 text-primary" />
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-2 text-foreground">Analyzing Your Resume</h2>
                  <p className="text-muted-foreground mb-10">
                    Matching against <strong className="text-foreground">{selectedCompany?.name}</strong>'s requirements...
                  </p>

                  <div className="space-y-3 text-left">
                    {SCAN_STEPS.map((s, idx) => {
                      const Icon = s.icon;
                      const done = scanStep > idx;
                      const active = scanStep === idx + 1;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: idx < scanStep + 1 ? 1 : 0.35, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            active ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            done ? 'bg-green-500/20' : active ? 'bg-primary/20' : 'bg-muted/50'
                          }`}>
                            {done
                              ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                              : active
                              ? <Loader2 className="w-4 h-4 text-primary animate-spin" />
                              : <Icon className="w-4 h-4 text-muted-foreground" />
                            }
                          </div>
                          <span className={`text-sm font-medium ${
                            done ? 'text-green-400' : active ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {s.label}
                          </span>
                          {done && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="ml-auto text-xs text-green-500"
                            >
                              Done
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Results ── */}
            {step === 'results' && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Top bar: Company info + Reset */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={analysisResult.company.logo}
                      alt={analysisResult.company.name}
                      className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1"
                    />
                    <div>
                      <h2 className="font-bold text-lg text-foreground">{analysisResult.company.name}</h2>
                      <p className="text-sm text-muted-foreground">Analysis Complete</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setStep('upload'); setAnalysisResult(null); setFile(null); setError(null); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Analyze Again
                  </button>
                </div>

                {/* Match Score Hero */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-2xl border border-border/50 backdrop-blur-xl overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Circular gauge */}
                    <div className="relative shrink-0">
                      <ScoreGauge score={analysisResult.matchScores.overall} size={160} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={`text-4xl font-bold ${getScoreColor(analysisResult.matchScores.overall)}`}
                        >
                          {analysisResult.matchScores.overall}%
                        </motion.span>
                        <span className="text-xs text-muted-foreground mt-1">Overall Match</span>
                      </div>
                    </div>

                    {/* Score breakdown */}
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold text-foreground">Match Analysis</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getScoreBg(analysisResult.matchScores.overall)} ${getScoreColor(analysisResult.matchScores.overall)}`}>
                          {getScoreLabel(analysisResult.matchScores.overall)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-5">{analysisResult.aiInsights?.summary}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: 'Skills', score: analysisResult.matchScores.skills },
                          { label: 'Projects', score: analysisResult.matchScores.projects },
                          { label: 'Experience', score: analysisResult.matchScores.experience },
                          { label: 'Education', score: analysisResult.matchScores.education },
                        ].map(({ label, score }) => (
                          <div key={label} className={`p-3 rounded-xl border ${getScoreBg(score)}`}>
                            <p className="text-xs text-muted-foreground mb-1">{label}</p>
                            <p className={`text-xl font-bold ${getScoreColor(score)}`}>{score}%</p>
                            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl border border-green-500/20 backdrop-blur-xl"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                      <ShieldCheck className="w-5 h-5" />
                      Strengths
                    </h3>
                    {analysisResult.analysis.strengths.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No strengths detected yet. Add more relevant skills to your resume.</p>
                    ) : (
                      <div className="space-y-3">
                        {analysisResult.analysis.strengths.map((s, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.08 }}
                            className="p-3 rounded-xl bg-green-500/5 border border-green-500/15"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-3.5 h-3.5 text-green-400 shrink-0" />
                              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">{s.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {s.items.map((item, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-green-500/15 text-green-300 border border-green-500/20">
                                  {item}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{s.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Weaknesses */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl border border-red-500/20 backdrop-blur-xl"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                      <XCircle className="w-5 h-5" />
                      Areas to Improve
                    </h3>
                    {analysisResult.analysis.weaknesses.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Great! No major weaknesses detected.</p>
                    ) : (
                      <div className="space-y-3">
                        {analysisResult.analysis.weaknesses.map((w, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.08 }}
                            className={`p-3 rounded-xl border ${
                              w.severity === 'high'
                                ? 'bg-red-500/5 border-red-500/20'
                                : 'bg-amber-500/5 border-amber-500/20'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${w.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                              <span className={`text-xs font-semibold uppercase tracking-wider ${w.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                                {w.category} · {w.severity}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {w.items.map((item, i) => (
                                <span key={i} className={`px-2 py-0.5 text-xs rounded-full border ${
                                  w.severity === 'high'
                                    ? 'bg-red-500/15 text-red-300 border-red-500/20'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/20'
                                }`}>
                                  {item}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{w.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Skill Gap Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Skill Gap Analysis
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-green-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Matched Skills ({analysisResult.skillGap.matched.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skillGap.matched.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No matched skills found</p>
                        ) : analysisResult.skillGap.matched.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-amber-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Partial Match ({analysisResult.skillGap.partiallyMatched?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(analysisResult.skillGap.partiallyMatched || []).length === 0 ? (
                          <p className="text-xs text-muted-foreground">None</p>
                        ) : (analysisResult.skillGap.partiallyMatched || []).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-red-400 flex items-center gap-2">
                        <XCircle className="w-4 h-4" /> Missing Skills ({analysisResult.skillGap.missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skillGap.missing.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No missing skills!</p>
                        ) : analysisResult.skillGap.missing.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Missing Certifications */}
                {analysisResult.analysis.missingCertifications?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Recommended Certifications
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {analysisResult.analysis.missingCertifications.map((cert, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20"
                        >
                          <Award className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-purple-300 font-medium">{cert}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Key Highlights & Recommendations */}
                <div className="grid md:grid-cols-2 gap-6">
                  {analysisResult.aiInsights.keyHighlights.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-card p-6 rounded-2xl border border-border/50"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        Key Highlights
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.aiInsights.keyHighlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {analysisResult.aiInsights.recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="glass-card p-6 rounded-2xl border border-border/50"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Top Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {analysisResult.aiInsights.recommendations.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                {/* Internship Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Internships for {analysisResult.company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Matched to your skill gaps and target company requirements
                  </p>

                  {(() => {
                    const companyInternships = (analysisResult.internships || []).filter((internship) =>
                      internship.isTargetCompany ||
                      internship.company?.toLowerCase() === analysisResult.company.name.toLowerCase()
                    );

                    return companyInternships.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {companyInternships.slice(0, 6).map((internship, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 + idx * 0.06 }}
                          className="p-4 rounded-xl border transition-all group bg-primary/5 border-primary/30 hover:border-primary/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
                                  {analysisResult.company.name}
                                </span>
                              </div>
                              <h4 className="font-semibold text-foreground text-sm truncate">{internship.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{internship.company}</p>
                            </div>
                            {internship.matchAnalysis?.matchScore != null && (
                              <div className={`shrink-0 ml-3 px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreBg(internship.matchAnalysis.matchScore)} ${getScoreColor(internship.matchAnalysis.matchScore)}`}>
                                {internship.matchAnalysis.matchScore}%
                              </div>
                            )}
                          </div>

                          {internship.matchAnalysis?.relevanceReason && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {internship.matchAnalysis.relevanceReason}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            {internship.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {internship.location.remote ? 'Remote' : `${internship.location.city || ''} ${internship.location.country || ''}`.trim()}
                              </span>
                            )}
                          </div>

                          {internship.skills && internship.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {internship.skills.slice(0, 3).map((skill, si) => (
                                <span key={si} className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary border border-primary/20">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {internship.applyLink && (
                            <a
                              href={internship.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline group-hover:gap-2 transition-all"
                            >
                              Apply Now <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No {analysisResult.company.name} internships found right now. Try analyzing again later.</p>
                    </div>
                  );
                  })()}
                </motion.div>

                {/* Generate Roadmap CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative overflow-hidden rounded-2xl border border-primary/30 p-8 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 pointer-events-none" />
                  <div className="relative z-10">
                    {error && (
                      <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-left max-w-md mx-auto">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Ready for the Next Step?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Generate a personalized {analysisResult.readiness.gap > 0 ? `${analysisResult.readiness.gap}% gap-closing` : ''} career roadmap with milestones, resources, and projects tailored to {analysisResult.company.name}.
                    </p>
                    <motion.button
                      onClick={handleGenerateRoadmap}
                      disabled={roadmapLoading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-60"
                    >
                      {roadmapLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating Roadmap...</>
                      ) : (
                        <><TrendingUp className="w-5 h-5" /> Generate My Personalized Roadmap <ArrowRight className="w-5 h-5" /></>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalysis;
