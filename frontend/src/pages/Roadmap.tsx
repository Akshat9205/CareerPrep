import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, CheckCircle2, Circle, BookOpen, Code, Award,
  Target, TrendingUp, ChevronRight, ChevronDown, ExternalLink,
  Zap, Star, Rocket, BarChart2, Brain, ArrowLeft, Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

interface Task {
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: 'skill' | 'project' | 'certification' | 'practice';
  estimatedTime: string;
  resources: { type: string; title: string; link: string; duration: string }[];
  completed: boolean;
  completedAt?: Date;
}

interface Milestone {
  month: number;
  title: string;
  description: string;
  tasks: Task[];
  expectedOutcome: string;
  matchScoreImpact: number;
}

interface SkillPlan {
  skill: string;
  currentLevel: string;
  targetLevel: string;
  resources: { type: string; title: string; link: string; duration: string; difficulty: string }[];
  practiceProjects: string[];
  estimatedCompletionTime: string;
}

interface ProjectRecommendation {
  title: string;
  description: string;
  technologies: string[];
  complexity: string;
  estimatedTime: string;
  learningOutcomes: string[];
  githubTemplate?: string;
  priority: string;
}

interface CertificationRecommendation {
  name: string;
  issuer: string;
  description: string;
  link: string;
  cost: string;
  duration: string;
  difficulty: string;
  priority: string;
  validity: string;
}

interface RoadmapData {
  _id: string;
  target: { company: string; role: string; targetMatchScore: number };
  currentStatus: { readiness: number; estimatedTimeline: string; confidenceLevel: string };
  milestones: Milestone[];
  skillPlan: SkillPlan[];
  projectRecommendations: ProjectRecommendation[];
  certificationRecommendations: CertificationRecommendation[];
  aiInsights: { summary: string; keyChallenges: string[]; successFactors: string[] };
  progress: {
    totalMilestones: number;
    completedMilestones: number;
    totalTasks: number;
    completedTasks: number;
    overallProgress: number;
  };
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/25',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  low: 'text-green-400 bg-green-500/10 border-green-500/25',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  skill: <BookOpen className="w-4 h-4" />,
  project: <Code className="w-4 h-4" />,
  certification: <Award className="w-4 h-4" />,
  practice: <Target className="w-4 h-4" />,
};

const TABS = [
  { id: 'milestones', label: 'Milestones', icon: Calendar },
  { id: 'skills', label: 'Skill Plan', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'certifications', label: 'Certifications', icon: Award },
] as const;

