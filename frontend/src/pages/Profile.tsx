import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, LogOut, Settings, Award, BookOpen, Clock, Camera, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
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
        await updateUserProfile(displayName.trim(), photoURL.trim());
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

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-950 text-foreground font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <main className="container-custom pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/40">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">My Profile</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your personal information and learning journey.</p>
            </div>
            
            <Button 
              variant="outline" 
              className="border-red-500/20 bg-white dark:bg-slate-900 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10 gap-2 h-11 rounded-xl shadow-sm transition-all"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="font-semibold">Sign Out</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column - User Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 overflow-hidden rounded-3xl relative">
                
                {/* Background Banner */}
                <div className="h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  {/* Decorative faint patterns */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <CardContent className="pt-0 relative px-6 pb-8">
                  <div className="flex justify-center -mt-16 mb-4 relative z-10">
                    <div className="mx-auto h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xl overflow-hidden relative group">
                      {photoURL || user.photoURL ? (
                        <img 
                          src={photoURL || user.photoURL || ""} 
                          alt="Profile" 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <span className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                          {getInitials()}
                        </span>
                      )}
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="mb-1" />
                          <span className="text-xs font-medium">Change</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="text-center mb-6"
                      >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 mb-1">
                          {user.displayName || "CareerPrep User"} 
                          <Award className="text-yellow-500 w-5 h-5 fill-yellow-500/20" />
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                          Pro Member
                        </span>
                        
                        <div className="mt-6 flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <Mail className="w-5 h-5 text-indigo-500" />
                            <span className="truncate font-medium">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <User className="w-5 h-5 text-purple-500" />
                            <span className="font-mono text-xs">{user.uid.substring(0, 10)}...</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="w-full mt-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 h-11 rounded-xl shadow-md transition-all active:scale-[0.98]"
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
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all outline-none text-slate-700 dark:text-slate-200 text-sm shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Profile Photo URL</label>
                          <div className="relative">
                            <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="url"
                              value={photoURL}
                              onChange={(e) => setPhotoURL(e.target.value)}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all outline-none text-slate-700 dark:text-slate-200 text-sm shadow-sm"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 text-center mt-1">Leave empty to use initials</p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setDisplayName(user.displayName || "");
                              setPhotoURL(user.photoURL || "");
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
              <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 rounded-3xl">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Award className="text-indigo-500" size={20} />
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center border border-green-200 dark:border-green-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                      <Award className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-none mb-1.5">Resume Master</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Perfect ATS Checker Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                      <Award className="text-blue-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-none mb-1.5">English Pro</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Advanced module completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                        <BookOpen className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Modules Completed</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">12</h3>
                      <span className="text-sm font-medium text-green-500 mb-1">+2 this week</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                        <Award className="text-green-600 dark:text-green-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Interviews Cracked</p>
                    </div>
                    <div className="flex items-end gap-2">
                       <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">4</h3>
                       <span className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Mocks</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 rounded-3xl sm:col-span-2 lg:col-span-1 hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
                        <Clock className="text-orange-600 dark:text-orange-400 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Hours Learned</p>
                    </div>
                    <div className="flex items-end gap-2">
                       <h3 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">48</h3>
                       <span className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">hrs</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Timeline */}
              <Card className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-xl shadow-indigo-900/5 rounded-3xl h-[420px] flex flex-col overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 z-10">
                  <CardTitle className="font-bold flex items-center justify-between">
                    Recent Journey
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full">This Week</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 relative space-y-8">
                  {/* Timeline Background Line */}
                  <div className="absolute left-10 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-400 to-transparent"></div>
                  
                  {/* Activity Item 1 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[-2px] top-1 w-8 h-8 rounded-full border-[3px] border-white dark:border-slate-900 bg-indigo-500 text-white shadow-md flex items-center justify-center shrink-0 z-10">
                      <Award size={14} />
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between xl:flex-row flex-col xl:items-center items-start gap-1 mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Passed Mock Interview</h4>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">Today, 2:30 PM</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Scored 85% in Software Engineering behavioral round. Excellent communication skills noted.</p>
                    </div>
                  </div>
                  
                  {/* Activity Item 2 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[-2px] top-1 w-8 h-8 rounded-full border-[3px] border-white dark:border-slate-900 bg-emerald-500 text-white shadow-md flex items-center justify-center shrink-0 z-10">
                      <BookOpen size={14} />
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between xl:flex-row flex-col xl:items-center items-start gap-1 mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Completed English Module</h4>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Yesterday, 10:15 AM</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Finished "Professional Email Writing" module with 100% accuracy in quizzes.</p>
                    </div>
                  </div>
                  
                  {/* Activity Item 3 */}
                  <div className="relative pl-12">
                    <div className="absolute left-[-2px] top-1 w-8 h-8 rounded-full border-[3px] border-white dark:border-slate-900 bg-purple-500 text-white shadow-md flex items-center justify-center shrink-0 z-10">
                      <Settings size={14} />
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between xl:flex-row flex-col xl:items-center items-start gap-1 mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Resume Optimized</h4>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">3 days ago</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Updated CV with AI suggestions. ATS compatibility score improved from 60% to 92%!</p>
                    </div>
                  </div>

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
