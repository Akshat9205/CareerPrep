import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import {
  ArrowLeft, Mic, Brain, Star, CheckCircle2, ChevronRight, PlayCircle,
  MessageSquare, Users, Target, Zap, Lightbulb, Volume2, Award, RefreshCw
} from 'lucide-react';

const sections = [
  {
    id: 'self-intro',
    title: 'Tell Me About Yourself',
    icon: '👤',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Craft a compelling 2-minute professional introduction that highlights your journey, skills, and aspirations.',
    template: `"I'm [Name], a [role/student] with [X years] of experience in [domain]. 
I specialize in [key skills] and have worked on [notable project/achievement]. 
I'm passionate about [interest] and I'm looking to [career goal]."`,
    tips: [
      'Keep it under 2 minutes',
      'Follow: Background → Skills → Achievement → Goal',
      'Tailor to the job description',
      'Practice until it feels natural, not memorized',
      'End with why this specific company excites you',
    ],
    mockQuestions: ['Walk me through your background.', 'Tell me about yourself.', 'Introduce yourself briefly.'],
    starExample: null,
  },
  {
    id: 'strengths',
    title: 'Strengths',
    icon: '💪',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Present your strengths authentically with concrete evidence.',
    template: `"One of my key strengths is [strength]. For example, [specific situation where you demonstrated this]. 
As a result, [outcome]. This is something I continue to develop by [action]."`,
    tips: [
      'Choose 3-4 relevant strengths',
      'Always back with a real example',
      'Connect strength to the role requirements',
      'Show continuous improvement mindset',
      'Avoid generic answers like "I am a hard worker"',
    ],
    mockQuestions: ['What are your greatest strengths?', 'What do you do better than most people?', 'What skills make you stand out?'],
    starExample: null,
  },
  {
    id: 'weaknesses',
    title: 'Weaknesses',
    icon: '🎯',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Address weaknesses with honesty, growth mindset, and concrete improvement steps.',
    template: `"One area I've been actively working on is [real weakness]. I noticed this when [situation]. 
I'm addressing it by [concrete action - course/practice/mentor]. Recently, I [evidence of improvement]."`,
    tips: [
      'Pick a genuine weakness (not a "humblebrag")',
      'Never say perfectionism or working too hard',
      'Show self-awareness and accountability',
      'Always end with what you\'re doing to improve',
      'Avoid mentioning weaknesses critical to the role',
    ],
    mockQuestions: ['What is your biggest weakness?', 'What are you working to improve?', 'Where do you need to grow?'],
    starExample: null,
  },
  {
    id: 'leadership',
    title: 'Leadership',
    icon: '🌟',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Demonstrate leadership through concrete examples even without formal leadership titles.',
    template: `"In [Situation], I took initiative to [Action] even though it wasn't part of my role. 
I [specific steps taken]. The team [Result]. I learned [leadership insight]."`,
    tips: [
      'Leadership doesn\'t require a title',
      'Show influence, initiative, and ownership',
      'Use STAR method for all examples',
      'Highlight decision-making and communication',
      'Mention how you handled pushback or conflict',
    ],
    mockQuestions: ['Tell me about a time you led a team.', 'How do you motivate people?', 'Describe your leadership style.'],
    starExample: {
      situation: 'During a group project, the team was stuck on an unclear architecture decision',
      task: 'We needed to decide between two approaches with different trade-offs',
      action: 'I organized a 30-min technical meeting, created a comparison table, and facilitated discussion',
      result: 'The team aligned in one session; project delivered 1 week ahead of schedule',
    },
  },
  {
    id: 'conflict',
    title: 'Conflict Resolution',
    icon: '🤝',
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    description: 'Showcase emotional intelligence and professional conflict management skills.',
    template: `"In [Situation], there was a disagreement about [topic]. My approach was to [listen first, then...]. 
I addressed it by [concrete action]. The outcome was [result] and our relationship [improved/maintained]."`,
    tips: [
      'Never speak negatively about colleagues',
      'Focus on the professional disagreement, not personality',
      'Show empathy and active listening',
      'Emphasize the positive resolution and lesson learned',
      'Demonstrate that you can separate ego from solutions',
    ],
    mockQuestions: ['Tell me about a conflict with a coworker.', 'How do you handle disagreements?', 'Describe a difficult team situation.'],
    starExample: {
      situation: 'Teammate disagreed strongly with my technical approach in a PR review',
      task: 'Needed to resolve disagreement without damaging the working relationship',
      action: 'Scheduled 1-on-1 call, listened to their concerns fully, shared my reasoning with data',
      result: 'We found a hybrid solution that was better than either original approach',
    },
  },
  {
    id: 'star',
    title: 'STAR Method',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'The STAR method is the gold standard for behavioral interview answers.',
    template: `S - Situation: Set the scene with essential context
T - Task: Describe your responsibility/challenge
A - Action: Explain what YOU specifically did (use "I" not "we")
R - Result: Share the measurable outcome`,
    tips: [
      'Spend 10% on Situation, 20% on Task, 60% on Action, 10% on Result',
      'Quantify results wherever possible',
      'Prepare 5-7 STAR stories that can address multiple questions',
      'Use "I" not "we" in the Action section',
      'Include what you learned from the experience',
    ],
    mockQuestions: ['Tell me about a time you failed.', 'Give an example of a challenging project.', 'Describe handling a tight deadline.'],
    starExample: {
      situation: 'Our production server went down on a Friday evening before a major launch',
      task: 'As on-call engineer, I needed to diagnose and fix the issue within 2 hours',
      action: 'Analyzed logs, identified database connection pool exhaustion, implemented fix, and added monitoring alerts',
      result: 'Server restored in 45 minutes; implemented permanent fix saving ~$10K/month in potential downtime',
    },
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    icon: '🗣️',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    description: 'Demonstrate clear, concise, and professional communication in every answer.',
    template: `Structure your answer: State your point → Support with evidence → Summarize impact
Use transition words: "First... Then... Finally... As a result..."`,
    tips: [
      'Use "Bottom Line Up Front" (BLUF) technique',
      'Avoid filler words: um, uh, like, you know',
      'Pause instead of using fillers',
      'Match your communication style to your audience',
      'Ask clarifying questions before answering',
    ],
    mockQuestions: ['How do you communicate with non-technical stakeholders?', 'Describe your communication style.', 'How do you handle miscommunication?'],
    starExample: null,
  },
  {
    id: 'mock-behavioral',
    title: 'Behavioral Mock Questions',
    icon: '🎭',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'Practice with real behavioral questions asked by top companies.',
    template: 'Practice answering each question using the STAR method. Record yourself and review.',
    tips: [
      '"Tell me about a time you had to learn something quickly."',
      '"Describe a situation where you disagreed with your manager."',
      '"Give an example of going above and beyond."',
      '"Tell me about your biggest professional failure."',
      '"Describe handling multiple priorities simultaneously."',
    ],
    mockQuestions: [
      'Tell me about a time you had to learn something quickly.',
      'Describe a situation where you had to meet a very tight deadline.',
      'Tell me about a time you received critical feedback.',
    ],
    starExample: null,
  },
  {
    id: 'speaking',
    title: 'Speaking Practice',
    icon: '🎙️',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Record and analyze your behavioral answers to improve delivery.',
    template: 'Use voice recording to practice. Pay attention to pace, clarity, and confidence.',
    tips: [
      'Speak at 130-150 words per minute for clarity',
      'Record yourself and listen back critically',
      'Eliminate filler words over time',
      'Project confidence through vocal variety',
      'Practice in front of a mirror for body language',
    ],
    mockQuestions: ['Practice your "Tell Me About Yourself" answer.', 'Practice a STAR story for leadership.', 'Practice handling a weakness question.'],
    starExample: null,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BehavioralPage() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'content' | 'mock' | 'speak' | 'feedback'>('content');
  const [isRecording, setIsRecording] = useState(false);
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');

  const progress = (completedSections.size / sections.length) * 100;

  const handleMarkComplete = (id: string) => {
    setCompletedSections(prev => new Set([...prev, id]));
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setSpokenAnswer('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenAnswer(text);
        setIsRecording(false);
        generateFeedback(text);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setSpokenAnswer('Browser does not support speech recognition. Please type your answer.');
      };
      recognition.start();
    } else {
      setIsRecording(false);
      setSpokenAnswer('Speech recognition not supported. Please type your answer below.');
    }
  };

  const generateFeedback = (answer: string) => {
    const wordCount = answer.split(' ').length;
    const hasSTAR = answer.toLowerCase().includes('situation') || answer.toLowerCase().includes('result') || answer.toLowerCase().includes('i ');
    const feedback = `✅ AI Feedback (Placeholder):
• Word count: ${wordCount} words ${wordCount < 50 ? '(try to elaborate more)' : wordCount > 200 ? '(consider being more concise)' : '(good length)'}
• Structure: ${hasSTAR ? 'STAR elements detected' : 'Consider using the STAR structure'}
• Clarity: Good answer detected
• Suggestion: Add specific quantifiable results to strengthen your answer
• Score: ${Math.min(95, 60 + wordCount / 3)}% — Keep practicing!`;
    setAiFeedback(feedback);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <button onClick={() => selectedSection ? setSelectedSection(null) : navigate('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">{selectedSection ? 'Back to Topics' : 'Back to Dashboard'}</span>
              </button>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold">
                    <span className="gradient-text">Googliness</span> & Behavioral
                  </h1>
                  <p className="text-muted-foreground mt-1">Master behavioral interviews with proven frameworks</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-xl font-bold gradient-text">{completedSections.size}/{sections.length}</p>
                  </div>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!selectedSection ? (
                <motion.div key="grid" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sections.map((section) => (
                    <motion.div key={section.id} variants={itemVariants}>
                      <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedSection(section); setActiveTab('content'); setSpokenAnswer(''); setAiFeedback(''); }}
                        className={`w-full text-left glass-card rounded-2xl p-5 border ${section.borderColor} hover:shadow-lg hover:shadow-primary/10 transition-all relative overflow-hidden group`}>
                        {completedSections.has(section.id) && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        )}
                        <div className={`w-11 h-11 rounded-xl ${section.bgColor} flex items-center justify-center text-2xl mb-3`}>
                          {section.icon}
                        </div>
                        <h3 className="font-bold text-foreground mb-1">{section.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{section.description}</p>
                        <ChevronRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  {/* Section Header */}
                  <div className={`glass-card rounded-2xl p-6 border ${selectedSection.borderColor} mb-6`}>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className={`w-14 h-14 rounded-xl ${selectedSection.bgColor} flex items-center justify-center text-2xl`}>
                        {selectedSection.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground">{selectedSection.title}</h2>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {[
                            { key: 'content', label: 'Content', icon: Lightbulb },
                            { key: 'mock', label: 'Mock Q', icon: MessageSquare },
                            { key: 'speak', label: 'Speaking', icon: Mic },
                            { key: 'feedback', label: 'AI Feedback', icon: Brain },
                          ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeTab === tab.key
                                  ? `bg-gradient-to-r ${selectedSection.color} text-white`
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}>
                              <tab.icon className="w-3.5 h-3.5" />{tab.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {completedSections.has(selectedSection.id) ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-sm font-semibold">Done</span>
                        </div>
                      ) : (
                        <button onClick={() => handleMarkComplete(selectedSection.id)}
                          className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedSection.color} text-white text-sm font-semibold hover:opacity-90 flex items-center gap-2`}>
                          <CheckCircle2 className="w-4 h-4" /> Complete
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="glass-card rounded-2xl p-6 border border-border/50">

                      {activeTab === 'content' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-bold text-foreground mb-2">📖 About This Topic</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{selectedSection.description}</p>
                          </div>
                          <div className="p-4 bg-muted/30 border border-border/50 rounded-xl">
                            <h4 className="font-semibold text-foreground mb-2 text-sm">📝 Template / Framework:</h4>
                            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{selectedSection.template}</pre>
                          </div>
                          {selectedSection.starExample && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">⭐ STAR Example:</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(selectedSection.starExample).map(([key, val]) => (
                                  <div key={key} className={`p-3 ${selectedSection.bgColor} border ${selectedSection.borderColor} rounded-xl`}>
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{key}</span>
                                    <p className="text-sm text-foreground mt-1">{val}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">💡 Pro Tips:</h4>
                            <div className="space-y-2">
                              {selectedSection.tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'mock' && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-foreground flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" /> Mock Questions
                          </h3>
                          {selectedSection.mockQuestions.map((q, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                              <div className={`p-4 ${selectedSection.bgColor} border ${selectedSection.borderColor} rounded-xl`}>
                                <p className="font-medium text-foreground text-sm mb-3">
                                  <span className="text-primary font-bold mr-2">Q{i + 1}.</span>{q}
                                </p>
                                <textarea
                                  placeholder="Write your STAR-structured answer here..."
                                  className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                                  rows={4}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'speak' && (
                        <div className="space-y-5">
                          <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Mic className="w-5 h-5 text-primary" /> Speaking Practice
                          </h3>
                          <div className="p-4 bg-muted/20 border border-border/50 rounded-xl">
                            <p className="text-sm font-medium text-foreground">🎯 Current Question:</p>
                            <p className="text-muted-foreground text-sm mt-1">{selectedSection.mockQuestions[currentQuestion]}</p>
                            <div className="flex gap-2 mt-3">
                              {selectedSection.mockQuestions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentQuestion(i)}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${currentQuestion === i ? `bg-gradient-to-r ${selectedSection.color} text-white` : 'bg-muted text-muted-foreground'}`}>
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-4">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={handleStartRecording} disabled={isRecording}
                              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                                isRecording ? 'bg-red-500 animate-pulse shadow-red-500/40' : `bg-gradient-to-r ${selectedSection.color} shadow-primary/30`
                              }`}>
                              <Mic className="w-8 h-8 text-white" />
                            </motion.button>
                            <p className="text-sm text-muted-foreground">{isRecording ? '🎙️ Recording...' : 'Tap mic to answer'}</p>
                          </div>
                          {spokenAnswer && (
                            <div className="p-4 bg-muted/30 border border-border/50 rounded-xl">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Your Answer:</p>
                              <p className="text-sm text-foreground">{spokenAnswer}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'feedback' && (
                        <div className="space-y-5">
                          <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" /> AI Feedback
                          </h3>
                          {aiFeedback ? (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                              <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiFeedback}</pre>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Brain className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <p className="text-muted-foreground text-sm">Go to Speaking Practice and record your answer to receive AI feedback.</p>
                              <button onClick={() => setActiveTab('speak')}
                                className={`mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r ${selectedSection.color} text-white text-sm font-semibold hover:opacity-90`}>
                                Start Speaking Practice
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
