import { motion } from 'framer-motion';
import { GraduationCap, Settings, Building } from 'lucide-react';

const roles = [
  {
    icon: GraduationCap,
    title: 'Student / Job Seeker',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Learn English with AI tutors',
      'Practice mock interviews',
      'Optimize your resume',
      'Track your progress',
    ],
  },
  {
    icon: Settings,
    title: 'Platform Admin',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Manage courses & content',
      'Verify internship listings',
      'Monitor user analytics',
      'Ensure quality control',
    ],
  },
  {
    icon: Building,
    title: 'Company / Recruiter',
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Post internship openings',
      'Filter qualified candidates',
      'Set English requirements',
      'Save hiring time',
    ],
  },
];

export const Roles = () => {
  return (
    <section id="roles" className="section-padding relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Who It's For
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Built for <span className="gradient-text">Every Stakeholder</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A unified platform serving students, administrators, and recruiters with tailored experiences.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative glass-card p-8 h-full overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Top Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-6 text-foreground">{role.title}</h3>

                {/* Features List */}
                <ul className="space-y-4">
                  {role.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};