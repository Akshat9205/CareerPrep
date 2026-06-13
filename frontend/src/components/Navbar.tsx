import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LayoutDashboard, BookOpen, LogOut, ChevronDown, Mail, Home, Sparkles, Info, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';


export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const isLandingPage = location.pathname === '/' || location.pathname === '';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground">CareerPrep</span>
          </a>


          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors mr-2"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              /* Profile dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm">
                    <User size={14} className="text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5">
                        {[
                          { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                          { label: 'Learning', icon: BookOpen, path: '/learning' },
                          { label: 'Profile', icon: User, path: '/profile' },
                          { label: 'Features', icon: Sparkles, path: '/features' },
                          { label: 'About Us', icon: Info, path: '/about-us' },
                          { label: 'Contact', icon: Mail, path: '/contact' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => { setIsProfileOpen(false); navigate(item.path); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
                          >
                            <item.icon size={16} className="text-muted-foreground" />
                            {item.label}
                          </button>
                        ))}

                        <div className="border-t border-border/60 mt-1 pt-1">
                          <button
                            onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25"
                  onClick={() => navigate('/login-choice')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-foreground"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              className="text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <div className="container-custom py-4 space-y-2">
            {user && (
              <>
                {[
                  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                  { label: 'Learning', icon: BookOpen, path: '/learning' },
                  { label: 'Profile', icon: User, path: '/profile' },
                  { label: 'Features', icon: Sparkles, path: '/features' },
                  { label: 'About Us', icon: Info, path: '/about-us' },
                  { label: 'Contact', icon: Mail, path: '/contact' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { setIsMobileMenuOpen(false); navigate(item.path); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <item.icon size={16} className="text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </>
            )}

            <div className="flex gap-3 pt-4">
              {user ? (
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                  >
                    Log in
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-primary text-primary-foreground"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login-choice'); }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};