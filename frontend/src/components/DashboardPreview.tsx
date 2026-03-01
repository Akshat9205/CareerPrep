import { motion } from 'framer-motion';
import { TrendingUp, FileCheck, Briefcase, BarChart3 } from 'lucide-react';

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
    <section id="dashboard" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
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
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            {/* Window Header */}
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground ml-4">careerprep.app/dashboard</span>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-foreground">{stat.value}%</span>
                    <span className="text-muted-foreground ml-2 text-sm">{stat.label}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
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
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Chart */}
              <div className="p-6 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-foreground">Weekly Progress</h4>
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-3 h-32">
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
              <div className="p-6 bg-muted/30 rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-6">Recent Activity</h4>
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
                      <span className="text-sm text-foreground flex-1">{activity.text}</span>
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