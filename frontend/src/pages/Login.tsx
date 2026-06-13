import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password) return;
      await signIn(email, password);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("Successfully logged in with Google!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login with Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookSignIn = () => {
    toast.info("Facebook login is coming soon!");
  };

  const isValid = email.trim().length > 0 && password.length > 0;

  return (
    <div className="h-screen w-full bg-[#eceef3] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      <div className="w-full max-w-[1100px] h-[95vh] min-h-[600px] max-h-[800px] bg-gradient-to-br from-[#fcfcfc] to-[#f4f5f8] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row border border-white overflow-hidden relative">
        
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 lg:px-16 lg:py-12 flex flex-col relative z-10">
          {/* Logo Badge */}
          <div className="mb-auto">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-white shadow-sm hover:shadow-md transition-all">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="font-semibold text-slate-700 tracking-tight">CareerPrep</span>
            </Link>
          </div>

          <div className="my-auto w-full max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mb-10">
              Log in to continue your career preparation journey
            </p>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2 group">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  autoComplete="off"
                  name="email_prevent_autofill"
                  className="w-full bg-white/60 border border-white focus:border-indigo-300 h-14 rounded-full px-6 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    name="password_prevent_autofill"
                    className="w-full bg-white/60 border border-white focus:border-indigo-300 h-14 rounded-full pl-6 pr-14 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full mt-8 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-xl shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
              </button>
            </form>

            <div className="flex gap-4 mt-6">
              <button 
                type="button" 
                onClick={handleFacebookSignIn}
                className="flex-1 h-14 bg-white/80 rounded-full flex items-center justify-center gap-2 border border-white shadow-sm hover:shadow-md hover:bg-white transition-all"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-semibold text-slate-600">Facebook</span>
              </button>
              
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="flex-1 h-14 bg-white/80 rounded-full flex items-center justify-center gap-2 border border-white shadow-sm hover:shadow-md hover:bg-white transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-semibold text-slate-600">Google</span>
              </button>
            </div>
          </div>

          <p className="mt-auto text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right Side - Image Showcase */}
        <div className="hidden lg:block lg:w-[55%] relative p-4 pl-0">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Team discussing ideas" 
              className="w-full h-full object-cover"
            />
            {/* Soft dark overlay */}
            <div className="absolute inset-0 bg-slate-900/10" />

            {/* Floating Card: Activity */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-10 left-10 bg-[#FFD166]/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl w-64 border border-[#FFD166]/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Resume Review</h4>
                  <p className="text-xs text-slate-800/70 mt-0.5">09:30am - 10:00am</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-900 mt-1" />
              </div>
            </motion.div>

            {/* Floating Card: Calendar/Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[340px] bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl text-white"
            >
              <div className="flex justify-between items-center text-xs font-medium text-white/70 mb-3 px-1">
                <span className="flex flex-col items-center gap-1"><span>Sun</span><span className="text-lg text-white font-semibold">22</span></span>
                <span className="flex flex-col items-center gap-1"><span>Mon</span><span className="text-lg text-white font-semibold">23</span></span>
                <span className="flex flex-col items-center gap-1"><span>Tue</span><span className="text-lg text-white font-semibold">24</span></span>
                <span className="flex flex-col items-center gap-1"><span>Wed</span><span className="text-lg text-white font-semibold">25</span></span>
                <span className="flex flex-col items-center gap-1"><span>Thu</span><span className="text-lg text-white font-semibold">26</span></span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 text-slate-800 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-sm">Upcoming Interview</h5>
                    <p className="text-xs text-slate-500 mt-0.5">12:00pm - 01:00pm</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#FFD166]" />
                </div>
                
                <div className="flex items-center -space-x-2 mt-4">
                  <img src="https://i.pravatar.cc/100?img=1" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm bg-slate-200" alt="avatar" />
                  <img src="https://i.pravatar.cc/100?img=2" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm bg-slate-200" alt="avatar" />
                  <img src="https://i.pravatar.cc/100?img=3" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm bg-slate-200" alt="avatar" />
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm z-10">
                    +2
                  </div>
                </div>
              </div>
            </motion.div>

            {/* People Avatars Floating */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 right-12 flex flex-col items-end gap-2"
            >
              <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full border-2 border-white shadow-xl bg-slate-200 relative left-4" alt="avatar" />
              <img src="https://i.pravatar.cc/100?img=9" className="w-10 h-10 rounded-full border-2 border-white shadow-xl bg-slate-200 z-10" alt="avatar" />
              <img src="https://i.pravatar.cc/100?img=4" className="w-8 h-8 rounded-full border-2 border-white shadow-xl bg-slate-200 relative left-2" alt="avatar" />
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
