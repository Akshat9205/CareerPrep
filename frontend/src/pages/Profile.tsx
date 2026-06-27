import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User, Mail, LogOut, Settings, Award, BookOpen, Clock, Camera, Check, X, Loader2,
  PlayCircle, CheckCircle2, Quote, Flame, Target, TrendingUp, FileText, Briefcase,
  BarChart2, Sparkles, Calendar, Zap, ChevronRight, RefreshCw, Mic, MapPin,
  Sun, Moon, Sunrise, Sunset, Shield, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Activity {
  id: string;
  type: 'module' | 'interview' | 'resume' | 'roadmap';
  title: string;
  subtitle: string;
  progress?: number;
  score?: number;
  completed?: boolean;
  timestamp: string;
}

interface ResumeAnalysisItem {
  _id: string;
  matchScores?: { overall: number; skills?: number; projects?: number; experience?: number };
  companyId?: { name: string; logo?: string; brandColor?: string };
  readiness?: { current: number; target: number; gap: number };
  skillGap?: { matched?: string[]; missing?: string[]; partiallyMatched?: string[] };
  analysis?: { missingSkills?: string[]; improvementSuggestions?: { suggestion: string; priority: string }[] };
  createdAt: string;
}

interface ModuleProgress {
  moduleId: string;
  progressPercentage: number;
  isCompleted: boolean;
  lastAccessed?: string;
}

const getTimeGreeting = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: Sunrise, emoji: '🌅', tip: 'Start strong — a module today keeps interview anxiety away.' };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: Sun, emoji: '☀️', tip: 'Perfect time to practice mock interviews or refine your resume.' };
  if (hour >= 17 && hour < 21) return { text: 'Good evening', icon: Sunset, emoji: '🌆', tip: 'Wind down with learning or review your career roadmap.' };
  return { text: 'Good night', icon: Moon, emoji: '🌙', tip: 'Light revision before sleep helps concepts stick better.' };
};

const formatClock = (date: Date) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

interface InterviewItem {
  _id: string;
  role: string;
  difficulty: string;
  overallScore: number;
  completedAt: string;
}

interface RoadmapData {
  target?: { company: string; targetMatchScore: number };
  progress?: { overallProgress: number; completedTasks: number; totalTasks: number };
  currentStatus?: { readiness: number; estimatedTimeline: string };
}

