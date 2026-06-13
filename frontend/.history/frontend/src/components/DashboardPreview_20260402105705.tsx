import { motion } from 'framer-motion';
import { TrendingUp, FileCheck, Briefcase, BarChart3 } from 'lucide-react';
import { ParticleAnimation } from './ParticleAnimation';


const stats = [
  {
    icon: TrendingUp,
    label: 'English Score',
    value: 85,
    color: 'from-blue-500 to-cyan-500',
    change: '+12%',
  },
  {
    icon: FileCheck,
    label: 'ATS Score',
    value: 92,
    color: 'from-green-500 to-emerald-500',
    change: '+8%',
  },
  {
    icon: Briefcase,
    label: 'Match Rate',
    value: 78,
    color: 'from-purple-500 to-pink-500',
    change: '+15%',
  },
];

export const DashboardPreview = () => {
  return (
    <section id="dashboard" className="relative overflow-hidden section-padding">
      {/* Particle Animation Background */}
      <ParticleAnimation />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Dashboard
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Track Your <span className="gradient-text">Progress</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get real-time insights into your career readiness with our comprehensive dashboard.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="p-6 glass-card md:p-8 rounded-2xl">
            {/* Window Header */}
            <div className="flex items-center gap-3 pb-4 mb-8 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="ml-4 text-sm text-muted-foreground">careerprep.app/dashboard</span>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 transition-colors border bg-muted/30 rounded-xl border-border hover:border-primary/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-500">{stat.change}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-foreground">{stat.value}%</span>
                    <span className="ml-2 text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Progress Chart */}
              <div className="p-6 border bg-muted/30 rounded-xl border-border">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-foreground">Weekly Progress</h4>
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-end h-32 gap-3">
                  {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-secondary"
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 border bg-muted/30 rounded-xl border-border">
                <h4 className="mb-6 font-semibold text-foreground">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    { text: 'Completed Interview Module', time: '2h ago', color: 'bg-green-500' },
                    { text: 'Resume Updated', time: '5h ago', color: 'bg-blue-500' },
                    { text: 'New Internship Match', time: '1d ago', color: 'bg-purple-500' },
                    { text: 'English Assessment', time: '2d ago', color: 'bg-orange-500' },
                  ].map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                      <span className="flex-1 text-sm text-foreground">{activity.text}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};