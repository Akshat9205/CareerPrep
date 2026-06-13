import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Zap, Target, 
  TrendingUp, Search, Download, RefreshCw,
  FileCheck, ShieldCheck, Star, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const ResumeAI = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const steps = [
    "Reading resume content...",
    "Analyzing structure & layout...",
    "Evaluating against ATS standards...",
    "Generating AI suggestions...",
    "Finalizing report..."
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(uploadedFile);
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Please upload a PDF or DOCX file.");
      }
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setShowResults(false);
    
    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 1500));
    }
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80 transition-all duration-300">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI Analyzer</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Optimize your resume for ATS and get personalized AI suggestions to land your dream job.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isAnalyzing && !showResults && (
                <div className="space-y-8">
                  {!file ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-card rounded-[2.5rem] border-dashed border-2 border-primary/20 p-12 text-center space-y-8"
                    >
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform cursor-pointer" onClick={() => document.getElementById('resume-upload')?.click()}>
                        <Upload className="w-10 h-10 text-primary group-hover:animate-bounce" />
                      </div>
                      <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-3">Upload your Resume</h2>
                        <p className="text-muted-foreground mb-8">
                          Drag and drop your file here, or click to browse. Supports PDF and DOCX formats.
                        </p>
                        <input 
                          type="file" 
                          id="resume-upload" 
                          className="hidden" 
                          accept=".pdf,.docx"
                          onChange={handleFileUpload}
                        />
                        <Button 
                          size="lg" 
                          className="rounded-2xl h-14 text-lg font-bold w-full"
                          onClick={() => document.getElementById('resume-upload')?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8"
                    >
                      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-primary/20 bg-muted/20 relative">
                        <div className="absolute top-6 right-6 z-10">
                          <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-md" onClick={removeFile}>
                            <X className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="p-8 pb-0 text-center">
                          <div className="flex items-center justify-center gap-3 mb-6">
                            <FileText className="w-8 h-8 text-primary" />
                            <h2 className="text-xl font-bold truncate max-w-xs">{file.name}</h2>
                          </div>
                        </div>

                        <div className="px-8 pb-8">
                          <div className="aspect-[1/1.4] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">
                            {filePreview ? (
                              <iframe src={filePreview} className="w-full h-full border-none" title="Resume Preview" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-12">
                                <FileCheck className="w-24 h-24 mb-4 opacity-20" />
                                <p className="font-bold text-lg">Preview not available for DOCX</p>
                                <p className="text-sm">Click analyze to process the content</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          size="lg"
                          onClick={startAnalysis}
                          className="rounded-2xl h-16 px-12 text-xl font-bold bg-gradient-primary shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                        >
                          Analyze with AI <Sparkles className="ml-2 w-6 h-6" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-[2.5rem] p-12 text-center space-y-10 py-24"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold animate-pulse">{steps[analysisStep]}</h2>
                    <Progress value={(analysisStep + 1) * 20} className="w-full max-w-sm mx-auto h-2" />
                    <p className="text-muted-foreground italic">Our AI is cross-referencing with 500+ job descriptions...</p>
                  </div>
                </motion.div>
              )}

              {showResults && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card rounded-3xl p-8 border-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target className="w-20 h-20" />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">ATS Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-primary">82</span>
                        <span className="text-2xl font-bold text-muted-foreground">/100</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <TrendingUp className="w-4 h-4" /> Strong Potential
                      </div>
                    </div>

                    <div className="glass-card rounded-3xl p-8 border-primary/20 md:col-span-2 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Analysis Summary</h3>
                          <p className="text-sm text-muted-foreground">Your resume has excellent formatting but lacks specific action verbs.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Key Strengths</p>
                          <p className="text-sm font-medium">Clear Hierarchy, Contact Info</p>
                        </div>
                        <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Missing</p>
                          <p className="text-sm font-medium">Keywords for 'React', 'Agile'</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions & Tips */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" /> Critical Improvements
                      </h3>
                      <div className="space-y-4">
                        {[
                          "Quantify your achievements (e.g., 'Improved performance by 30%')",
                          "Add a clear professional summary at the top",
                          "Use industry-standard section headings",
                          "Increase keyword density for Senior Developer roles"
                        ].map((tip, i) => (
                          <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4 border-l-4 border-l-yellow-500">
                            <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" /> Pro AI Tips
                      </h3>
                      <div className="space-y-4">
                        {[
                          "Include links to your GitHub and Portfolio",
                          "Avoid using complex multi-column layouts for ATS",
                          "Tailor your resume for each job description you apply to",
                          "Keep your resume under 2 pages for 10+ years of experience"
                        ].map((tip, i) => (
                          <div key={i} className="glass-card rounded-2xl p-4 flex items-start gap-4 border-l-4 border-l-primary">
                            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-2xl h-14 px-8"
                      onClick={() => removeFile()}
                    >
                      <RefreshCw className="mr-2 w-4 h-4" /> Re-upload
                    </Button>
                    <Button 
                      size="lg" 
                      className="rounded-2xl h-14 px-8 bg-gradient-primary"
                    >
                      <Download className="mr-2 w-4 h-4" /> Download Report
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeAI;
