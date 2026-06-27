import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import {
  ChevronRight, CheckCircle2, PlayCircle, BookOpen, Mic, Brain,
  ClipboardList, ArrowLeft, Lock, Unlock, Star, Zap, Code2,
  Database, Globe, Server, Layers, GitBranch, Trophy, Volume2
} from 'lucide-react';

const topics = [
  {
    id: 'communication',
    title: 'Technical Communication',
    icon: '💬',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    overview: 'Technical communication is the art of conveying complex technical concepts clearly and concisely to both technical and non-technical audiences.',
    videoTitle: 'Mastering Technical Communication in Interviews',
    videoUrl: 'https://www.youtube.com/embed/1aCeGHiqJaA',
    readingPoints: [
      'Use the Feynman Technique: explain concepts as if teaching a child',
      'Structure explanations: What → Why → How → Example',
      'Avoid jargon with non-technical stakeholders',
      'Use analogies to make abstract concepts concrete',
      'Practice active listening and confirm understanding',
    ],
    practiceQuestions: [
      'Explain what a database is to a non-technical person.',
      'How would you describe REST APIs to a business manager?',
      'Explain the concept of "version control" to a new team member.',
      'How do you communicate technical constraints to product managers?',
    ],
    quiz: [
      { q: 'What is the best approach when explaining technical concepts to non-technical stakeholders?', options: ['Use technical jargon', 'Use analogies and simple language', 'Skip the explanation', 'Send a document'], correct: 1 },
      { q: 'Which technique involves explaining a concept as simply as possible?', options: ['Rubber Duck Debugging', 'Feynman Technique', 'Pair Programming', 'Code Review'], correct: 1 },
      { q: 'What structure works best for technical explanations?', options: ['How → What → Why', 'What → Why → How → Example', 'Example → How → What', 'Why → Example → What'], correct: 1 },
    ],
  },
  {
    id: 'projects',
    title: 'Explaining Projects Professionally',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    overview: 'Articulating your projects professionally demonstrates depth of understanding and the ability to communicate impact.',
    videoTitle: 'How to Present Your Projects in Tech Interviews',
    videoUrl: 'https://www.youtube.com/embed/8y9-hyS8ffs',
    readingPoints: [
      'Use STAR: Situation, Task, Action, Result',
      'Lead with the business/user impact',
      'Mention the tech stack and why you chose it',
      'Highlight challenges overcome and lessons learned',
      'Quantify results where possible (e.g., 40% faster load time)',
    ],
    practiceQuestions: [
      'Walk me through your most complex project.',
      'What technical decisions did you make and why?',
      'How did you handle a major technical challenge in your project?',
      'What would you do differently if you built this again?',
    ],
    quiz: [
      { q: 'What does STAR stand for in project presentations?', options: ['Start, Task, Action, Report', 'Situation, Task, Action, Result', 'System, Testing, API, Result', 'Structure, Timeline, Approach, Review'], correct: 1 },
      { q: 'When explaining a project, what should come first?', options: ['Technical details', 'Code snippets', 'Business/user impact', 'Team size'], correct: 2 },
      { q: 'How should you quantify project results?', options: ['Avoid numbers', 'Use approximate percentages', 'Only mention tech stack', 'Skip results'], correct: 1 },
    ],
  },
  {
    id: 'dsa',
    title: 'Explaining DSA',
    icon: '🧠',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    overview: 'Clearly explaining Data Structures and Algorithms shows mastery beyond just solving problems — it demonstrates deep understanding.',
    videoTitle: 'How to Explain DSA Solutions in Interviews',
    videoUrl: 'https://www.youtube.com/embed/t2CEgPsws3U',
    readingPoints: [
      'Explain your approach before coding',
      'Discuss time and space complexity upfront',
      'Use examples to verify your understanding',
      'Narrate your thought process while coding',
      'Discuss edge cases proactively',
    ],
    practiceQuestions: [
      'Explain the difference between BFS and DFS.',
      'Why would you use a HashMap over an array?',
      'Explain dynamic programming in simple terms.',
      'How does quicksort work and when would you use it?',
    ],
    quiz: [
      { q: 'What complexity analysis should you always mention?', options: ['Only time complexity', 'Only space complexity', 'Both time and space complexity', 'Neither'], correct: 2 },
      { q: 'When should you explain your approach?', options: ['After coding', 'Before coding', 'Never', 'Only when asked'], correct: 1 },
      { q: 'What are edge cases in DSA?', options: ['Complex algorithms', 'Boundary conditions and special inputs', 'Memory leaks', 'Syntax errors'], correct: 1 },
    ],
  },
  {
    id: 'oop',
    title: 'Explaining OOP',
    icon: '⚙️',
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    overview: 'Object-Oriented Programming concepts are foundational. Explaining them clearly shows solid programming fundamentals.',
    videoTitle: 'OOP Concepts Explained Simply',
    videoUrl: 'https://www.youtube.com/embed/m_MQYyJpIjg',
    readingPoints: [
      'Encapsulation: bundling data and methods together',
      'Inheritance: creating new classes from existing ones',
      'Polymorphism: same interface, different implementations',
      'Abstraction: hiding complexity, showing only essentials',
      'Always use real-world analogies (e.g., car, animal)',
    ],
    practiceQuestions: [
      'Explain polymorphism with a real-world example.',
      'What is the difference between an interface and an abstract class?',
      'When would you use composition over inheritance?',
      'Explain encapsulation and why it matters.',
    ],
    quiz: [
      { q: 'Which OOP pillar hides implementation details?', options: ['Inheritance', 'Polymorphism', 'Abstraction', 'Encapsulation'], correct: 2 },
      { q: '"Is-A" relationship represents which OOP concept?', options: ['Composition', 'Inheritance', 'Encapsulation', 'Abstraction'], correct: 1 },
      { q: '"Has-A" relationship represents which concept?', options: ['Inheritance', 'Polymorphism', 'Composition', 'Abstraction'], correct: 2 },
    ],
  },
  {
    id: 'dbms',
    title: 'Explaining DBMS',
    icon: '🗄️',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    overview: 'Database Management Systems are core to backend development. Articulating DBMS concepts shows backend proficiency.',
    videoTitle: 'DBMS Interview Questions Explained',
    videoUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc',
    readingPoints: [
      'ACID properties: Atomicity, Consistency, Isolation, Durability',
      'Normalization: eliminating redundancy (1NF, 2NF, 3NF)',
      'Indexing: speeding up queries using B-trees',
      'Transactions: ensure data integrity',
      'SQL vs NoSQL: when to use which',
    ],
    practiceQuestions: [
      'Explain ACID properties with examples.',
      'What is database normalization and why is it important?',
      'When would you use NoSQL over SQL?',
      'Explain what an index does and the trade-offs.',
    ],
    quiz: [
      { q: 'What does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Auto, Cache, Insert, Delete', 'None of the above'], correct: 0 },
      { q: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct: 2 },
      { q: 'What does an index primarily improve?', options: ['Write speed', 'Read/Query speed', 'Storage', 'Security'], correct: 1 },
    ],
  },
  {
    id: 'react',
    title: 'Explaining React',
    icon: '⚛️',
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    overview: 'React is the leading UI library. Explaining its concepts clearly demonstrates frontend expertise.',
    videoTitle: 'React Concepts for Interviews',
    videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
    readingPoints: [
      'Virtual DOM: efficient re-rendering mechanism',
      'Component lifecycle and hooks (useState, useEffect)',
      'State management: local vs global (Context, Redux)',
      'Props vs State: data flow in React',
      'Reconciliation: how React updates the DOM',
    ],
    practiceQuestions: [
      'Explain the Virtual DOM and how it improves performance.',
      'What is the difference between controlled and uncontrolled components?',
      'When would you use useCallback vs useMemo?',
      'Explain React\'s component lifecycle.',
    ],
    quiz: [
      { q: 'What is the Virtual DOM?', options: ['A real browser DOM', 'A lightweight copy of the DOM in memory', 'A CSS framework', 'A state management library'], correct: 1 },
      { q: 'Which hook replaces componentDidMount?', options: ['useState', 'useCallback', 'useEffect', 'useRef'], correct: 2 },
      { q: 'What drives component re-renders in React?', options: ['CSS changes', 'State and prop changes', 'Network requests', 'Timer events only'], correct: 1 },
    ],
  },
  {
    id: 'nodejs',
    title: 'Explaining Node.js',
    icon: '🟢',
    color: 'from-green-600 to-lime-500',
    bgColor: 'bg-green-600/10',
    borderColor: 'border-green-600/30',
    overview: 'Node.js powers scalable backend systems. Articulating its architecture and event loop shows backend depth.',
    videoTitle: 'Node.js Event Loop & Architecture Explained',
    videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
    readingPoints: [
      'Event Loop: non-blocking I/O model',
      'Single-threaded but handles concurrency via async',
      'npm ecosystem: largest package registry',
      'Express.js: minimal web framework for Node',
      'Streams: efficient handling of large data',
    ],
    practiceQuestions: [
      'Explain the Node.js event loop.',
      'How does Node.js handle concurrent requests with a single thread?',
      'What are Node.js streams and when do you use them?',
      'Explain the difference between callbacks, promises, and async/await.',
    ],
    quiz: [
      { q: 'Node.js is built on which JavaScript engine?', options: ['SpiderMonkey', 'Chakra', 'V8', 'JVM'], correct: 2 },
      { q: 'What makes Node.js non-blocking?', options: ['Multiple threads', 'Event loop with async I/O', 'Caching', 'Web Workers'], correct: 1 },
      { q: 'Which framework is most commonly used with Node.js?', options: ['Django', 'Spring Boot', 'Express.js', 'Laravel'], correct: 2 },
    ],
  },
  {
    id: 'api',
    title: 'API Explanation',
    icon: '🔌',
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    overview: 'APIs are the backbone of modern software. Explaining REST, GraphQL, and gRPC shows systems design knowledge.',
    videoTitle: 'REST API Design Best Practices',
    videoUrl: 'https://www.youtube.com/embed/lsMQRaeKNDk',
    readingPoints: [
      'REST: stateless, resource-based HTTP architecture',
      'HTTP Methods: GET, POST, PUT, DELETE, PATCH',
      'Status codes: 200, 201, 400, 401, 403, 404, 500',
      'Authentication: API keys, OAuth 2.0, JWT tokens',
      'GraphQL vs REST: flexible queries vs fixed endpoints',
    ],
    practiceQuestions: [
      'Explain what a RESTful API is.',
      'What is the difference between PUT and PATCH?',
      'How does JWT authentication work?',
      'When would you choose GraphQL over REST?',
    ],
    quiz: [
      { q: 'What HTTP status code means "Not Found"?', options: ['200', '401', '404', '500'], correct: 2 },
      { q: 'REST is stateless means?', options: ['No database needed', 'Each request contains all needed info', 'No responses sent', 'No headers allowed'], correct: 1 },
      { q: 'JWT stands for?', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Widget Token', 'Joint Web Transfer'], correct: 1 },
    ],
  },
  {
    id: 'sql',
    title: 'SQL Explanation',
    icon: '📊',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    overview: 'SQL proficiency is expected in most tech roles. Explaining SQL clearly demonstrates database query skills.',
    videoTitle: 'SQL for Interviews: Complete Guide',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
    readingPoints: [
      'DDL vs DML vs DCL: types of SQL statements',
      'JOINs: INNER, LEFT, RIGHT, FULL OUTER',
      'Subqueries and CTEs for complex queries',
      'Window functions: ROW_NUMBER, RANK, LAG, LEAD',
      'Query optimization: indexes, EXPLAIN ANALYZE',
    ],
    practiceQuestions: [
      'Explain the difference between INNER JOIN and LEFT JOIN.',
      'What is a subquery and when would you use a CTE instead?',
      'How would you find the second-highest salary in a table?',
      'Explain what a window function does.',
    ],
    quiz: [
      { q: 'Which JOIN returns all rows from the left table?', options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'], correct: 2 },
      { q: 'What does GROUP BY do?', options: ['Sorts results', 'Groups rows with same values', 'Filters rows', 'Joins tables'], correct: 1 },
      { q: 'Which clause filters grouped results?', options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], correct: 1 },
    ],
  },
  {
    id: 'vocabulary',
    title: 'Technical Vocabulary',
    icon: '📚',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    overview: 'Mastering technical vocabulary helps you communicate confidently and professionally in interviews and team settings.',
    videoTitle: 'Essential Tech Vocabulary for Software Engineers',
    videoUrl: 'https://www.youtube.com/embed/ysEN5RaKOlA',
    readingPoints: [
      'Scalability: ability to handle increasing load',
      'Latency vs Throughput: speed vs volume',
      'Idempotency: same result regardless of repetitions',
      'Fault tolerance: system continues despite failures',
      'Technical debt: shortcuts that cost future effort',
    ],
    practiceQuestions: [
      'What is the difference between latency and throughput?',
      'Explain what "idempotent" means in API design.',
      'What is technical debt and how do you manage it?',
      'Explain horizontal vs vertical scaling.',
    ],
    quiz: [
      { q: 'What does scalability mean?', options: ['Making code smaller', 'Ability to handle growing load', 'Improving UI', 'Adding more developers'], correct: 1 },
      { q: 'An idempotent operation is one that?', options: ['Changes state each time', 'Produces same result when repeated', 'Runs asynchronously', 'Requires authentication'], correct: 1 },
      { q: 'Horizontal scaling means?', options: ['Adding more CPU/RAM to one server', 'Adding more servers', 'Improving code efficiency', 'Reducing database size'], correct: 1 },
    ],
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

export default function TechnicalDiscussion() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'practice' | 'speaking' | 'quiz'>('overview');
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('');
  const [spokenAnswer, setSpokenAnswer] = useState('');

  const progress = (completedTopics.size / topics.length) * 100;

  const handleMarkComplete = (topicId: string) => {
    setCompletedTopics(prev => new Set([...prev, topicId]));
  };

  const handleQuizAnswer = (qIndex: number, aIndex: number) => {
    if (quizSubmitted) return;
    const updated = [...quizAnswers];
    updated[qIndex] = aIndex;
    setQuizAnswers(updated);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const handleQuizReset = () => {
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  const handleSelectTopic = (topic: typeof topics[0]) => {
    setSelectedTopic(topic);
    setActiveTab('overview');
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setSpokenAnswer('');
    setRecordingText('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingText('🎙️ Listening...');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenAnswer(text);
        setIsRecording(false);
        setRecordingText('');
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setRecordingText('');
        setSpokenAnswer('Speech recognition not available. Please type your answer below.');
      };
      recognition.start();
    } else {
      setIsRecording(false);
      setRecordingText('Speech recognition not supported in this browser.');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BookOpen },
    { key: 'video', label: 'Video', icon: PlayCircle },
    { key: 'practice', label: 'Practice', icon: ClipboardList },
    { key: 'speaking', label: 'Speaking', icon: Mic },
    { key: 'quiz', label: 'Quiz', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <button onClick={() => selectedTopic ? setSelectedTopic(null) : navigate('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">{selectedTopic ? 'Back to Topics' : 'Back to Dashboard'}</span>
              </button>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground">
                    <span className="gradient-text">Technical</span> Design Discussions
                  </h1>
                  <p className="text-muted-foreground mt-1">Master technical articulation for interviews</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Overall Progress</p>
                    <p className="text-2xl font-bold gradient-text">{completedTopics.size}/{topics.length}</p>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke="url(#grad)" strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                        strokeLinecap="round" />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!selectedTopic ? (
                /* Topic Grid */
                <motion.div key="grid" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((topic, i) => {
                    const isCompleted = completedTopics.has(topic.id);
                    return (
                      <motion.div key={topic.id} variants={itemVariants}>
                        <motion.button whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectTopic(topic)}
                          className={`w-full text-left glass-card rounded-2xl p-5 border transition-all duration-300 ${topic.borderColor} hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden group`}>
                          {isCompleted && (
                            <div className="absolute top-3 right-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                          )}
                          <div className={`w-12 h-12 rounded-xl ${topic.bgColor} flex items-center justify-center text-2xl mb-4`}>
                            {topic.icon}
                          </div>
                          <h3 className="font-bold text-foreground mb-1 text-base">{topic.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{topic.overview}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {tabs.map(t => (
                                <div key={t.key} className={`w-6 h-1 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-muted'}`} />
                              ))}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                /* Topic Detail */
                <motion.div key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  {/* Topic Header */}
                  <div className={`glass-card rounded-2xl p-6 border ${selectedTopic.borderColor} mb-6`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${selectedTopic.bgColor} flex items-center justify-center text-3xl`}>
                        {selectedTopic.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground">{selectedTopic.title}</h2>
                        <div className="flex gap-2 mt-2">
                          {tabs.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeTab === tab.key
                                  ? `bg-gradient-to-r ${selectedTopic.color} text-white shadow-sm`
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}>
                              <tab.icon className="w-3.5 h-3.5" />
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {completedTopics.has(selectedTopic.id) ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-sm">Completed!</span>
                        </div>
                      ) : (
                        <button onClick={() => handleMarkComplete(selectedTopic.id)}
                          className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedTopic.color} text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2`}>
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="glass-card rounded-2xl p-6 border border-border/50">

                      {activeTab === 'overview' && (
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" /> Overview & Key Concepts
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-6">{selectedTopic.overview}</p>
                          <h4 className="font-semibold mb-3 text-foreground">Key Learning Points:</h4>
                          <div className="space-y-3">
                            {selectedTopic.readingPoints.map((point, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className={`flex items-start gap-3 p-3 ${selectedTopic.bgColor} border ${selectedTopic.borderColor} rounded-xl`}>
                                <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${selectedTopic.color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>{i + 1}</span>
                                <p className="text-sm text-foreground">{point}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'video' && (
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-primary" /> Video Lesson
                          </h3>
                          <p className="text-muted-foreground mb-4">{selectedTopic.videoTitle}</p>
                          <div className="relative w-full rounded-xl overflow-hidden bg-black/20 border border-border/50" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={selectedTopic.videoUrl}
                              title={selectedTopic.videoTitle}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">📌 Watch the full video and take notes. Then proceed to the Practice section.</p>
                        </div>
                      )}

                      {activeTab === 'practice' && (
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary" /> Practice Questions
                          </h3>
                          <div className="space-y-4">
                            {selectedTopic.practiceQuestions.map((q, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="p-4 border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                                <div className="flex items-start gap-3">
                                  <span className={`w-7 h-7 rounded-lg bg-gradient-to-r ${selectedTopic.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>Q{i + 1}</span>
                                  <p className="text-foreground font-medium leading-relaxed">{q}</p>
                                </div>
                                <textarea
                                  placeholder="Write your answer here..."
                                  className="mt-3 w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                                  rows={3}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'speaking' && (
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Mic className="w-5 h-5 text-primary" /> Speaking Practice
                          </h3>
                          <p className="text-muted-foreground mb-6">Practice explaining this topic out loud. Use the microphone button to record your explanation.</p>

                          <div className="p-4 bg-muted/30 border border-border/50 rounded-xl mb-6">
                            <p className="font-medium text-foreground mb-2">🎯 Practice Prompt:</p>
                            <p className="text-muted-foreground text-sm">{selectedTopic.practiceQuestions[0]}</p>
                          </div>

                          <div className="flex flex-col items-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleStartRecording}
                              disabled={isRecording}
                              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                isRecording
                                  ? 'bg-red-500 animate-pulse shadow-red-500/40'
                                  : `bg-gradient-to-r ${selectedTopic.color} shadow-primary/30`
                              }`}>
                              <Mic className="w-8 h-8 text-white" />
                            </motion.button>
                            <p className="text-sm text-muted-foreground">
                              {isRecording ? recordingText : 'Click to start speaking'}
                            </p>
                            {spokenAnswer && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="w-full p-4 bg-muted/30 border border-border/50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-2 font-medium">Your Answer:</p>
                                <p className="text-foreground text-sm leading-relaxed">{spokenAnswer}</p>
                                <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                  <p className="text-emerald-400 text-xs font-medium">✅ AI Feedback Placeholder</p>
                                  <p className="text-muted-foreground text-xs mt-1">AI feedback integration coming soon. Your answer has been recorded for review.</p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'quiz' && (
                        <div>
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" /> Knowledge Quiz
                          </h3>
                          <div className="space-y-6">
                            {selectedTopic.quiz.map((q, qi) => (
                              <div key={qi} className="p-4 border border-border/50 rounded-xl">
                                <p className="font-medium text-foreground mb-3">
                                  <span className={`inline-block w-6 h-6 rounded-md bg-gradient-to-r ${selectedTopic.color} text-white text-xs font-bold text-center leading-6 mr-2`}>{qi + 1}</span>
                                  {q.q}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, oi) => {
                                    const isSelected = quizAnswers[qi] === oi;
                                    const isCorrect = quizSubmitted && oi === q.correct;
                                    const isWrong = quizSubmitted && isSelected && oi !== q.correct;
                                    return (
                                      <button key={oi} onClick={() => handleQuizAnswer(qi, oi)}
                                        className={`p-3 rounded-lg text-sm text-left border transition-all ${
                                          isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                          : isWrong ? 'bg-red-500/20 border-red-500 text-red-400'
                                          : isSelected ? 'bg-primary/20 border-primary text-primary'
                                          : 'border-border/50 hover:border-primary/30 text-foreground'
                                        }`}>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-3">
                              {!quizSubmitted ? (
                                <button onClick={handleQuizSubmit}
                                  disabled={quizAnswers.length < selectedTopic.quiz.length}
                                  className={`flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${selectedTopic.color} disabled:opacity-50 hover:opacity-90 transition-opacity`}>
                                  Submit Quiz
                                </button>
                              ) : (
                                <>
                                  <div className="flex-1 p-3 bg-muted/30 rounded-xl text-center">
                                    <p className="text-muted-foreground text-sm">Score</p>
                                    <p className="text-2xl font-bold gradient-text">
                                      {quizAnswers.filter((a, i) => a === selectedTopic.quiz[i].correct).length}/{selectedTopic.quiz.length}
                                    </p>
                                  </div>
                                  <button onClick={handleQuizReset}
                                    className="px-5 py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm font-medium">
                                    Retry
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
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
