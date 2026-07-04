import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Play, Pause, RotateCcw, Volume2, 
  Settings, Maximize, CheckCircle2, MessageSquare, 
  Target, Award, BookOpen, Clock, ArrowRight,
  FileText, Lightbulb, CheckCircle, Lock, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Full Module Database
const modulesData: Record<string, any[]> = {
  "grammar-fundamentals-for-tech-roles": [
    {
      id: 1,
      title: "Introduction to Tech Grammar",
      videoId: "mUyvY1kTGXc",
      duration: "15 mins",
      description: "Master the foundational grammar rules specifically used in technical environments.",
      notes: [
        { subtitle: "Professional Tone Basics", content: "In tech, clarity is more important than complexity. Avoid using overly academic words." },
        { subtitle: "The Active Voice", content: "Always use active voice in documentation. 'I found the bug' vs 'The bug was found'." }
      ],
      outcomes: ["Clear verbal communication", "Active voice mastery"],
      rewards: ["Foundations Badge", "+20 XP"]
    },
    {
      id: 2,
      title: "Present Tense in Status Updates",
      videoId: "6DHvH5NS-tc",
      duration: "20 mins",
      description: "Learn how to effectively communicate your daily progress during standup meetings.",
      notes: [
        { subtitle: "Daily Standup Structure", content: "Focus on: What you did (Past), what you are doing (Present), and blockers." },
        { subtitle: "Present Continuous", content: "Use 'I am currently implementing...' for ongoing efforts." }
      ],
      outcomes: ["Standup fluency", "Correct tense usage"],
      rewards: ["Communicator Badge", "+30 XP"]
    },
    {
      id: 3,
      title: "Conditional Sentences for Logic",
      videoId: "2KOS9oTDJLo",
      duration: "25 mins",
      description: "Communicate complex code logic and 'If-Then' scenarios clearly.",
      notes: [
        { subtitle: "Zero Conditional", content: "If the server goes down, the load balancer redirects traffic." },
        { subtitle: "First Conditional", content: "If we merge this today, we will be ready tomorrow." }
      ],
      outcomes: ["Logic articulation", "Scenario planning"],
      rewards: ["Logic Master", "+40 XP"]
    },
    {
      id: 4,
      title: "Interactive Quiz: Peer Review",
      videoId: "t2z_NHsNbXI",
      duration: "30 mins",
      description: "Learn the etiquette of code reviews and how to provide constructive feedback.",
      notes: [
        { subtitle: "Constructive Criticism", content: "Focus on the code, not the person." },
        { subtitle: "The Sandwich Method", content: "Positive -> Critique -> Positive." }
      ],
      outcomes: ["Constructive feedback", "PR etiquette"],
      rewards: ["Peer Review Hero", "+50 XP"]
    }
  ],
  "professional-workplace-vocabulary": [
    {
      id: 1,
      title: "Essential Office Jargon",
      videoId: "LXb3EKWsInQ",
      duration: "20 mins",
      description: "Understand common tech industry terms like 'bandwidth', 'deep dive', and 'circle back'.",
      notes: [
        { subtitle: "Bandwidth", content: "Capacity to take on more work." },
        { subtitle: "Deep Dive", content: "Explore a topic in detail." }
      ],
      outcomes: ["Industry jargon mastery"],
      rewards: ["Vocab Pro", "+40 XP"]
    }
  ]
};

const defaultLessons = [
  {
    id: 1,
    title: "General Module Introduction",
    videoId: "LXb3EKWsInQ",
    duration: "10 mins",
    description: "Welcome to this interactive learning module.",
    notes: [{ subtitle: "Tip", content: "Watch fully to unlock next." }],
    outcomes: ["General Knowledge"],
    rewards: ["Participant Badge", "+10 XP"]
  }
];

