import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Briefcase, 
  Trophy, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { CheckoutModal } from './CheckoutModal';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Learning Center', icon: BookOpen, path: '/learning' },
  { name: 'Mock Interview', icon: PlayCircle, path: '/mock-interview' },
  { name: 'Resume AI', icon: FileText, path: '/resume-builder' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Job Tracker', icon: Briefcase, path: '/jobs' },
];

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-20 bottom-0 z-40 bg-background/50 backdrop-blur-xl border-r border-border transition-all duration-300 ease-in-out hidden md:flex flex-col",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex-1 flex flex-col p-4 gap-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 overflow-hidden",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn(
                "shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary-foreground" : "text-primary"
              )}>
                <item.icon size={22} />
              </div>
              
              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}

              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full ml-1"
                />
              )}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-border shadow-xl">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Pro Badge */}
      {!isCollapsed && (
        <div className="px-4 py-6">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-primary/20 rounded-2xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pro Access</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              Unlock AI resume reviews and unlimited mock interviews.
            </p>
            <Button 
              size="sm" 
              className="w-full h-8 text-[11px] bg-gradient-primary hover:opacity-90"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        userEmail={user?.email || ""} 
      />

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
        >
          <LogOut size={22} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-background shadow-lg z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  );
};
