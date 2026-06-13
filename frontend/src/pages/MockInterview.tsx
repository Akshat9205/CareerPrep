import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Mic, MicOff, Video, VideoOff, Play, Info, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const MockInterview = () => {
  const navigate = useNavigate();
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'requesting'>('prompt');
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermissions = async () => {
    setPermissionStatus('requesting');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setHasVideo(true);
      setHasAudio(true);
      setPermissionStatus('granted');
      toast.success("Camera and Microphone access granted!");
    } catch (error: any) {
      console.error("Permission error:", error);
      setPermissionStatus('denied');
      toast.error("Please grant camera and microphone access to continue.");
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setHasVideo(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setHasAudio(audioTrack.enabled);
      }
    }
  };

  const handleStartInterview = () => {
    if (permissionStatus !== 'granted') {
      toast.error("You need to grant permissions first");
      return;
    }
    
    // Stop local preview stream before navigating to free up hardware
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar />
      
      <main className="container-custom pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center justify-center md:justify-start gap-3">
              AI Mock Interview
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">Alpha</span>
            </h1>
            <p className="text-muted-foreground text-lg">Practice your skills with our realistic AI-driven interview simulator.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Camera Preview Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-border/50 shadow-2xl rounded-3xl overflow-hidden bg-black/5 aspect-video relative group">
                <AnimatePresence mode="wait">
                  {permissionStatus === 'requesting' ? (
                    <motion.div 
                      key="requesting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-md z-20"
                    >
                      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                      <p className="font-bold text-lg">Requesting Access...</p>
                      <p className="text-sm text-muted-foreground">Please click "Allow" in your browser popup.</p>
                    </motion.div>
                  ) : permissionStatus === 'denied' ? (
                    <motion.div 
                      key="denied"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-md z-20 p-8 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                        <XCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                      <p className="text-muted-foreground max-w-sm mb-8">
                        We need access to your camera and microphone to provide a realistic interview experience.
                      </p>
                      <Button 
                        onClick={requestPermissions}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Video Stream */}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover grayscale-[0.2] transition-opacity duration-700 ${permissionStatus === 'granted' && hasVideo ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Video Off Overlay */}
                {!hasVideo && permissionStatus === 'granted' && (
                  <div className="absolute inset-0 bg-muted/20 backdrop-blur-lg flex flex-col items-center justify-center">
                    <VideoOff className="w-16 h-16 text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground font-medium">Camera is turned off</p>
                  </div>
                )}

                {/* Controls Overlay */}
                {permissionStatus === 'granted' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/20 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl transition-all group-hover:bottom-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVideo}
                      className={`w-12 h-12 rounded-xl transition-all ${hasVideo ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`}
                    >
                      {hasVideo ? <Video size={20} /> : <VideoOff size={20} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleAudio}
                      className={`w-12 h-12 rounded-xl transition-all ${hasAudio ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`}
                    >
                      {hasAudio ? <Mic size={20} /> : <MicOff size={20} />}
                    </Button>
                  </div>
                )}
                
                {/* Visual Audio Indicator */}
                {hasAudio && permissionStatus === 'granted' && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Audio Live</span>
                  </div>
                )}
              </Card>

              {/* Instructions Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-border/50 shadow-lg rounded-2xl p-6 border-l-4 border-l-primary">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Before you start</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Ensure you are in a quiet room with good lighting. Dress professionally as you would for a real interview.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="glass-card border-border/50 shadow-lg rounded-2xl p-6 border-l-4 border-l-orange-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">AI Recording</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The session will be analyzed for your body language, tone, and confidence. You can review the feedback later.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Side Panel - Settings & Start */}
            <div className="space-y-6">
              <Card className="glass-card border-border/50 shadow-xl rounded-3xl p-8 sticky top-28">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Session Setup
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Easy', 'Mid', 'Hard'].map((level) => (
                        <Button 
                          key={level} 
                          variant="outline" 
                          className={`h-10 rounded-xl text-xs font-bold border-border hover:bg-primary/5 hover:border-primary/50 transition-all ${level === 'Mid' ? 'bg-primary/5 border-primary/40 text-primary' : ''}`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Target Role</label>
                    <select className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm font-medium outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                      <option>Software Engineer</option>
                      <option>Frontend Developer</option>
                      <option>Product Manager</option>
                      <option>Data Analyst</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-col gap-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Permission Status</span>
                        {permissionStatus === 'granted' ? (
                          <span className="text-green-500 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Ready
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            <XCircle size={14} /> Required
                          </span>
                        )}
                      </div>
                    </div>

                    <Button 
                      disabled={permissionStatus !== 'granted'}
                      onClick={handleStartInterview}
                      className="w-full h-14 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-2xl shadow-primary/30 rounded-2xl font-extrabold text-lg gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <Play size={24} className="fill-current group-hover:scale-110 transition-transform" />
                      Start Interview
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MockInterview;
