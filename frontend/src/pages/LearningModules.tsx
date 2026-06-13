import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Mic, Building2, PlayCircle, Star, CheckCircle2, Search, X, ChevronLeft, Video, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Module {
  title: string;
  duration: string;
  completed: boolean;
  round: 'General' | 'HR' | 'Technical' | 'Behavioral' | 'System Design' | 'Cultural';
}

interface Company {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  iconColor: string;
  description: string;
  modules: Module[];
  mockInterviews: string;
}

const companies: Company[] = [
  {
    id: 'google',
    name: 'Google',
    color: 'from-blue-500/20 to-green-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    description: 'Master analytical communication and technical problem-solving discussions.',
    modules: [
      { title: 'Technical Design Discussions', duration: '45 mins', completed: true, round: 'Technical' },
      { title: 'Googleyness & Behavioral', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Data Structures Articulation', duration: '1.5 hours', completed: false, round: 'Technical' }
    ],
    mockInterviews: '4 Available'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: 'from-orange-500/20 to-yellow-500/20',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-500',
    description: 'Learn to speak through Leadership Principles using the STAR method.',
    modules: [
      { title: 'STAR Method Mastery', duration: '1.5 hours', completed: false, round: 'Behavioral' },
      { title: 'Leadership Principles Vocab', duration: '45 mins', completed: false, round: 'HR' },
      { title: 'Customer Obsession Roleplay', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'LDP Deep Dive: Ownership', duration: '50 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '6 Available'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    description: 'Focus on collaborative communication and growth mindset expression.',
    modules: [
      { title: 'Collaborative Problem Solving', duration: '50 mins', completed: false, round: 'Technical' },
      { title: 'System Design English Articulation', duration: '1.2 hours', completed: false, round: 'System Design' },
      { title: 'Growth Mindset Discussion', duration: '45 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '3 Available'
  },
  {
    id: 'meta',
    name: 'Meta',
    color: 'from-blue-600/20 to-blue-400/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    description: 'Fast-paced execution communication and scaling discussions.',
    modules: [
      { title: 'Fast-paced Product Sense', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Execution & Impact Articulation', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Technical Screen: Algorithms', duration: '1.5 hours', completed: false, round: 'Technical' },
      { title: 'HR Round: Culture & Values', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Move Fast: Team Communication', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available'
  },
  {
    id: 'apple',
    name: 'Apple',
    color: 'from-gray-500/20 to-slate-500/20',
    borderColor: 'border-gray-500/30',
    iconColor: 'text-gray-400',
    description: 'Communicate with precision, creativity, and a user-centric mindset.',
    modules: [
      { title: 'Design Thinking Communication', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'HR Round: Passion & Vision Talk', duration: '35 mins', completed: false, round: 'HR' },
      { title: 'Innovation Storytelling', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Basic Communication: Clarity & Precision', duration: '40 mins', completed: false, round: 'General' },
      { title: 'Apple Values: Culture Round', duration: '45 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '3 Available'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    color: 'from-red-600/20 to-red-400/20',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500',
    description: 'Freedom & Responsibility culture — express independent thinking and judgment.',
    modules: [
      { title: 'Freedom & Responsibility Language', duration: '45 mins', completed: false, round: 'Cultural' },
      { title: 'HR Round: Self-Management Discussion', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'High Performance Communication', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'Technical Excellence Articulation', duration: '1.5 hours', completed: false, round: 'Technical' },
    ],
    mockInterviews: '4 Available'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: 'from-yellow-500/20 to-orange-400/20',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-500',
    description: 'Master e-commerce domain English and India-specific business communication.',
    modules: [
      { title: 'E-commerce Product Communication', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'HR Round: Background & Strengths', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Data-Driven Decision English', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Basic Communication: Hindi-English Mix', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Team Collaboration Roleplay', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available'
  },
  {
    id: 'infosys',
    name: 'Infosys',
    color: 'from-blue-400/20 to-cyan-400/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    description: 'Navigate IT service communication, client interaction, and corporate English.',
    modules: [
      { title: 'Client Communication Fundamentals', duration: '1 hour', completed: false, round: 'General' },
      { title: 'HR Round: Introduction & Hobbies', duration: '25 mins', completed: false, round: 'HR' },
      { title: 'Technical Round: Project Discussion', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Professional Email Writing', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Group Discussion English Skills', duration: '50 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '6 Available'
  },
  {
    id: 'tcs',
    name: 'TCS',
    color: 'from-purple-500/20 to-violet-400/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    description: 'Master structured English for IT roles, appraisals, and client-facing conversations.',
    modules: [
      { title: 'HR Round: Tell Me About Yourself', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Basic Communication: Telephonic Etiquette', duration: '40 mins', completed: false, round: 'General' },
      { title: 'Technical Round: Tech Stack Discussion', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'MRF Interview Communication', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Corporate Culture Onboarding English', duration: '35 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '7 Available'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    color: 'from-green-500/20 to-emerald-400/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    description: 'Build fluency for IT service roles, aptitude rounds, and managerial communication.',
    modules: [
      { title: 'HR Round: Strengths & Weaknesses', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Basic Communication: Pronunciation', duration: '45 mins', completed: false, round: 'General' },
      { title: 'Aptitude Round: Analytical Vocabulary', duration: '1 hour', completed: false, round: 'Technical' },
      { title: 'Situational Behavioral English', duration: '50 mins', completed: false, round: 'Behavioral' },
      { title: 'Wipro Values Discussion', duration: '35 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '5 Available'
  },
  {
    id: 'adobe',
    name: 'Adobe',
    color: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-400/30',
    iconColor: 'text-red-400',
    description: 'Communicate creativity, product thinking, and technical depth in English.',
    modules: [
      { title: 'Product Design Communication', duration: '55 mins', completed: false, round: 'Technical' },
      { title: 'HR Round: Creativity & Goals', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Creative Problem Solving Language', duration: '1 hour', completed: false, round: 'Behavioral' },
      { title: 'System Design for Creative Tools', duration: '1.5 hours', completed: false, round: 'System Design' },
      { title: 'Adobe Culture: Genuine & Exceptional', duration: '40 mins', completed: false, round: 'Cultural' },
    ],
    mockInterviews: '3 Available'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    color: 'from-sky-500/20 to-blue-400/20',
    borderColor: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    description: 'Master CRM domain English, customer success language, and Ohana culture talks.',
    modules: [
      { title: 'Customer Success Communication', duration: '1 hour', completed: false, round: 'General' },
      { title: 'HR Round: Why Salesforce?', duration: '30 mins', completed: false, round: 'HR' },
      { title: 'Technical Round: CRM & APIs', duration: '1.5 hours', completed: false, round: 'Technical' },
      { title: 'Ohana Culture & Values Talk', duration: '40 mins', completed: false, round: 'Cultural' },
      { title: 'STAR Stories: Trailblazer Moments', duration: '50 mins', completed: false, round: 'Behavioral' },
    ],
    mockInterviews: '4 Available'
  }
];

const ALL_BASIC_MODULES = [
  { title: "Grammar Fundamentals for Tech Roles", duration: "1.5 hours", completed: false },
  { title: "Professional Workplace Vocabulary", duration: "2 hours", completed: false },
  { title: "Formal Email & Written Communication", duration: "1 hour", completed: false },
  { title: "Speaking Confidently in Meetings", duration: "2.5 hours", completed: false },
  { title: "Structuring Common Interview Answers", duration: "1.5 hours", completed: false },
  { title: "Small Talk & Networking English", duration: "45 mins", completed: false }
];

const LearningModules = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRound, setSelectedRound] = useState('All');
  const [showMockModal, setShowMockModal] = useState(false);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [basicModules, setBasicModules] = useState(ALL_BASIC_MODULES);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
    fetchPublishedModules();
  }, [user]);

  const fetchPublishedModules = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/modules');
      const data = await res.json();
      if (data.success && data.modules.length > 0) {
        // Only show modules that admin has published
        const publishedTitles = new Set(data.modules.map((m: any) => m.title));
        setBasicModules(ALL_BASIC_MODULES.filter(m => publishedTitles.has(m.title)));
      }
      // If no modules in DB yet → show all (fallback)
    } catch {
      // Backend unavailable → show all modules
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/progress/${user?.uid}`);
      const data = await response.json();
      if (data.success) {
        setUserProgress(data.progress || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getModuleProgress = (title: string) => {
    const moduleId = title.toLowerCase().replace(/\s+/g, '-');
    const progress = userProgress.find(p => p.moduleId === moduleId);
    return progress ? progress.progressPercentage : 0;
  };

  const isModuleCompleted = (title: string) => {
    return getModuleProgress(title) >= 100;
  };

  const rounds = selectedCompany
    ? ['All', ...Array.from(new Set(selectedCompany.modules.map(m => m.round)))]
    : ['All'];

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModules = selectedCompany
    ? selectedCompany.modules.filter(m => selectedRound === 'All' || m.round === selectedRound)
    : [];

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setSelectedRound('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-custom">

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <div className="glass-card p-6 rounded-2xl sticky top-24 border border-border/50">
                <h3 className="text-xl font-bold mb-2">Target Company</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Aiming for a specific dream company? Enter it below to unlock customized English modules for their interview process.
                </p>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search company..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                      {filteredCompanies.map(c => (
                        <button
                          key={c.id}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center gap-3"
                          onClick={() => handleSelectCompany(c)}
                        >
                          <Building2 className={`w-5 h-5 ${c.iconColor}`} />
                          <span className="font-medium text-sm">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Top Companies</p>
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                    {companies.map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => handleSelectCompany(comp)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCompany?.id === comp.id ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground border-transparent hover:bg-muted'
                          }`}
                      >
                        <Building2 className={`w-4 h-4 shrink-0 ${comp.iconColor}`} />
                        <span>{comp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <AnimatePresence mode="wait">
                {selectedCompany ? (
                  <motion.div key="company-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back to Core Modules
                    </button>

                    <div className={`glass-card rounded-2xl p-8 border relative overflow-hidden ${selectedCompany.borderColor}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${selectedCompany.color} opacity-10`} />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-background border ${selectedCompany.borderColor}`}>
                            <Building2 className={`w-8 h-8 ${selectedCompany.iconColor}`} />
                          </div>
                          <h2 className="text-3xl font-bold">{selectedCompany.name} Tracks</h2>
                        </div>

                        <p className="text-lg text-muted-foreground mb-8">
                          {selectedCompany.description}
                        </p>

                        <div className="space-y-6">
                          <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Customized Learning Paths
                              </h3>

                              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                {rounds.map(round => (
                                  <button
                                    key={round}
                                    onClick={() => setSelectedRound(round)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${selectedRound === round
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                        : 'bg-background/50 text-muted-foreground border-border hover:border-primary/30 hover:text-primary'
                                      }`}
                                  >
                                    {round}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid gap-3">
                              {selectedCompany.modules.map((mod, i) => (
                                <div
                                  key={i}
                                  onClick={() => navigate(`/module/${mod.title.toLowerCase().replace(/\s+/g, '-')}`)}
                                  className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group/item"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${mod.completed ? 'bg-green-500/10' : 'bg-primary/10 group-hover/item:bg-primary/20'}`}>
                                      {mod.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <PlayCircle className="w-5 h-5 text-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-medium block">{mod.title}</span>
                                      <span className="text-xs text-muted-foreground">Interactive English Lesson</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {mod.completed && (
                                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase">Finished</span>
                                      )}
                                      <span className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-md border border-border/50 font-medium">
                                        {mod.duration}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                                </div>
                          </div>

                            <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                  <Mic className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{selectedCompany.name} Mock Interviews</p>
                                  <p className="text-sm text-muted-foreground">{selectedCompany.mockInterviews}</p>
                                </div>
                              </div>

                              <Button
                                onClick={() => setShowMockModal(true)}
                                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 h-12 px-8 text-base"
                              >
                                Start Practice
                                <ArrowRight className="ml-2 w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                  </motion.div>
                ) : (
                  <motion.div key="basic-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="mb-8">
                      <h1 className="text-4xl font-bold mb-4">Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">English Learning</span></h1>
                    </div>

                    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border/50">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-semibold mb-1">Fundamentals Track</h2>
                          <div className="text-sm text-muted-foreground">
                            {basicModules.filter(m => isModuleCompleted(m.title)).length}/6 Modules Completed
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          {/* Progress Circle Visual */}
                          {(() => {
                            const completedCount = basicModules.filter(m => isModuleCompleted(m.title)).length;
                            const totalPercentage = Math.round((completedCount / basicModules.length) * 100);
                            return (
                              <div className="relative w-16 h-16">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted stroke-[3]" />
                                  <circle
                                    cx="18" cy="18" r="16" fill="none"
                                    className="stroke-primary stroke-[3] transition-all duration-1000"
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - totalPercentage}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                  {totalPercentage}%
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {basicModules.map((mod, i) => {
                          const completed = isModuleCompleted(mod.title);
                          return (
                            <div
                              key={i}
                              onClick={() => navigate(`/module/${mod.title.toLowerCase().replace(/\s+/g, '-')}`)}
                              className={`flex items-center justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer group
                              ${completed ? 'bg-muted/30 border-border/50' : 'bg-background hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 border-border'}
                            `}>
                              <div className="flex items-center gap-4 sm:gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
                                  ${completed ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                                `}>
                                  {completed ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                  ) : (
                                    <span className="font-bold">{i + 1}</span>
                                  )}
                                </div>
                                <div>
                                  <h3 className={`font-semibold sm:text-lg mb-1 ${completed ? 'text-muted-foreground' : 'text-foreground'}`}>
                                    {mod.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="w-3.5 h-3.5" /> Core Lesson
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>{mod.duration}</span>
                                    {completed && (
                                      <>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span className="text-green-500 font-bold uppercase text-[10px]">Finished</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                                <div className="hidden sm:flex shrink-0">
                                  {completed ? (
                                    <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
                                      Review
                                    </Button>
                                  ) : (
                                    <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                      Start Module
                                      <PlayCircle className="w-4 h-4 ml-2" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                    </div>
</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>




{/* Company Module Video Modal */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none shadow-2xl">
          <div className="relative aspect-video">
            {activeVideo && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Company Module Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={showMockModal} onOpenChange={setShowMockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start {selectedCompany?.name} Interview</DialogTitle>
            <DialogDescription>Get ready for a 30-minute AI-driven mock interview session.</DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Camera & Microphone Access</p>
                <p className="text-muted-foreground">Required for facial expression analysis and voice recording.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">AI Feedback Engine</p>
                <p className="text-muted-foreground">You will receive a detailed ATS/fluency score immediately after.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowMockModal(false)}>Cancel</Button>
            <Button className="bg-gradient-primary" onClick={() => navigate('/interview')}>Launch Interview</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default LearningModules;
