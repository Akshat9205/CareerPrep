import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BookOpen, Award, Clock, ArrowRight, Zap,
  Target, TrendingUp, PlayCircle, User, Sparkles,
  ChevronRight, BarChart2, CheckCircle2
} from 'lucide-react';

const quickActions = [
  {
    title: 'Continue Learning',
    description: 'Resume your English modules',
    icon: BookOpen,
    href: '/learning',
    gradient: 'from-indigo-500/80 to-purple-600/80',
    shadow: 'shadow-indigo-500/20',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with AI interviewer',
    icon: PlayCircle,
    href: '/mock-interview',
    gradient: 'from-emerald-500/80 to-teal-600/80',
    shadow: 'shadow-emerald-500/20',
  },
  {
    title: 'My Profile',
    description: 'View achievements & stats',
    icon: User,
    href: '/profile',
    gradient: 'from-orange-500/80 to-pink-600/80',
    shadow: 'shadow-orange-500/20',
  },
];

// Helper to format moduleId to Title
const formatModuleTitle = (id: string) => {
  return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [completedModulesCount, setCompletedModulesCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchUserDetails();
      fetchInterviewStats();
    }
  }, [user]);

  const fetchInterviewStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/interviews/${user?.uid}`);
      const data = await response.json();
      if (data.success && data.interviews) {
        setInterviewsCount(data.interviews.length);
      }
    } catch (error) {
      console.error('Error fetching interview stats:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      // Assuming we can get current user details from an endpoint or just from the sync response
      // For now, let's add a simple fetch if there's a GET /api/users/:uid
      const response = await fetch(`http://localhost:5000/api/users/${user?.uid}`);
      const data = await response.json();
      if (data.success && data.user) {
        setStreak(data.user.streak || 1);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };


  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/${user?.uid}`);
      const data = await response.json();
      if (data.success && data.progress) {
        setUserProgress(data.progress);
        const completed = data.progress.filter((p: any) => p.isCompleted).length;
        setCompletedModulesCount(completed);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-10"
        >
          {/* Hero Greeting */}
          <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-900/50 dark:via-purple-900/40 dark:to-pink-900/30 border border-primary/20 shadow-xl">
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span className="text-muted-foreground text-sm font-medium">{greeting}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-3 leading-tight">
                  Welcome back, <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{firstName}!</span>
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">
                  You're making great progress. Keep the momentum going!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-5 py-3 bg-muted/30 backdrop-blur-md rounded-2xl border border-border">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-muted-foreground text-xs">Weekly Streak</p>
                    <p className="text-foreground font-bold text-lg">{streak} Days 🔥</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/learning')}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold h-12 px-6 rounded-2xl shadow-lg border-0"
                >
                  Continue Learning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Modules Done', value: completedModulesCount.toString(), unit: '', icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              { label: 'Hours Learned', value: (completedModulesCount * 1.5).toFixed(1), unit: 'hrs', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { label: 'Interviews', value: interviewsCount.toString(), unit: 'mocks', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Profile Score', value: Math.min(100, completedModulesCount * 15 + interviewsCount * 5).toString(), unit: '%', icon: BarChart2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-3xl p-5 border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className={`w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground mb-1">{stat.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.href)}
                  className={`group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${action.gradient} shadow-lg ${action.shadow} hover:-translate-y-1 transition-all duration-300 text-left border border-white/10`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                  <action.icon className="w-8 h-8 text-white mb-4" />
                  <h3 className="font-bold text-white text-lg mb-1">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                  <ChevronRight className="absolute bottom-5 right-5 w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Modules */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Recent Modules
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/learning')} className="text-muted-foreground hover:text-foreground text-sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="glass-card rounded-3xl border border-border/50 overflow-hidden divide-y divide-border/50">
              {userProgress.length > 0 ? (
                userProgress
                  .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 3)
                  .map((mod, i) => (
                    <div key={i} className="flex items-center gap-5 px-6 py-5 hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => navigate('/learning')}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${mod.isCompleted ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                        {mod.isCompleted
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          : <PlayCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{formatModuleTitle(mod.moduleId)}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${mod.isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
                              style={{ width: `${mod.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{mod.progressPercentage}%</span>
                        </div>
                      </div>
                      <Award className={`w-4 h-4 shrink-0 ${mod.isCompleted ? 'text-yellow-500' : 'text-muted-foreground opacity-50'}`} />
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No modules started yet.</p>
                  <Button variant="link" onClick={() => navigate('/learning')} className="mt-2 text-primary font-bold">
                    Start Learning Now
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
