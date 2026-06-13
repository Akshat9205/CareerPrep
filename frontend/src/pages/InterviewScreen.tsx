import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Question {
  id: number;
  text: string;
  category: string;
}

interface Answer {
  questionId: number;
  text: string;
  timestamp: Date;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    overall: 'excellent' | 'good' | 'needs_improvement';
  };
}

const InterviewScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<Answer['feedback'] | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState({
    microphone: false,
    camera: false
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const questions: Question[] = [
    { id: 1, text: "Tell me about yourself and your experience with software development.", category: "Introduction" },
    { id: 2, text: "Describe a challenging project you worked on and how you overcame the obstacles.", category: "Behavioral" },
    { id: 3, text: "How do you handle tight deadlines and pressure in your work?", category: "Behavioral" },
    { id: 4, text: "What's your approach to learning new technologies?", category: "Technical" },
    { id: 5, text: "Why are you interested in this role at our company?", category: "Motivation" }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          console.warn('Microphone permission denied');
        } else if (event.error === 'service-not-allowed') {
          setUseManualInput(true);
        }
      };

      recognition.onend = () => {
        if (isRecording && recognitionRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setUseManualInput(true);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
      }
    };
  }, [isRecording]);

  useEffect(() => {
    const startHardware = async () => {
      const camOk = await requestCameraPermission();
      if (camOk) setIsCameraOn(true);
      
      const micOk = await requestMicrophonePermission();
      if (micOk) setIsMicOn(true);
    };
    
    startHardware();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onend = null;
      }
    };
  }, []);

  // Re-attach stream whenever isCameraOn or videoRef changes
  useEffect(() => {
    if (isCameraOn && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  }, [isCameraOn]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionsGranted(prev => ({ ...prev, microphone: true }));
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } 
      });
      streamRef.current = stream;
      setPermissionsGranted(prev => ({ ...prev, camera: true }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMicrophone = async () => {
    if (!isMicOn) {
      const hasPermission = await requestMicrophonePermission();
      if (hasPermission) {
        setIsMicOn(true);
        if (recognitionRef.current && !isRecording) {
          try {
            recognitionRef.current.start();
          } catch (error) {}
        }
      }
    } else {
      setIsMicOn(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (error) {}
      }
    }
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        setIsCameraOn(true);
      }
    } else {
      setIsCameraOn(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const startRecording = () => {
    if (!isMicOn) {
      toast.error('Please enable microphone first');
      return;
    }
    setIsRecording(true);
    setTranscript('');
    setFeedback(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (error) {}
    }
    if (transcript.trim()) {
      analyzeAnswer();
    }
  };

  const analyzeAnswer = async () => {
    const answerText = useManualInput ? manualText : transcript;
    if (!answerText.trim()) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockFeedback = {
        score: Math.floor(Math.random() * 30) + 70,
        strengths: ["Clear communication", "Good structure"],
        improvements: ["Add more specific metrics"],
        overall: 'good' as const
      };

      setFeedback(mockFeedback);
      setIsAnalyzing(false);

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        text: answerText,
        timestamp: new Date(),
        feedback: mockFeedback
      };
      
      setAnswers(prev => {
        const updatedAnswers = [...prev, newAnswer];
        
        if (currentQuestionIndex < questions.length - 1) {
          toast.info("Moving to next question in 4 seconds...");
          setTimeout(() => {
            nextQuestion();
          }, 4000);
        } else {
          toast.success("Interview completed! Generating report...");
          
          // Save interview to backend
          const saveInterview = async () => {
            try {
              const totalScore = updatedAnswers.reduce((sum, a) => sum + (a.feedback?.score || 0), 0);
              const avgScore = Math.round(totalScore / updatedAnswers.length);
              
              await fetch('http://localhost:5000/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user?.uid,
                  role: 'Software Engineer', // Default role for now
                  difficulty: 'Mid',         // Default difficulty for now
                  overallScore: avgScore,
                  answers: updatedAnswers.map(a => ({
                    questionId: a.questionId,
                    questionText: questions.find(q => q.id === a.questionId)?.text || '',
                    answerText: a.text,
                    score: a.feedback?.score || 0,
                    strengths: a.feedback?.strengths || [],
                    improvements: a.feedback?.improvements || []
                  }))
                })
              });
            } catch (error) {
              console.error('Error saving interview:', error);
            }
          };
          saveInterview();
          
          setTimeout(() => setShowReport(true), 3000);
        }
        
        return updatedAnswers;
      });

    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript('');
      setManualText('');
      setFeedback(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTranscript('');
      setManualText('');
      setFeedback(null);
    }
  };

  const getFeedbackIcon = () => {
    if (!feedback) return null;
    switch (feedback.overall) {
      case 'excellent': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'good': return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default: return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden flex flex-col fixed inset-0 z-[9999]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-white/80 hover:bg-white/10">
              <X className="w-4 h-4 mr-2" /> Exit
            </Button>
            <div className="text-sm text-white/60">
              Question {currentQuestionIndex + 1} / {questions.length} • <span className="px-2 py-1 bg-white/10 rounded-full text-xs">{currentQuestion.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleMicrophone} className={!isMicOn ? 'text-red-400' : ''}>
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleCamera} className={!isCameraOn ? 'text-red-400' : ''}>
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Left Side: Camera & Robot */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-white/10 relative bg-black">
          <div className="absolute inset-0 w-full h-full">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <VideoOff className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/40">Camera Off</p>
              </div>
            )}
          </div>
          {/* Small Robot PIP */}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute bottom-8 left-8 w-48 h-48 z-20">
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-600/90 to-purple-700/90 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
              <Bot className="w-16 h-16 text-white mb-2" />
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest">AI Interviewer</p>
              {isRecording && (
                <div className="flex gap-0.5 mt-2">
                  {[0, 1, 2].map(i => <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} className="w-1 bg-green-400 rounded-full" />)}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Q&A */}
        <div className="w-1/2 flex flex-col p-8 overflow-y-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Question</h3>
            <p className="text-xl leading-relaxed">{currentQuestion.text}</p>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-300">Your Answer</h3>
              {isRecording && <div className="text-red-400 text-sm flex items-center gap-2"><div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" /> Listening...</div>}
            </div>
            <div className="flex-1 bg-black/30 rounded-xl p-4 min-h-[200px] mb-4 overflow-y-auto">
              {useManualInput ? (
                <textarea value={manualText} onChange={e => setManualText(e.target.value)} placeholder="Type here..." className="w-full h-full bg-transparent resize-none outline-none" />
              ) : (
                <p className={transcript ? "text-white" : "text-white/40 italic"}>{transcript || "Click record to start..."}</p>
              )}
            </div>
            <div className="flex gap-3">
              {!isRecording ? (
                <Button onClick={startRecording} disabled={!isMicOn} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 h-12 rounded-xl">Start Recording</Button>
              ) : (
                <Button onClick={stopRecording} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 h-12 rounded-xl">Stop Recording</Button>
              )}
            </div>
          </div>
          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">{getFeedbackIcon()}<h4 className="font-semibold">AI Feedback</h4></div>
                  <div className="text-2xl font-bold">{feedback.score}%</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><h5 className="text-xs font-bold text-green-400 uppercase mb-2">Strengths</h5><ul className="text-sm space-y-1">{feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
                  <div><h5 className="text-xs font-bold text-yellow-400 uppercase mb-2">Improve</h5><ul className="text-sm space-y-1">{feedback.improvements.map((im, i) => <li key={i}>• {im}</li>)}</ul></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Report Overlay */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[10000] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-white/10 rounded-[2rem] p-8 overflow-hidden flex flex-col">
              <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Interview Report</h2>
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                {answers.map((ans, i) => (
                  <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-purple-300 mb-2">Q{i+1}: {questions.find(q => q.id === ans.questionId)?.text}</h4>
                    <p className="text-xs text-white/60 italic mb-2">"{ans.text.substring(0, 100)}..."</p>
                    <div className="text-xs font-bold text-white">Score: {ans.feedback?.score}%</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-auto">
                <Button onClick={() => navigate('/dashboard')} className="flex-1 h-12 bg-white text-black font-bold">Dashboard</Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 h-12 font-bold">Restart</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewScreen;
