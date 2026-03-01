import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Now with AI-powered interviews</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Master English.</span>
              <br />
              <span className="gradient-text">Crack Interviews.</span>
              <br />
              <span className="text-foreground">Get Internships.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              An AI-powered platform that prepares students for real-world jobs — English, interviews, resumes, and internships in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 group"
              >
                Start Learning
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-muted group"
              >
                <Play className="mr-2 w-4 h-4" />
                View Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              {[
                { value: '50K+', label: 'Students' },
                { value: '95%', label: 'Placement Rate' },
                { value: '200+', label: 'Partner Companies' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-muted-foreground">Student Dashboard</span>
                </div>

                {/* Progress Cards */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">English Proficiency</span>
                      <span className="text-sm text-primary">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-primary rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Resume ATS Score</span>
                      <span className="text-sm text-green-500">92%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-green-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Interview Readiness</span>
                      <span className="text-sm text-secondary">78%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                        className="h-full bg-secondary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 glass-card p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Interview Completed</p>
                    <p className="text-xs text-muted-foreground">Google Mock</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-lg">🎯</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">3 New Matches</p>
                    <p className="text-xs text-muted-foreground">Internships</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};