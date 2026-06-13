import { useState, FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, LogOut, Settings, Award, BookOpen, Clock, Camera, Check, X, Loader2, PlayCircle, CheckCircle2, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Activity {
  id: string;
  moduleTitle: string;
  progress: number;
  lastPlayed: string;
  completed?: boolean;
}

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    modulesDone: 0,
    hoursLearned: 0,
    mockInterviews: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      // Only set local photoURL if it's not already set (prevents flicker)
      if (!photoURL) setPhotoURL(user.photoURL || "");
      
      // Small delay to ensure DB sync is complete after refresh/login
      const timer = setTimeout(() => {
        fetchUserStats();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user?.uid) return;
    try {
      setIsLoadingStats(true);
      const progressRes = await fetch(`http://localhost:5000/api/progress/${user.uid}`);
      const data = await progressRes.json();
      const progressArray = data.progress || [];
      
      // Calculate completed modules (robust check)
      const completedCount = progressArray.filter((p: any) => p.isCompleted || p.progressPercentage >= 100).length;
      
      // Format activities for "Recent Journey"
      const formattedActivities = progressArray
        .map((p: any) => ({
          id: p.moduleId,
          moduleTitle: p.moduleId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          progress: p.progressPercentage,
          lastPlayed: p.lastAccessed,
          completed: p.isCompleted || p.progressPercentage >= 100
        }))
        .sort((a: any, b: any) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
        .slice(0, 5);

      setActivities(formattedActivities);
      
      const statsRes = await fetch(`http://localhost:5000/api/users/${user.uid}`);
      const userData = await statsRes.json();
      
      const interviewRes = await fetch(`http://localhost:5000/api/interviews/${user.uid}`);
      const interviewData = await interviewRes.json();
      const mockInterviewsCount = interviewData.success && interviewData.interviews ? interviewData.interviews.length : 0;
      
      setStats(prev => ({
        ...prev,
        modulesDone: completedCount,
        hoursLearned: Math.round(completedCount * 1.5), // Each module approx 1.5 hours
        mockInterviews: mockInterviewsCount
      }));

      if (userData.success && userData.user) {
        setBio(userData.user.bio || "");
        if (userData.user.photoURL) {
          setPhotoURL(userData.user.photoURL);
        }
      }
      
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
        toast.success("New photo selected! Don't forget to save changes.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    
    setIsSaving(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile(displayName.trim(), photoURL.trim(), bio.trim());
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Loading profile...</p>
      </div>
    );
  }

  const getInitials = () => {
    if (user.displayName) {
      return user.displayName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      
      <main className="container-custom pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and learning journey.</p>
            </div>
            
            <Button 
              variant="outline" 
              className="border-red-500/20 bg-background text-red-500 hover:bg-red-500/10 hover:text-red-600 gap-2 h-11 rounded-xl shadow-sm transition-all"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="font-semibold">Sign Out</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column - User Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="glass-card border-border/50 shadow-xl overflow-hidden rounded-3xl relative">
                <div className="h-32 w-full bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-pink-500/60 opacity-90 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <CardContent className="pt-0 relative px-6 pb-8">
                  <div className="flex justify-center -mt-16 mb-4 relative z-10">
                    <div 
                      className={`mx-auto h-32 w-32 rounded-full border-4 border-card bg-muted flex items-center justify-center shadow-xl overflow-hidden relative group ${isEditing ? 'cursor-pointer ring-4 ring-primary/20' : ''}`}
                      onClick={() => isEditing && fileInputRef.current?.click()}
                    >
                      {(isEditing ? photoURL : (user.photoURL || photoURL)) ? (
                        <img 
                          src={isEditing ? photoURL : (user.photoURL || photoURL)} 
                          alt="Profile" 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <span className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                          {getInitials()}
                        </span>
                      )}
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Update Photo</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="text-center mb-6"
                      >
                        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2 mb-1">
                          {user.displayName || "CareerPrep User"} 
                          <Award className="text-yellow-500 w-5 h-5 fill-yellow-500/20" />
                        </h2>
                        
                        {bio && (
                          <p className="text-sm text-muted-foreground mt-2 mb-4 italic line-clamp-2">
                            "{bio}"
                          </p>
                        )}

                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm border border-primary/20">
                          Pro Member
                        </span>
                        
                        <div className="mt-6 flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-sm text-foreground bg-muted/40 p-3 rounded-xl border border-border">
                            <Mail className="w-5 h-5 text-primary" />
                            <span className="truncate font-medium">{user.email}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="w-full mt-6 gap-2 bg-foreground text-background hover:bg-foreground/90 h-11 rounded-xl shadow-md transition-all active:scale-[0.98]"
                        >
                          <Settings size={16} />
                          <span className="font-semibold">Edit Profile</span>
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSaveProfile}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5 text-center text-xs font-bold text-primary animate-pulse">
                          Click photo above to change image
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full h-11 pl-10 pr-4 bg-background border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all outline-none text-foreground text-sm shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Short Bio</label>
                          <div className="relative">
                            <Quote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <textarea
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="Write a short bio about yourself..."
                              rows={3}
                              className="w-full pl-10 pr-4 py-3 bg-background border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all outline-none text-foreground text-sm shadow-sm resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setDisplayName(user.displayName || "");
                              setPhotoURL(user.photoURL || "");
                              fetchUserStats(); // Reset bio from server
                            }}
                            className="flex-1 h-11 rounded-xl"
                            disabled={isSaving}
                          >
                            <X size={16} className="mr-1" /> Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex-1 h-11 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check size={16} className="mr-1" /> Save</>}
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card className="glass-card border-border/50 shadow-xl rounded-3xl">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Award className="text-primary" size={20} />
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  {stats.modulesDone > 0 ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                        <Award className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Fast Learner</h4>
                        <p className="text-[10px] text-muted-foreground">Completed your first module!</p>
                      </div>
                      <div className="ml-auto">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Award className="text-muted-foreground/30 w-12 h-12 mb-3" />
                      <p className="text-sm text-muted-foreground">Complete modules to earn your first award!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Card className="glass-card border-border/50 shadow-xl rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <BookOpen className="text-indigo-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">My Modules</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <h3 className="text-4xl font-extrabold text-foreground leading-none">{stats.modulesDone}</h3>
                      <span className="text-sm font-medium text-muted-foreground mb-1">/{activities.length} Completed</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-border/50 shadow-xl rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <PlayCircle className="text-green-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">Interviews</p>
                    </div>
                    <div className="flex items-end gap-2">
                       <h3 className="text-4xl font-extrabold text-foreground leading-none">{stats.mockInterviews}</h3>
                       <span className="text-sm font-medium text-muted-foreground mb-1">Mocks</span>
                    </div>
                  </CardContent>
                </Card>
 
                <Card className="glass-card border-border/50 shadow-xl rounded-3xl sm:col-span-2 lg:col-span-1 hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <Clock className="text-orange-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">Hours Learned</p>
                    </div>
                    <div className="flex items-end gap-2">
                       <h3 className="text-4xl font-extrabold text-foreground leading-none">{stats.hoursLearned}</h3>
                       <span className="text-sm font-medium text-muted-foreground mb-1">hrs</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Timeline */}
              <Card className="glass-card border-border/50 shadow-xl rounded-3xl h-[420px] flex flex-col overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/50 bg-card/50 z-10">
                  <CardTitle className="font-bold flex items-center justify-between text-foreground">
                    Recent Journey
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">Activities</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-muted relative">
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-6 relative">
                      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border/50"></div>
                      {activities.map((activity, index) => (
                        <div key={index} className="flex gap-4 relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-card ${activity.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                            {activity.completed ? <Check size={16} /> : <BookOpen size={16} />}
                          </div>
                          <div className="flex-1 pb-4 border-b border-border/30 last:border-none">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm text-foreground">{activity.moduleTitle}</h4>
                              <span className="text-[10px] text-muted-foreground">{new Date(activity.lastPlayed).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {activity.completed ? "Module Completed! Amazing work." : `In Progress - ${activity.progress}%`}
                            </p>
                            {!activity.completed && (
                              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all" style={{ width: `${activity.progress}%` }}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Clock className="text-muted-foreground/30 w-8 h-8" />
                      </div>
                      <h4 className="font-bold text-foreground mb-1">Your journey starts here</h4>
                      <p className="text-sm text-muted-foreground max-w-[200px]">Start your first module to see your progress history.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
