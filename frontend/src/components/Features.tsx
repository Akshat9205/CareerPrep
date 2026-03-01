import { motion } from 'framer-motion';
import { BookOpen, Users, FileCheck, Briefcase, BarChart3, Building2 } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'English Learning Modules',
    description: 'Master business English with AI-powered lessons tailored for corporate communication.',
  },
  {
    icon: Users,
    title: 'Interview Preparation',
    description: 'Practice with realistic mock interviews powered by AI and get instant feedback.',
  },
  {
    icon: FileCheck,
    title: 'Resume ATS Checker',
    description: 'Optimize your resume for applicant tracking systems used by top companies.',
  },
  {
    icon: Briefcase,
    title: 'Skill-based Matching',
    description: 'Get matched with internships that align perfectly with your skills and goals.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your improvement with detailed analytics and personalized insights.',
  },
  {
    icon: Building2,
    title: 'Company Resources',
    description: 'Access company-specific preparation materials and insider tips.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Features = () => {
  return (
    <section id="features" className="section-padding relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]" />
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
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Launch Your Career</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to take you from learning to landing your dream internship.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-card p-6 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};