import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Lock, 
  Bell, Palette, CreditCard, Shield, 
  Smartphone, LogOut, ChevronRight,
  Camera, Check, Mail, Globe, Sparkles,
  Moon, Sun, Laptop, Briefcase, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifs, setNotifs] = useState({
    jobs: true,
    interviews: true,
    progress: false,
    updates: true
  });

  const sections = [
    { id: 'profile', name: 'Profile Information', icon: User, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'security', name: 'Security & Password', icon: Lock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'notifications', name: 'Email Notifications', icon: Bell, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'appearance', name: 'Appearance', icon: Palette, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'subscription', name: 'Subscription Plan', icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 md:pl-72 lg:pl-80 transition-all duration-300">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <SettingsIcon className="w-8 h-8 text-primary" />
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Settings</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your account preferences, security, and notification settings.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="w-full lg:w-64 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeSection === section.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted/50 text-muted-foreground'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${activeSection === section.id ? 'bg-white/20' : section.bg}`}>
                        <section.icon size={18} className={activeSection === section.id ? 'text-white' : section.color} />
                      </div>
                      <span className="font-bold text-sm">{section.name}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${activeSection === section.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-border/50">
                  <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors group">
                    <div className="p-2 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <LogOut size={18} />
                    </div>
                    <span className="font-bold text-sm">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {activeSection === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-border/50 space-y-10"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-muted">
                            {user?.photoURL ? (
                              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                                {user?.displayName?.[0] || 'U'}
                              </div>
                            )}
                          </div>
                          <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Camera size={18} />
                          </button>
                        </div>
                        <div className="text-center md:text-left space-y-1">
                          <h2 className="text-2xl font-bold">{user?.displayName || 'CareerPrep User'}</h2>
                          <p className="text-muted-foreground">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Pro Member</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                          <Input defaultValue={user?.displayName || ''} className="h-12 rounded-xl bg-muted/20" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Email Address</label>
                          <Input defaultValue={user?.email || ''} disabled className="h-12 rounded-xl bg-muted/20 opacity-60" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Job Role</label>
                          <Input placeholder="e.g. Software Engineer" className="h-12 rounded-xl bg-muted/20" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Location</label>
                          <Input placeholder="e.g. Bangalore, India" className="h-12 rounded-xl bg-muted/20" />
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <Button className="h-12 px-8 rounded-xl font-bold bg-gradient-primary shadow-lg shadow-primary/20">
                          Save Changes
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'security' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-border/50 space-y-10"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
                        <p className="text-muted-foreground">Keep your account secure by updating your password and enabling protection.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Current Password</label>
                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">New Password</label>
                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Confirm New Password</label>
                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/20" />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10"><Shield className="text-blue-500" size={18} /></div>
                            <div>
                              <p className="font-bold text-sm">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Button className="h-12 px-8 rounded-xl font-bold bg-gradient-primary shadow-lg shadow-primary/20" onClick={() => toast.success("Password updated successfully!")}>
                          Update Password
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-border/50 space-y-10"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Email Notifications</h2>
                        <p className="text-muted-foreground">Choose what updates you want to receive in your inbox.</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: 'jobs', title: 'Job Match Alerts', desc: 'Get notified when new jobs match your resume', icon: Briefcase, color: 'text-blue-500' },
                          { id: 'interviews', title: 'Interview Reminders', desc: 'Stay updated on your upcoming mock interviews', icon: Bell, color: 'text-purple-500' },
                          { id: 'progress', title: 'Module Progress', desc: 'Weekly summary of your learning achievements', icon: TrendingUp, color: 'text-emerald-500' },
                          { id: 'updates', title: 'Product Updates', desc: 'News about new features and improvements', icon: Sparkles, color: 'text-orange-500' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-2xl border border-transparent hover:border-border/50 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl bg-muted/50 ${item.color}`}>
                                <item.icon size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                              </div>
                            </div>
                            <Switch 
                              checked={notifs[item.id as keyof typeof notifs]} 
                              onCheckedChange={(val) => setNotifs(prev => ({ ...prev, [item.id]: val }))}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 flex justify-end">
                        <Button 
                          variant="outline" 
                          className="h-12 px-8 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/10"
                          onClick={() => toast.success("Notification preferences saved!")}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'appearance' && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-border/50 space-y-10"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Theme Preferences</h2>
                        <p className="text-muted-foreground">Customize how CareerPrep looks on your device.</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'light', name: 'Light', icon: Sun, color: 'bg-orange-50' },
                          { id: 'dark', name: 'Dark', icon: Moon, color: 'bg-slate-900' },
                          { id: 'system', name: 'System', icon: Laptop, color: 'bg-muted' }
                        ].map((theme) => (
                          <button key={theme.id} className="flex flex-col gap-3 group">
                            <div className={`aspect-video w-full rounded-2xl ${theme.color} border-2 border-border/50 flex items-center justify-center transition-all group-hover:border-primary/50`}>
                              <theme.icon size={24} className={theme.id === 'light' ? 'text-orange-500' : 'text-primary'} />
                            </div>
                            <span className="text-sm font-bold">{theme.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10"><Sparkles className="text-emerald-500" size={18} /></div>
                            <div>
                              <p className="font-bold text-sm">Glassmorphism Effects</p>
                              <p className="text-xs text-muted-foreground">Enable subtle transparency on cards</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10"><Smartphone className="text-blue-500" size={18} /></div>
                            <div>
                              <p className="font-bold text-sm">Animations</p>
                              <p className="text-xs text-muted-foreground">Enable smooth UI transitions</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'subscription' && (
                    <motion.div
                      key="subscription"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-border/50 space-y-10"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Your Plan</h2>
                          <p className="text-muted-foreground">You are currently on the Pro Monthly subscription.</p>
                        </div>
                        <Badge className="bg-gradient-primary text-white border-none px-4 py-1.5 rounded-full font-bold">ACTIVE</Badge>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col md:flex-row items-end justify-between gap-6 relative z-10">
                          <div className="space-y-4">
                            <h3 className="text-3xl font-black text-primary">Pro Plan</h3>
                            <div className="space-y-2">
                              <p className="text-sm flex items-center gap-2 font-medium"><Check size={16} className="text-emerald-500" /> Unlimited Mock Interviews</p>
                              <p className="text-sm flex items-center gap-2 font-medium"><Check size={16} className="text-emerald-500" /> Advanced Resume AI Analysis</p>
                              <p className="text-sm flex items-center gap-2 font-medium"><Check size={16} className="text-emerald-500" /> Real-time Job Tracking</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold">$35.00<span className="text-sm text-muted-foreground">/mo</span></p>
                            <p className="text-xs text-muted-foreground mt-1">Next billing date: May 20, 2026</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-4">
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10">Cancel Subscription</Button>
                        <Button className="h-12 px-6 rounded-xl bg-muted text-foreground hover:bg-muted/80">Manage Billing</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

const Badge = ({ children, className, variant }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export default Settings;
