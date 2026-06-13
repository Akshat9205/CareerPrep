import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Filter, Building2, 
  MapPin, Clock, Globe, ArrowUpRight,
  Plus, CheckCircle2, Timer, AlertCircle,
  ExternalLink, Bookmark, Share2, TrendingUp,
  LayoutGrid, List as ListIcon, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const liveJobs = [
  {
    id: 1,
    company: 'Google',
    role: 'Frontend Engineer (L3)',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹25L - ₹45L',
    posted: '2 hours ago',
    logo: 'https://img.icons8.com/color/48/google-logo.png',
    link: 'https://www.google.com/about/careers/applications/jobs/results/',
    tags: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: 2,
    company: 'Amazon',
    role: 'SDE-I',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹18L - ₹32L',
    posted: '5 hours ago',
    logo: 'https://img.icons8.com/color/48/amazon.png',
    link: 'https://www.amazon.jobs/en-gb/',
    tags: ['Java', 'AWS', 'System Design']
  },
  {
    id: 3,
    company: 'Meta',
    role: 'Software Engineer, Product',
    location: 'Remote (APAC)',
    type: 'Remote',
    salary: '$120k - $180k',
    posted: '1 day ago',
    logo: 'https://img.icons8.com/color/48/meta.png',
    link: 'https://www.metacareers.com/jobs',
    tags: ['Product Design', 'GraphQL', 'Mobile']
  },
  {
    id: 4,
    company: 'Microsoft',
    role: 'Full Stack Developer',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹15L - ₹28L',
    posted: '3 hours ago',
    logo: 'https://img.icons8.com/color/48/microsoft.png',
    link: 'https://careers.microsoft.com/',
    tags: ['.NET', 'Azure', 'React']
  },
  {
    id: 5,
    company: 'Adobe',
    role: 'Software Engineer II',
    location: 'Noida, India',
    type: 'Full-time',
    salary: '₹22L - ₹38L',
    posted: '6 hours ago',
    logo: 'https://img.icons8.com/color/48/adobe.png',
    link: 'https://www.adobe.com/careers.html',
    tags: ['C++', 'Graphics', 'Algorithm']
  },
  {
    id: 6,
    company: 'Netflix',
    role: 'UI Engineer',
    location: 'Remote',
    type: 'Remote',
    salary: '$150k+',
    posted: '12 hours ago',
    logo: 'https://img.icons8.com/color/48/netflix.png',
    link: 'https://jobs.netflix.com/',
    tags: ['Animation', 'Performance', 'React']
  }
];

const JobTracker = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'tracked'>('live');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = liveJobs.filter(job => 
    job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80 transition-all duration-300">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-primary" />
                  Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tracker</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Browse live opportunities and track your career progression in one place.
                </p>
              </div>

              <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/50">
                <button 
                  onClick={() => setActiveTab('live')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Live Opportunities
                </button>
                <button 
                  onClick={() => setActiveTab('tracked')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'tracked' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  My Pipeline
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'live' ? (
                <motion.div 
                  key="live"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Search roles, companies, or keywords..." 
                        className="pl-12 h-14 rounded-2xl border-border/50 bg-muted/20 focus:bg-background transition-all text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 border-border/50 bg-muted/20">
                      <Filter className="w-5 h-5" /> Filters
                    </Button>
                  </div>

                  {/* Job Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                      <motion.div 
                        key={job.id}
                        layout
                        className="glass-card rounded-[2rem] p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="relative z-10 space-y-5">
                          <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-border/50">
                              <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                            </div>
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              Live
                            </Badge>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors truncate">{job.role}</h3>
                            <p className="text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                              <Building2 className="w-4 h-4" /> {job.company}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 rounded-full bg-muted/50 text-[10px] font-bold text-muted-foreground border border-border/50 uppercase tracking-tighter">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground py-2">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-primary" /> {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-emerald-500" /> {job.salary}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20" onClick={() => window.open(job.link, '_blank')}>
                              Apply Now <ArrowUpRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="w-11 h-11 rounded-xl border-border/50 bg-muted/10">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between pt-2 text-[10px] text-muted-foreground border-t border-border/50 mt-4">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {job.type}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="tracked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Applied Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold flex items-center gap-2 text-blue-500"><Timer className="w-5 h-5" /> Applied (2)</h3>
                        <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      </div>
                      <div className="glass-card rounded-2xl p-5 space-y-3 border-l-4 border-l-blue-500">
                        <div className="flex justify-between">
                          <p className="font-bold text-sm">Frontend Engineer</p>
                          <span className="text-[10px] text-muted-foreground">3d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Google • Bangalore</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-bold">Resume Sent</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Interviewing Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold flex items-center gap-2 text-purple-500"><Search className="w-5 h-5" /> Interviewing (1)</h3>
                        <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" />
                      </div>
                      <div className="glass-card rounded-2xl p-5 space-y-3 border-l-4 border-l-purple-500 bg-purple-500/5">
                        <div className="flex justify-between">
                          <p className="font-bold text-sm">SDE-II</p>
                          <span className="text-[10px] text-purple-500 font-bold">Today 2PM</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Amazon • Hyderabad</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Badge className="bg-purple-500/20 text-purple-500 border-none text-[8px] font-bold">Technical Round 1</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Selected Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold flex items-center gap-2 text-emerald-500"><CheckCircle2 className="w-5 h-5" /> Selected (0)</h3>
                      </div>
                      <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center">
                        <Trophy className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No offers yet. Keep practicing!</p>
                      </div>
                    </div>
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

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

export default JobTracker;