const formatModuleTitle = (id: string) =>
  id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    modulesDone: 0,
    modulesInProgress: 0,
    totalModules: 0,
    hoursLearned: 0,
    mockInterviews: 0,
    avgInterviewScore: 0,
    streak: 1,
    resumeAnalyses: 0,
    bestMatchScore: 0,
    roadmapProgress: 0,
    memberSince: '',
    lastLogin: ''
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<ResumeAnalysisItem[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<InterviewItem[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'career'>('overview');
  const [now, setNow] = useState(() => new Date());
  const [allModules, setAllModules] = useState<ModuleProgress[]>([]);
  const [publishedModulesCount, setPublishedModulesCount] = useState(0);
  const [latestAnalysis, setLatestAnalysis] = useState<ResumeAnalysisItem | null>(null);
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getAuthHeaders = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (user) {
      try {
        const token = await (user as any).getIdToken?.();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch { /* fallback */ }
      headers['x-uid'] = user.uid;
      headers['x-email'] = user.email || '';
    }
    return headers;
  }, [user]);

  const fetchUserStats = useCallback(async (silent = false) => {
    if (!user?.uid) return;
    try {
      if (!silent) setIsLoadingStats(true);
      else setIsRefreshing(true);

      const authHeaders = await getAuthHeaders();
      const [progressRes, userRes, interviewRes, analysisRes, roadmapRes, modulesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/progress/${user.uid}`),
        fetch(`http://localhost:5000/api/users/${user.uid}`),
        fetch(`http://localhost:5000/api/interviews/${user.uid}`),
        fetch(`http://localhost:5000/api/resume/analysis/${user.uid}`, { headers: authHeaders }),
        fetch(`http://localhost:5000/api/roadmap/${user.uid}`, { headers: authHeaders }),
        fetch(`http://localhost:5000/api/modules`)
      ]);

      const [progressData, userData, interviewData, analysisData, roadmapData, modulesData] = await Promise.all([
        progressRes.json(),
        userRes.json(),
        interviewRes.json(),
        analysisRes.json().catch(() => ({ success: false, data: [] })),
        roadmapRes.json().catch(() => ({ success: false })),
        modulesRes.json().catch(() => ({ success: false, modules: [] }))
      ]);

      const publishedCount = modulesData.success ? (modulesData.modules?.length || 0) : 0;
      setPublishedModulesCount(publishedCount);

      const progressArray = progressData.progress || [];
      const completedCount = progressArray.filter((p: any) => p.isCompleted || p.progressPercentage >= 100).length;
      const inProgressCount = progressArray.filter((p: any) => !p.isCompleted && p.progressPercentage > 0).length;
      const interviews: InterviewItem[] = interviewData.success ? interviewData.interviews || [] : [];
      const analyses: ResumeAnalysisItem[] = analysisData.success ? analysisData.data || [] : [];
      const avgScore = interviews.length
        ? Math.round(interviews.reduce((s, i) => s + i.overallScore, 0) / interviews.length)
        : 0;
      const bestMatch = analyses.length
        ? Math.max(...analyses.map(a => a.matchScores?.overall || 0))
        : 0;

      let roadmapInfo: RoadmapData | null = null;
      if (roadmapData.success && roadmapData.data) {
        roadmapInfo = roadmapData.data;
        setRoadmap(roadmapData.data);
      } else {
        setRoadmap(null);
      }

      setRecentAnalyses(analyses.slice(0, 5));
      setRecentInterviews(interviews.slice(0, 5));
      setLatestAnalysis(analyses[0] || null);
      setAllModules(progressArray.map((p: any) => ({
        moduleId: p.moduleId,
        progressPercentage: p.progressPercentage || 0,
        isCompleted: p.isCompleted || p.progressPercentage >= 100,
        lastAccessed: p.lastAccessed
      })));

      const dbUser = userData.success ? userData.user : null;
      if (dbUser) {
        setBio(dbUser.bio || "");
        if (dbUser.photoURL) setPhotoURL(dbUser.photoURL);
      }

      setStats({
        modulesDone: completedCount,
        modulesInProgress: inProgressCount,
        totalModules: progressArray.length,
        hoursLearned: Math.round(completedCount * 1.5 + inProgressCount * 0.5),
        mockInterviews: interviews.length,
        avgInterviewScore: avgScore,
        streak: dbUser?.streak || 1,
        resumeAnalyses: analyses.length,
        bestMatchScore: bestMatch,
        roadmapProgress: roadmapInfo?.progress?.overallProgress || 0,
        memberSince: dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
        lastLogin: dbUser?.lastLogin ? timeAgo(dbUser.lastLogin) : 'Recently'
      });

      const mergedActivities: Activity[] = [
        ...progressArray.map((p: any) => ({
          id: `mod-${p.moduleId}`,
          type: 'module' as const,
          title: formatModuleTitle(p.moduleId),
          subtitle: p.isCompleted ? 'Module completed' : `${p.progressPercentage}% complete`,
          progress: p.progressPercentage,
          completed: p.isCompleted || p.progressPercentage >= 100,
          timestamp: p.lastAccessed || p.updatedAt
        })),
        ...interviews.map((i: InterviewItem) => ({
          id: `int-${i._id}`,
          type: 'interview' as const,
          title: `${i.role} Mock Interview`,
          subtitle: `${i.difficulty} · Score ${i.overallScore}%`,
          score: i.overallScore,
          completed: true,
          timestamp: i.completedAt
        })),
        ...analyses.map((a: ResumeAnalysisItem) => ({
          id: `res-${a._id}`,
          type: 'resume' as const,
          title: `Resume vs ${a.companyId?.name || 'Company'}`,
          subtitle: `${a.matchScores?.overall || 0}% match score`,
          score: a.matchScores?.overall,
          completed: true,
          timestamp: a.createdAt
        }))
      ]
        .filter(a => a.timestamp)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15);

      setActivities(mergedActivities);

      const weekCounts = Array(7).fill(0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      mergedActivities.forEach(act => {
        const d = new Date(act.timestamp);
        d.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays < 7) weekCounts[6 - diffDays] += 1;
      });
      setWeeklyActivity(weekCounts);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    } finally {
      setIsLoadingStats(false);
      setIsRefreshing(false);
    }
  }, [user, getAuthHeaders]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      if (!photoURL) setPhotoURL(user.photoURL || "");
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const clearPhotoPreview = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview("");
    setPendingFile(null);
  };

  const openPhotoPicker = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!user?.uid) return;
    const interval = setInterval(() => fetchUserStats(true), 30000);
    const onFocus = () => fetchUserStats(true);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.uid, fetchUserStats]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Loading profile...</p>
      </div>
    );
  }

  const displayPhoto = photoPreview || photoURL || user.photoURL || '';

  const profileCompletion = Math.min(100, [
    user.displayName ? 25 : 0,
    bio ? 20 : 0,
    displayPhoto ? 20 : 0,
    user.email ? 15 : 0,
    stats.modulesDone > 0 ? 10 : 0,
    stats.mockInterviews > 0 ? 10 : 0
  ].reduce((a, b) => a + b, 0));

  const achievements = [
    { id: 'first-module', title: 'Fast Learner', desc: 'Complete your first module', earned: stats.modulesDone > 0, icon: BookOpen, color: 'text-indigo-400' },
    { id: 'streak', title: 'On Fire', desc: '3+ day learning streak', earned: stats.streak >= 3, icon: Flame, color: 'text-orange-400' },
    { id: 'interview', title: 'Interview Ready', desc: 'Complete a mock interview', earned: stats.mockInterviews > 0, icon: Mic, color: 'text-emerald-400' },
    { id: 'resume', title: 'Resume Pro', desc: 'Analyze resume for a company', earned: stats.resumeAnalyses > 0, icon: FileText, color: 'text-blue-400' },
    { id: 'match', title: 'Strong Match', desc: 'Score 70%+ company match', earned: stats.bestMatchScore >= 70, icon: Target, color: 'text-purple-400' },
    { id: 'roadmap', title: 'Path Finder', desc: 'Generate a career roadmap', earned: stats.roadmapProgress > 0 || !!roadmap, icon: TrendingUp, color: 'text-pink-400' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    clearPhotoPreview();
    setPendingFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success("Photo selected! Click Save to update your profile.");
    e.target.value = '';
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      let finalPhotoURL = photoURL;

      if (pendingFile) {
        const formData = new FormData();
        formData.append('avatar', pendingFile);
        formData.append('uid', user.uid);
        formData.append('email', user.email || '');

        const uploadRes = await fetch('http://localhost:5000/api/users/avatar', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.message || 'Failed to upload photo');
        }
        finalPhotoURL = uploadData.photoURL;
      }

      if (updateUserProfile) {
        await updateUserProfile(displayName.trim(), finalPhotoURL, bio.trim());
        setPhotoURL(finalPhotoURL);
        clearPhotoPreview();
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchUserStats(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (user.displayName) return user.displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    return user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  };

  const hour = now.getHours();
  const timeGreeting = getTimeGreeting(now);
  const GreetingIcon = timeGreeting.icon;
  const firstName = user.displayName?.split(' ')[0] || 'there';

  const overallLearningPercent = publishedModulesCount > 0
    ? Math.round((stats.modulesDone / publishedModulesCount) * 100)
    : stats.totalModules > 0
      ? Math.round((stats.modulesDone / stats.totalModules) * 100)
      : 0;

  const careerScore = Math.round(
    (overallLearningPercent * 0.25) +
    (Math.min(stats.avgInterviewScore, 100) * 0.25) +
    (Math.min(stats.bestMatchScore, 100) * 0.25) +
    (Math.min(stats.roadmapProgress, 100) * 0.25)
  );

  const todaysFocus = (() => {
    if (stats.modulesInProgress > 0) return { title: 'Continue Learning', desc: 'You have modules in progress — finish one today.', path: '/learning', icon: BookOpen };
    if (stats.resumeAnalyses === 0) return { title: 'Analyze Resume', desc: 'Upload your resume and check company match score.', path: '/resume-analysis', icon: Target };
    if (stats.mockInterviews === 0) return { title: 'Mock Interview', desc: 'Practice speaking confidently with AI interviewer.', path: '/mock-interview', icon: Mic };
    if (!roadmap) return { title: 'Build Roadmap', desc: 'Generate a personalized career plan for your target company.', path: '/resume-analysis', icon: TrendingUp };
    return { title: 'Keep Streak Alive', desc: `You're on a ${stats.streak}-day streak. Do one activity today!`, path: '/dashboard', icon: Flame };
  })();

  const weekDayLabels = (() => {
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
    }
    return labels;
  })();

  const missingSkills = latestAnalysis?.skillGap?.missing
    || latestAnalysis?.analysis?.missingSkills
    || [];

  const statCards = [
    { label: 'Modules Done', value: stats.modulesDone, sub: `${stats.modulesInProgress} in progress`, icon: BookOpen, color: 'from-indigo-500/20 to-purple-500/10', iconColor: 'text-indigo-400' },
    { label: 'Learning Hours', value: stats.hoursLearned, sub: 'estimated', icon: Clock, color: 'from-orange-500/20 to-amber-500/10', iconColor: 'text-orange-400' },
    { label: 'Mock Interviews', value: stats.mockInterviews, sub: stats.avgInterviewScore ? `avg ${stats.avgInterviewScore}%` : 'none yet', icon: Mic, color: 'from-emerald-500/20 to-teal-500/10', iconColor: 'text-emerald-400' },
    { label: 'Day Streak', value: stats.streak, sub: 'keep it going!', icon: Flame, color: 'from-red-500/20 to-orange-500/10', iconColor: 'text-orange-500' },
    { label: 'Resume Scans', value: stats.resumeAnalyses, sub: stats.bestMatchScore ? `best ${stats.bestMatchScore}%` : 'try one', icon: FileText, color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400' },
    { label: 'Roadmap', value: `${stats.roadmapProgress}%`, sub: roadmap?.target?.company || 'not started', icon: TrendingUp, color: 'from-pink-500/20 to-purple-500/10', iconColor: 'text-pink-400' },
    { label: 'Career Score', value: careerScore, sub: 'overall readiness', icon: Sparkles, color: 'from-violet-500/20 to-indigo-500/10', iconColor: 'text-violet-400' },
  ];

  const quickActions = [
    { label: 'Continue Learning', icon: BookOpen, path: '/learning', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { label: 'Resume Analysis', icon: Target, path: '/resume-analysis', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Mock Interview', icon: Mic, path: '/mock-interview', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'Career Roadmap', icon: TrendingUp, path: '/roadmap', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  ];

  const activityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'module': return BookOpen;
      case 'interview': return Mic;
      case 'resume': return FileText;
      case 'roadmap': return TrendingUp;
      default: return Zap;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />

      <main className="container-custom pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-border/50 glass-card">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div
                      className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-primary/30 overflow-hidden bg-muted shadow-xl ${isEditing ? 'cursor-pointer ring-2 ring-primary/20' : ''}`}
                      onClick={() => isEditing && openPhotoPicker()}
                    >
                      {displayPhoto ? (
                        <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {getInitials()}
                        </div>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <GreetingIcon className={`w-4 h-4 ${hour >= 5 && hour < 17 ? 'text-amber-400' : 'text-indigo-400'}`} />
                      <p className="text-sm font-medium text-muted-foreground">
                        {timeGreeting.emoji} {timeGreeting.text}, <span className="text-foreground">{firstName}</span>
                      </p>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      {user.displayName || 'CareerPrep User'}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(now)} · {formatClock(now)}</p>
                    <p className="text-sm text-primary/90 mt-2 max-w-md">{timeGreeting.tip}</p>
                    {bio && <p className="text-sm text-muted-foreground mt-2 italic max-w-md">"{bio}"</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                        <Sparkles className="w-3 h-3" /> Pro Member
                      </span>
                      {stats.streak > 1 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
                          <Flame className="w-3 h-3" /> {stats.streak} day streak
                        </span>
                      )}
                      {stats.memberSince && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> Member since {stats.memberSince}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-sm">
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
                        <circle cx="28" cy="28" r="24" stroke="#6366f1" strokeWidth="4" fill="none"
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - profileCompletion / 100)}`}
                          strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{profileCompletion}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Profile Strength</p>
                      <p className="text-xs text-muted-foreground">{profileCompletion < 100 ? 'Complete your profile' : 'All set!'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchUserStats(true)} disabled={isRefreshing}
                      className="rounded-xl gap-2 border-border/50">
                      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={handleLogout}
                      className="rounded-xl gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </div>
                </div>
              </div>

              {lastUpdated && (
                <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live data · Updated {timeAgo(lastUpdated.toISOString())}
                  {stats.lastLogin && ` · Last active ${stats.lastLogin}`}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {statCards.map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className={`glass-card border-border/50 rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform`}>
                  <CardContent className={`p-4 bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor} mb-3`} />
                    <p className="text-2xl font-extrabold leading-none">{stat.value}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">{stat.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Today's Focus + Weekly Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-primary/20 rounded-3xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <todaysFocus.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Today's Focus</p>
                  <p className="font-bold text-foreground">{todaysFocus.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{todaysFocus.desc}</p>
                </div>
                <Button size="sm" className="rounded-xl shrink-0" onClick={() => navigate(todaysFocus.path)}>
                  Go <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/50 rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">This Week's Activity</p>
                <div className="flex items-end justify-between gap-2 h-20">
                  {weeklyActivity.map((count, idx) => {
                    const max = Math.max(...weeklyActivity, 1);
                    const height = Math.max(8, (count / max) * 100);
                    const isToday = idx === 6;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground">{count || ''}</span>
                        <div className={`w-full rounded-t-md transition-all ${isToday ? 'bg-primary' : 'bg-primary/30'}`} style={{ height: `${height}%`, minHeight: count ? 8 : 4 }} />
                        <span className={`text-[10px] ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{weekDayLabels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['overview', 'activity', 'career'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted border border-border/30'
                }`}>
                {tab === 'overview' ? 'Overview' : tab === 'activity' ? 'Recent Activity' : 'Career Progress'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="space-y-6">
              {/* Edit Profile Card */}
              <Card className="glass-card border-border/50 rounded-3xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Personal Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                          <Mail className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm truncate">{user.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-muted/20 border border-border/20">
                            <p className="text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" /> Auth</p>
                            <p className="font-semibold mt-0.5 capitalize">{(user as any).providerData?.[0]?.providerId?.includes('google') ? 'Google' : 'Email'}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-muted/20 border border-border/20">
                            <p className="text-muted-foreground flex items-center gap-1"><Hash className="w-3 h-3" /> User ID</p>
                            <p className="font-semibold mt-0.5 truncate">{user.uid.slice(0, 10)}...</p>
                          </div>
                          {stats.memberSince && (
                            <div className="p-2.5 rounded-xl bg-muted/20 border border-border/20 col-span-2">
                              <p className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined</p>
                              <p className="font-semibold mt-0.5">{stats.memberSince} · Last active {stats.lastLogin}</p>
                            </div>
                          )}
                        </div>
                        {!bio && (
                          <p className="text-xs text-muted-foreground">Add a bio to boost your profile strength.</p>
                        )}
                        <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl gap-2 h-10">
                          <Settings className="w-4 h-4" /> Edit Profile
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative cursor-pointer group" onClick={openPhotoPicker}>
                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/30">
                              {displayPhoto ? (
                                <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted font-bold">{getInitials()}</div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                        <p className="text-center text-xs text-primary">Tap photo to change</p>
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Full name"
                          className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm focus:border-primary outline-none" />
                        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." rows={3}
                          className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary outline-none resize-none" />
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                              setIsEditing(false);
                              setDisplayName(user.displayName || "");
                              setPhotoURL(user.photoURL || "");
                              clearPhotoPreview();
                              fetchUserStats(true);
                            }} className="flex-1 rounded-xl" disabled={isSaving}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                          <Button type="submit" className="flex-1 rounded-xl bg-gradient-primary" disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass-card border-border/50 rounded-3xl">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" /> Achievements
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      {achievements.filter(a => a.earned).length}/{achievements.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {achievements.map(a => (
                    <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      a.earned ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-border/20 opacity-50'
                    }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                        <a.icon className={`w-4 h-4 ${a.earned ? a.color : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{a.title}</p>
                        <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                      </div>
                      {a.earned && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card border-border/50 rounded-3xl">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-2">
                  {quickActions.map(action => (
                    <button key={action.path} onClick={() => navigate(action.path)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center hover:scale-[1.02] transition-all ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                      <span className="text-[11px] font-semibold leading-tight">{action.label}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tab Content */}
            <div className="lg:col-span-2 space-y-6">

              {activeTab === 'overview' && (
                <>
                  {/* Career Snapshot */}
                  <Card className="glass-card border-border/50 rounded-3xl">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" /> Career Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center">
                          <p className="text-2xl font-extrabold text-violet-400">{careerScore}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Career Score</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                          <p className="text-2xl font-extrabold text-indigo-400">{overallLearningPercent}%</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Learning</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                          <p className="text-2xl font-extrabold text-blue-400">{stats.bestMatchScore || 0}%</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Best Match</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-2xl font-extrabold text-emerald-400">{stats.avgInterviewScore || 0}%</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Interview Avg</p>
                        </div>
                      </div>
                      {latestAnalysis && (
                        <div className="mt-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
                          <p className="text-sm font-semibold mb-2">
                            Latest target: {latestAnalysis.companyId?.name || 'Company'}
                            <span className="ml-2 text-primary">{latestAnalysis.matchScores?.overall || 0}% match</span>
                          </p>
                          {missingSkills.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Top skills to improve:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {missingSkills.slice(0, 6).map(skill => (
                                  <span key={skill} className="px-2 py-0.5 text-[11px] rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Learning Progress */}
                  <Card className="glass-card border-border/50 rounded-3xl">
                    <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-primary" /> Learning Progress
                      </CardTitle>
                      <button onClick={() => navigate('/learning')} className="text-xs text-primary hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent className="pt-5">
                      {isLoadingStats ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                      ) : stats.totalModules === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm font-medium mb-1">No modules started yet</p>
                          <p className="text-xs text-muted-foreground mb-4">Begin your learning journey today</p>
                          <Button onClick={() => navigate('/learning')} size="sm" className="rounded-xl">Start Learning</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Overall completion</span>
                            <span className="font-bold">{stats.modulesDone}/{publishedModulesCount || stats.totalModules} modules</span>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${overallLearningPercent}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }} />
                          </div>
                          {(allModules.length > 0 ? allModules : activities.filter(a => a.type === 'module').map(a => ({
                            moduleId: a.id.replace('mod-', ''),
                            progressPercentage: a.progress || 0,
                            isCompleted: a.completed || false
                          }))).slice(0, 6).map(mod => (
                            <div key={mod.moduleId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/20">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mod.isCompleted ? 'bg-emerald-500/20' : 'bg-primary/20'}`}>
                                {mod.isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : <BookOpen className="w-4 h-4 text-primary" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{formatModuleTitle(mod.moduleId)}</p>
                                <p className="text-xs text-muted-foreground">{mod.isCompleted ? 'Completed' : `${mod.progressPercentage}% complete`}</p>
                              </div>
                              {!mod.isCompleted && (
                                <span className="text-xs font-bold text-primary">{mod.progressPercentage}%</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Latest Resume Match */}
                  <Card className="glass-card border-border/50 rounded-3xl">
                    <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" /> Resume Match Scores
                      </CardTitle>
                      <button onClick={() => navigate('/resume-analysis')} className="text-xs text-primary hover:underline flex items-center gap-1">
                        Analyze <ChevronRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent className="pt-5">
                      {recentAnalyses.length === 0 ? (
                        <div className="text-center py-6">
                          <FileText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">No resume analyses yet</p>
                          <Button onClick={() => navigate('/resume-analysis')} size="sm" variant="outline" className="rounded-xl">
                            Upload Resume
                          </Button>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {recentAnalyses.map(a => (
                            <div key={a._id} className="p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-2 mb-3">
                                {a.companyId?.logo && (
                                  <img src={a.companyId.logo} alt="" className="w-6 h-6 object-contain" />
                                )}
                                <span className="text-sm font-bold truncate">{a.companyId?.name || 'Company'}</span>
                              </div>
                              <p className="text-3xl font-extrabold" style={{ color: a.companyId?.brandColor || '#6366f1' }}>
                                {a.matchScores?.overall || 0}%
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">Match score · {timeAgo(a.createdAt)}</p>
                              {a.readiness && (
                                <p className="text-[11px] text-muted-foreground mt-2">
                                  Gap to target: {a.readiness.gap}%
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === 'activity' && (
                <Card className="glass-card border-border/50 rounded-3xl">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Recent Activity
                      <span className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Live
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 max-h-[520px] overflow-y-auto">
                    {isLoadingStats ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
                    ) : activities.length === 0 ? (
                      <div className="text-center py-12">
                        <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="font-medium mb-1">Your journey starts here</p>
                        <p className="text-sm text-muted-foreground">Complete a module or mock interview to see activity</p>
                      </div>
                    ) : (
                      <div className="space-y-1 relative">
                        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-border/40" />
                        {activities.map((act, idx) => {
                          const Icon = activityIcon(act.type);
                          return (
                            <motion.div key={act.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                              className="flex gap-4 relative py-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-background z-10 ${
                                act.completed ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 pb-3 border-b border-border/20 last:border-none">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="font-semibold text-sm">{act.title}</h4>
                                  <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(act.timestamp)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{act.subtitle}</p>
                                {act.progress != null && !act.completed && (
                                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${act.progress}%` }} />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'career' && (
                <>
                  {/* Roadmap Progress */}
                  <Card className="glass-card border-border/50 rounded-3xl">
                    <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" /> Career Roadmap
                      </CardTitle>
                      <button onClick={() => navigate('/roadmap')} className="text-xs text-primary hover:underline flex items-center gap-1">
                        Open roadmap <ChevronRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent className="pt-5">
                      {!roadmap ? (
                        <div className="text-center py-8">
                          <MapPin className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm font-medium mb-1">No roadmap yet</p>
                          <p className="text-xs text-muted-foreground mb-4">Analyze your resume and generate a personalized plan</p>
                          <Button onClick={() => navigate('/resume-analysis')} size="sm" className="rounded-xl gap-2">
                            <Target className="w-4 h-4" /> Start Resume Analysis
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold">{roadmap.target?.company}</p>
                              <p className="text-xs text-muted-foreground">Target: {roadmap.target?.targetMatchScore}% match</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-extrabold text-primary">{roadmap.progress?.overallProgress || 0}%</p>
                              <p className="text-xs text-muted-foreground">complete</p>
                            </div>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                              style={{ width: `${roadmap.progress?.overallProgress || 0}%` }} />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-muted/20 border border-border/20 text-center">
                              <p className="text-lg font-bold">{roadmap.progress?.completedTasks || 0}</p>
                              <p className="text-[10px] text-muted-foreground">Tasks done</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/20 border border-border/20 text-center">
                              <p className="text-lg font-bold">{roadmap.progress?.totalTasks || 0}</p>
                              <p className="text-[10px] text-muted-foreground">Total tasks</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/20 border border-border/20 text-center">
                              <p className="text-lg font-bold">{roadmap.currentStatus?.readiness || 0}%</p>
                              <p className="text-[10px] text-muted-foreground">Readiness</p>
                            </div>
                          </div>
                          {roadmap.currentStatus?.estimatedTimeline && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Clock className="w-3 h-3" /> Estimated timeline: {roadmap.currentStatus.estimatedTimeline}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Interview History */}
                  <Card className="glass-card border-border/50 rounded-3xl">
                    <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Mic className="w-4 h-4 text-emerald-400" /> Mock Interview History
                      </CardTitle>
                      <button onClick={() => navigate('/mock-interview')} className="text-xs text-primary hover:underline flex items-center gap-1">
                        Practice <ChevronRight className="w-3 h-3" />
                      </button>
                    </CardHeader>
                    <CardContent className="pt-5">
                      {recentInterviews.length === 0 ? (
                        <div className="text-center py-6">
                          <PlayCircle className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">No mock interviews yet</p>
                          <Button onClick={() => navigate('/mock-interview')} size="sm" variant="outline" className="rounded-xl">
                            Start Mock Interview
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentInterviews.map(interview => (
                            <div key={interview._id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                                interview.overallScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                                interview.overallScore >= 45 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {interview.overallScore}%
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{interview.role}</p>
                                <p className="text-xs text-muted-foreground">{interview.difficulty} difficulty · {timeAgo(interview.completedAt)}</p>
                              </div>
                              <Briefcase className="w-4 h-4 text-muted-foreground/40" />
                            </div>
                          ))}
                          {stats.avgInterviewScore > 0 && (
                            <p className="text-xs text-center text-muted-foreground pt-2">
                              Average score across all interviews: <strong className="text-foreground">{stats.avgInterviewScore}%</strong>
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
