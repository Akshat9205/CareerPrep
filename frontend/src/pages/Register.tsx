import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, User, UserCircle, Shield } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState<"user" | "admin">("user");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (userType === "user" && !fullName.trim()) return;
      if (!email.trim() || !password) return;
      
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsSubmitting(false);
        return;
      }

      await signUp(email, password);
      // In a real app with Firebase, you might update the user's profile with fullName here
      toast.success(`${userType === "admin" ? "Admin" : "User"} account created successfully!`);
      navigate(userType === "admin" ? "/admin/dashboard" : "/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      toast.success("Account created successfully with Google!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account with Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookSignIn = () => {
    toast.info("Facebook signup is coming soon!");
  };

  const isValid = (userType === "user" ? fullName.trim().length > 0 : true) && email.trim().length > 0 && password.length >= 6;

  return (
    <div className="h-screen w-full bg-[#3c2a21]/90 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden backdrop-blur-3xl relative">
      {/* Abstract Background Blur matching edge of the screen */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[1200px] h-[90vh] max-h-[800px] bg-white rounded-[2rem] shadow-2xl flex p-3 relative z-10 overflow-hidden">
        
        {/* Left Side - Image Showcase */}
        <div className="hidden lg:block w-1/2 h-full rounded-[1.5rem] overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
            alt="Students studying" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 h-full rounded-[1.5rem] overflow-hidden relative">
          <div className="h-full px-4 sm:px-8 xl:px-16 py-2 flex items-center justify-center">
            <div className="w-full max-w-[400px] flex flex-col items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-1 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-slate-800">CareerPrep</span>
            </Link>

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight text-center mb-2">
              Welcome to CareerPrep
            </h1>
            
            {/* User Type Selection */}
            <div className="w-full mb-3">
              <p className="text-xs text-slate-600 text-center mb-1">Register as:</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("user")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    userType === "user"
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    userType === "admin"
                      ? "border-purple-400 bg-purple-50 text-purple-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mb-3 leading-relaxed max-w-[340px]">
              {userType === "user" 
                ? "Join thousands of students and job seekers building their careers with CareerPrep."
                : "Manage and monitor the CareerPrep platform with powerful admin tools."
              }
            </p>

            {/* Email Registration Form */}
            <form onSubmit={onSubmit} className="w-full space-y-1 mb-3">
              {userType === "user" && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    autoComplete="off"
                    name="fullname_prevent_autofill"
                    className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 rounded-xl transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  autoComplete="off"
                  name="email_prevent_autofill"
                  className="w-full h-11 pl-11 pr-4 bg-[#eff5ff] border border-transparent focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 rounded-xl transition-all outline-none text-slate-700 placeholder:text-slate-500 shadow-sm text-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  autoComplete="new-password"
                  name="password_prevent_autofill"
                  className="w-full h-11 pl-11 pr-12 bg-[#eff5ff] border border-transparent focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 rounded-xl transition-all outline-none text-slate-700 placeholder:text-slate-500 shadow-sm text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-11 mt-2 bg-[#FEEADB] hover:bg-[#FCD8C1] text-[#C2410C] rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center disabled:opacity-60 disabled:pointer-events-none"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center justify-center mb-3 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-4 text-xs text-slate-400 font-medium">Or</span>
            </div>

            {/* Social Logins */}
            <div className="w-full flex gap-3">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="flex-1 h-11 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all text-sm font-semibold text-slate-700 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              
              <button 
                type="button"
                onClick={handleFacebookSignIn}
                className="flex-1 h-11 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all text-sm font-semibold text-slate-700 shadow-sm"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <div className="mt-3 text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to={userType === "admin" ? "/admin/login" : "/login"} className="text-[#C2410C] hover:text-[#9A3412] font-semibold transition-colors">
                Sign in
              </Link>
            </div>

            <div className="mt-1 text-[10px] text-slate-400 text-center">
              By signing up, you agree to our <a href="#" className="underline hover:text-slate-600 transition-colors">Terms of services</a> & <a href="#" className="underline hover:text-slate-600 transition-colors">Privacy policy</a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
