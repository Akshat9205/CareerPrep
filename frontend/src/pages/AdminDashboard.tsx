import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, TrendingUp, LogOut, Shield, RefreshCw, Mail,
  Calendar, Clock, Search, User, BookOpen, Eye, EyeOff, Check,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

interface ModuleRecord {
  _id: string;
  moduleId: string;
  title: string;
  duration: string;
  category: string;
  type: string;
  published: boolean;
  createdAt: string;
}

// All basic modules (hardcoded — same as LearningModules.tsx)
const BASIC_MODULES = [
  { title: "Grammar Fundamentals for Tech Roles", duration: "1.5 hours", category: "Grammar", type: "basic" },
  { title: "Professional Workplace Vocabulary", duration: "2 hours", category: "Vocabulary", type: "basic" },
  { title: "Formal Email & Written Communication", duration: "1 hour", category: "Writing", type: "basic" },
  { title: "Speaking Confidently in Meetings", duration: "2.5 hours", category: "Communication", type: "basic" },
  { title: "Structuring Common Interview Answers", duration: "1.5 hours", category: "Interview Prep", type: "basic" },
  { title: "Small Talk & Networking English", duration: "45 mins", category: "Communication", type: "basic" },
];

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "modules">("users");
  const [adminEmail, setAdminEmail] = useState("");

  // Users
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Modules
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const email = localStorage.getItem("adminEmail");
    if (!isAdmin || isAdmin !== "true") {
      toast.error("Access denied. Admin login required.");
      navigate("/admin/login");
      return;
    }
    setAdminEmail(email || "");
    fetchUsers();
    initAndFetchModules();
  }, [navigate]);

  useEffect(() => {
    const q = userSearch.toLowerCase();
    setFilteredUsers(
      !q ? users : users.filter(u =>
        u.email.toLowerCase().includes(q) ||
        (u.displayName || "").toLowerCase().includes(q) ||
        u.authProvider.toLowerCase().includes(q)
      )
    );
  }, [userSearch, users]);

  // ── Users ──────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
      setLastRefreshed(new Date());
    } catch {
      toast.error("Could not load users. Is the backend running?");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // ── Modules ────────────────────────────────────────────────────────────────
  const initAndFetchModules = async () => {
    setIsLoadingModules(true);
    try {
      // Seed the hardcoded modules into DB if not already there
      await fetch(`${BACKEND_URL}/api/modules/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: BASIC_MODULES }),
      });
      // Then fetch all
      const res = await fetch(`${BACKEND_URL}/api/admin/modules`);
      const data = await res.json();
      if (data.success) setModules(data.modules || []);
    } catch {
      toast.error("Could not load modules.");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleTogglePublish = async (mod: ModuleRecord) => {
    setTogglingId(mod.moduleId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/modules/${mod.moduleId}/publish`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.module.published
        ? `✅ "${mod.title}" is now Live`
        : `🔒 "${mod.title}" hidden from students`);
      // Update local state without full refetch
      setModules(prev => prev.map(m => m.moduleId === mod.moduleId ? { ...m, published: data.module.published } : m));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    toast.success("Logged out");
    navigate("/admin/login");
  };

  // ── Formatting helpers ─────────────────────────────────────────────────────
  const formatDate = (d: string) => !d ? "—" : new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formatTime = (d: string) => {
    if (!d) return "—";
    const ms = Date.now() - new Date(d).getTime();
    const mins = Math.floor(ms / 60000), hrs = Math.floor(mins / 60), days = Math.floor(hrs / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days === 1) return "Yesterday";
    return formatDate(d);
  };
  const providerBadge = (p: string) => {
    const map: Record<string, string> = { google: "bg-red-500/15 text-red-400", email: "bg-blue-500/15 text-blue-400", github: "bg-gray-500/15 text-gray-300" };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[p?.toLowerCase()] || "bg-purple-500/15 text-purple-400"}`}>{p || "Email"}</span>;
  };

  const todayLogins = users.filter(u => new Date(u.lastLogin).toDateString() === new Date().toDateString()).length;
  const thisMonthUsers = users.filter(u => { const c = new Date(u.createdAt), n = new Date(); return c.getMonth() === n.getMonth() && c.getFullYear() === n.getFullYear(); }).length;
  const publishedCount = modules.filter(m => m.published).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">Admin Dashboard</span>
              <span className="ml-2 text-xs bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full">CareerPrep</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{adminEmail}</span>
            <Button variant="ghost" size="sm" onClick={fetchUsers} disabled={isLoadingUsers} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoadingUsers ? "animate-spin" : ""}`} />
              <span className="hidden sm:block">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8 space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-1">Welcome back, Admin 👋</h1>
          <p className="text-muted-foreground text-sm">
            Manage users and control which learning modules are visible to students.
            {lastRefreshed && <span className="ml-2">Last updated: {lastRefreshed.toLocaleTimeString()}</span>}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { title: "Total Users", value: isLoadingUsers ? "..." : users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Active Today", value: isLoadingUsers ? "..." : todayLogins, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
            { title: "Total Modules", value: isLoadingModules ? "..." : modules.length, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: "Published", value: isLoadingModules ? "..." : publishedCount, icon: Eye, color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`${stat.bg} p-1.5 rounded-lg`}><stat.icon className={`h-3.5 w-3.5 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit border border-border/50">
          {(["users", "modules"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "users"
                ? <span className="flex items-center gap-2"><Users className="w-4 h-4" />Users</span>
                : <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Modules</span>}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl"><Users className="w-5 h-5" />Registered Users</CardTitle>
                    <CardDescription className="mt-1">All users who have signed up and logged in to CareerPrep</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><Users className="w-8 h-8 text-muted-foreground" /></div>
                    <p className="font-medium">{userSearch ? "No users match your search" : "No users registered yet"}</p>
                    <p className="text-sm text-muted-foreground">{userSearch ? "Try a different term" : "Users will appear here once they sign up"}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">#</th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground"><span className="flex items-center gap-1"><User className="w-3 h-3" />Name</span></th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Mail className="w-3 h-3" />Email</span></th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Provider</th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined</span></th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last Login</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={user.uid} className="border-b border-border/40 hover:bg-muted/40 transition-colors">
                            <td className="py-3 px-4 text-muted-foreground">{index + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {(user.displayName || user.email).charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{user.displayName || <span className="text-muted-foreground italic">Not set</span>}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4">{providerBadge(user.authProvider)}</td>
                            <td className="py-3 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                            <td className="py-3 px-4"><span className="text-foreground font-medium">{formatTime(user.lastLogin)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-muted-foreground text-right mt-3">Showing {filteredUsers.length} of {users.length} users</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── MODULES TAB ── */}
        {activeTab === "modules" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl"><BookOpen className="w-5 h-5" />Learning Modules</CardTitle>
                  <CardDescription className="mt-1">
                    Toggle which modules are <strong>visible to students</strong> on the Learning page.
                    <span className="ml-1 text-green-500 font-medium">{publishedCount} published</span>
                    <span className="text-muted-foreground"> · </span>
                    <span className="text-yellow-500 font-medium">{modules.length - publishedCount} hidden</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingModules ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading modules...</p>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground">No modules found. Refresh the page to initialize.</p>
                    <Button variant="outline" onClick={initAndFetchModules}><RefreshCw className="w-4 h-4 mr-2" />Initialize Modules</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod) => (
                      <div
                        key={mod._id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          mod.published
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-muted/30 border-border/50 opacity-70"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Status indicator */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${mod.published ? "bg-green-500/15" : "bg-muted"}`}>
                            {mod.published
                              ? <Check className="w-4 h-4 text-green-500" />
                              : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className={`font-medium ${!mod.published && "text-muted-foreground"}`}>{mod.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{mod.duration}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{mod.category}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant={mod.published ? "outline" : "default"}
                          disabled={togglingId === mod.moduleId}
                          onClick={() => handleTogglePublish(mod)}
                          className={mod.published
                            ? "h-8 text-xs text-muted-foreground hover:text-red-500 hover:border-red-500/30"
                            : "h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          }
                        >
                          {togglingId === mod.moduleId
                            ? <RefreshCw className="w-3 h-3 animate-spin" />
                            : mod.published
                              ? <><EyeOff className="w-3 h-3 mr-1.5" />Hide</>
                              : <><Eye className="w-3 h-3 mr-1.5" />Publish</>
                          }
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