const ModuleLesson = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const lessons = (moduleId && modulesData[moduleId]) || defaultLessons;
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const playerRef = useRef<any>(null);
  
  const currentLesson = lessons[currentLessonIndex];
  
  // YouTube IFrame API Setup
  useEffect(() => {
    if (!currentLesson) return;
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    window.onYouTubeIframeAPIReady = () => { loadPlayer(); };

    const loadPlayer = () => {
      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(currentLesson.videoId);
        return;
      }
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: currentLesson.videoId,
        playerVars: { autoplay: 0, modestbranding: 1, rel: 0 },
        events: { onStateChange: onPlayerStateChange }
      });
    };

    const onPlayerStateChange = (event: any) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        setIsLessonComplete(true);
        if (!completedLessons.includes(currentLessonIndex)) {
          setCompletedLessons(prev => {
            const next = [...prev, currentLessonIndex];
            saveProgress(currentLessonIndex, next.length);
            return next;
          });
        }
      }
    };

    if (window.YT && window.YT.Player) { loadPlayer(); }
  }, [currentLessonIndex, moduleId]);

  // Fetch initial progress
  useEffect(() => {
    if (user && moduleId) {
      fetchProgress();
    }
  }, [user, moduleId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress/${user?.uid}/${moduleId}`);
      const data = await response.json();
      if (data.success && data.progress) {
        setCompletedLessons(data.progress.completedLessons || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const saveProgress = async (index: number, count: number) => {
    if (!user || !moduleId) return;
    try {
      await fetch(`${API_URL}/api/progress/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          moduleId: moduleId,
          lessonIndex: index,
          totalLessons: lessons.length
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    // Cap progress at 100%
    const newProgress = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    setProgress(newProgress);
    
    if (completedLessons.includes(currentLessonIndex)) {
      setIsLessonComplete(true);
    } else {
      setIsLessonComplete(false);
    }
    
    const contentElement = document.getElementById('lesson-content');
    if (contentElement) contentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLessonIndex, completedLessons, lessons.length]);

  const handleNext = () => {
    if (!isLessonComplete && !completedLessons.includes(currentLessonIndex)) return;
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      navigate('/learning');
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16 h-[calc(100vh)] flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-1/2 bg-black relative flex flex-col group">
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <div id="youtube-player" className="w-full h-full"></div>
            
            <div className="absolute top-6 left-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/10 rounded-xl" onClick={() => navigate('/learning')}>
                <ChevronLeft className="w-4 h-4" /> Back to Learning
              </Button>
            </div>

            {/* Subtle Review/Replay Indicator instead of big overlay */}
            {isLessonComplete && (
              <div className="absolute bottom-6 right-6 z-30 animate-in fade-in zoom-in duration-500">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => playerRef.current.seekTo(0)}
                  className="bg-white/10 backdrop-blur-md text-white border-white/20 rounded-full gap-2 hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  Review Video
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-full bg-background border-l border-border/50">
          <div id="lesson-content" className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
            <div className="max-w-2xl mx-auto space-y-12">
              <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest"><Clock className="w-4 h-4" /> Module Progress</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium"><span>{progress}% Completed</span><span className="text-muted-foreground">Lesson {currentLessonIndex + 1} of {lessons.length}</span></div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold tracking-tight">{currentLesson?.title}</h1>
                <p className="text-muted-foreground">{currentLesson?.description}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold border-b border-border pb-2"><FileText className="w-5 h-5 text-primary" /> <h2>Lesson Notes</h2></div>
                <div className="grid gap-4">
                  {currentLesson?.notes.map((note: any, i: number) => (
                    <div key={i} className="p-5 rounded-2xl bg-card border border-border/50">
                      <h4 className="font-bold mb-2">{note.subtitle}</h4>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-border/50 bg-muted/10">
                    <Target className="w-5 h-5 text-secondary mb-2" />
                    <h4 className="font-bold text-sm">Learning Goals</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                       {currentLesson?.outcomes.map((o: string, i: number) => <li key={i}>• {o}</li>)}
                    </ul>
                 </div>
                 <div className="p-4 rounded-xl border border-border/50 bg-muted/10">
                    <Award className="w-5 h-5 text-yellow-500 mb-2" />
                    <h4 className="font-bold text-sm">Achievements</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                       {currentLesson?.rewards.map((r: string, i: number) => <li key={i}>• {r}</li>)}
                    </ul>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-card/50 backdrop-blur-md flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentLessonIndex === 0} className="rounded-xl h-12 px-6">Previous</Button>
            <Button onClick={handleNext} disabled={!isLessonComplete && !completedLessons.includes(currentLessonIndex)} className={`rounded-xl h-12 px-8 font-bold ${isLessonComplete || completedLessons.includes(currentLessonIndex) ? 'bg-gradient-primary shadow-lg shadow-primary/20' : 'bg-muted'}`}>
              {currentLessonIndex === lessons.length - 1 ? "Finish Module" : "Next Lesson"} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleLesson;