const Roadmap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(location.state?.roadmap || null);
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'milestones' | 'skills' | 'projects' | 'certifications'>('milestones');
  const [fetching, setFetching] = useState(!location.state?.roadmap);

  useEffect(() => {
    if (!roadmap) fetchRoadmap();
  }, []);

  const getAuthHeaders = async () => {
    const headers: Record<string, string> = {};
    if (user) {
      try {
        const token = await (user as any).getIdToken?.();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch {}
      headers['x-uid'] = user.uid;
      headers['x-email'] = user.email || '';
    }
    return headers;
  };

  const fetchRoadmap = async () => {
    setFetching(true);
    try {
      const authHeaders = await getAuthHeaders();
      const userId = user?.uid || localStorage.getItem('userId');
      if (!userId) { setFetching(false); return; }
      const response = await fetch(`${API_URL}/api/roadmap/${userId}`, {
        headers: authHeaders
      });
      const data = await response.json();
      if (data.success) setRoadmap(data.data);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setFetching(false);
    }
  };

  const toggleTaskCompletion = (milestoneIndex: number, taskIndex: number) => {
    if (!roadmap) return;
    const newRoadmap = JSON.parse(JSON.stringify(roadmap)) as RoadmapData;
    newRoadmap.milestones[milestoneIndex].tasks[taskIndex].completed =
      !newRoadmap.milestones[milestoneIndex].tasks[taskIndex].completed;

    const totalTasks = newRoadmap.milestones.reduce((s, m) => s + m.tasks.length, 0);
    const completedTasks = newRoadmap.milestones.reduce(
      (s, m) => s + m.tasks.filter(t => t.completed).length, 0
    );
    newRoadmap.progress.completedTasks = completedTasks;
    newRoadmap.progress.overallProgress = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setRoadmap(newRoadmap);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center gap-4">
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading your career roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">No Roadmap Yet</h2>
            <p className="text-muted-foreground max-w-md">
              Analyze your resume first to generate a personalized career roadmap.
            </p>
          </div>
          <button
            onClick={() => navigate('/resume-analysis')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Resume Analysis
          </button>
        </div>
      </div>
    );
  }

  const milestonesProgress = roadmap.milestones.map(m => ({
    ...m,
    tasks: m.tasks || [],
    completedTasks: (m.tasks || []).filter(t => t.completed).length,
    totalTasks: (m.tasks || []).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container-custom max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Career Roadmap</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground leading-tight">
              Your Path to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                {roadmap.target.company}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{roadmap.aiInsights.summary}</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <Target className="w-5 h-5 text-primary" />,
                label: 'Current Readiness',
                value: `${roadmap.currentStatus.readiness}%`,
                sub: roadmap.currentStatus.confidenceLevel + ' confidence'
              },
              {
                icon: <Calendar className="w-5 h-5 text-amber-400" />,
                label: 'Estimated Timeline',
                value: roadmap.currentStatus.estimatedTimeline,
                sub: 'to reach target score'
              },
              {
                icon: <BarChart2 className="w-5 h-5 text-green-400" />,
                label: 'Overall Progress',
                value: `${roadmap.progress.overallProgress}%`,
                sub: `${roadmap.progress.completedTasks} / ${roadmap.progress.totalTasks} tasks`
              },
              {
                icon: <Star className="w-5 h-5 text-purple-400" />,
                label: 'Target Score',
                value: `${roadmap.target.targetMatchScore}%`,
                sub: `${roadmap.target.role}`
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="glass-card p-5 rounded-xl border border-border/50 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 rounded-xl border border-border/50 mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Overall Roadmap Progress</span>
              <span className="text-sm font-bold text-primary">{roadmap.progress.overallProgress}%</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${roadmap.progress.overallProgress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>{roadmap.progress.completedTasks} tasks done</span>
              <span>{roadmap.progress.totalTasks - roadmap.progress.completedTasks} remaining</span>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'milestones' && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                    {roadmap.milestones.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* ── Milestones ── */}
            {activeTab === 'milestones' && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-4"
              >
                {milestonesProgress.map((milestone, idx) => {
                  const isExpanded = expandedMilestone === idx;
                  const pct = milestone.totalTasks > 0
                    ? Math.round((milestone.completedTasks / milestone.totalTasks) * 100) : 0;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="glass-card rounded-2xl border border-border/50 overflow-hidden backdrop-blur-xl"
                    >
                      <button
                        onClick={() => setExpandedMilestone(isExpanded ? null : idx)}
                        className="w-full p-6 flex items-center justify-between hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0 w-12 h-12">
                            <svg className="w-12 h-12 rotate-[-90deg]" viewBox="0 0 48 48">
                              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.07)" strokeWidth="4" fill="none" />
                              <motion.circle
                                cx="24" cy="24" r="20"
                                stroke={pct >= 100 ? '#22c55e' : '#6366f1'}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                initial={{ strokeDashoffset: `${2 * Math.PI * 20}` }}
                                animate={{ strokeDashoffset: `${2 * Math.PI * 20 * (1 - pct / 100)}` }}
                                transition={{ duration: 0.8 }}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                              M{milestone.month}
                            </span>
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-foreground">{milestone.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{milestone.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {milestone.completedTasks}/{milestone.totalTasks} tasks
                              </span>
                              <span className="text-xs text-primary font-medium">+{milestone.matchScoreImpact}% score</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          {pct === 100 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                              Complete
                            </span>
                          )}
                          {isExpanded
                            ? <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            : <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          }
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border/30"
                          >
                            <div className="p-6 space-y-5">
                              <div className="p-4 rounded-xl bg-muted/20 border border-border/20">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Expected Outcome</p>
                                <p className="text-sm text-muted-foreground">{milestone.expectedOutcome}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-primary" />
                                  Tasks ({milestone.completedTasks}/{milestone.totalTasks} done)
                                </h4>
                                <div className="space-y-3">
                                  {milestone.tasks.map((task, taskIdx) => (
                                    <motion.div
                                      key={taskIdx}
                                      layout
                                      className={`p-4 rounded-xl border transition-all ${
                                        task.completed
                                          ? 'bg-green-500/5 border-green-500/15'
                                          : 'bg-muted/20 border-border/20 hover:border-primary/20'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <button
                                          onClick={() => toggleTaskCompletion(idx, taskIdx)}
                                          className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                                        >
                                          {task.completed
                                            ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            : <Circle className="w-5 h-5 text-muted-foreground" />
                                          }
                                        </button>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full border ${PRIORITY_STYLES[task.priority]}`}>
                                              {task.priority}
                                            </span>
                                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                                              {CATEGORY_ICONS[task.category]}
                                              {task.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{task.estimatedTime}</span>
                                          </div>
                                          <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                            {task.task}
                                          </p>

                                          {task.resources && task.resources.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                              {task.resources.map((resource, resIdx) => (
                                                <a
                                                  key={resIdx}
                                                  href={resource.link}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-muted/30 border border-border/20 transition-colors text-sm group"
                                                >
                                                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                                                  <span className="text-foreground text-xs truncate">{resource.title}</span>
                                                  <span className="text-muted-foreground text-xs ml-auto shrink-0">{resource.type}</span>
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* ── Skill Plan ── */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {roadmap.skillPlan.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">No skill plan available.</div>
                ) : roadmap.skillPlan.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="glass-card p-6 rounded-xl border border-border/50 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-foreground">{skill.skill}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-muted/50 text-muted-foreground">{skill.currentLevel}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="px-2 py-1 rounded-lg bg-primary/15 text-primary font-medium">{skill.targetLevel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      {skill.estimatedCompletionTime}
                    </div>

                    {skill.resources.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
                        <div className="space-y-1.5">
                          {skill.resources.map((res, ri) => (
                            <a
                              key={ri}
                              href={res.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/20 transition-colors group"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-foreground truncate">{res.title}</p>
                                <p className="text-[10px] text-muted-foreground">{res.type} · {res.duration}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {skill.practiceProjects && skill.practiceProjects.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Practice Projects</p>
                        <div className="space-y-1">
                          {skill.practiceProjects.map((proj, pi) => (
                            <div key={pi} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              {proj}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── Projects ── */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {roadmap.projectRecommendations.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">No project recommendations.</div>
                ) : roadmap.projectRecommendations.map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="glass-card p-6 rounded-xl border border-border/50 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-foreground">{project.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${PRIORITY_STYLES[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map((tech, ti) => (
                        <span key={ti} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.estimatedTime}</span>
                      <span className="capitalize">{project.complexity} difficulty</span>
                    </div>

                    {project.learningOutcomes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Learning Outcomes</p>
                        <div className="space-y-1">
                          {project.learningOutcomes.map((outcome, oi) => (
                            <div key={oi} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                              {outcome}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.githubTemplate && (
                      <a
                        href={project.githubTemplate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View GitHub Template
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── Certifications ── */}
            {activeTab === 'certifications' && (
              <motion.div
                key="certifications"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {roadmap.certificationRecommendations.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">No certifications recommended.</div>
                ) : roadmap.certificationRecommendations.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="glass-card p-6 rounded-xl border border-border/50 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-foreground">{cert.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${PRIORITY_STYLES[cert.priority]}`}>
                        {cert.priority}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: 'Cost', val: cert.cost },
                        { label: 'Duration', val: cert.duration },
                        { label: 'Difficulty', val: cert.difficulty },
                        { label: 'Validity', val: cert.validity },
                      ].map(({ label, val }) => (
                        <div key={label} className="p-3 rounded-lg bg-muted/30 border border-border/20">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-sm font-medium text-foreground capitalize">{val}</p>
                        </div>
                      ))}
                    </div>

                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm border border-primary/20"
                    >
                      <ExternalLink className="w-4 h-4" /> View Certification
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Insights Footer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6 rounded-2xl border border-border/50 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Career Insights
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-amber-400 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Key Challenges
                </h4>
                <ul className="space-y-2">
                  {roadmap.aiInsights.keyChallenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Target className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                  <Rocket className="w-4 h-4" /> Success Factors
                </h4>
                <ul className="space-y-2">
                  {roadmap.aiInsights.successFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
