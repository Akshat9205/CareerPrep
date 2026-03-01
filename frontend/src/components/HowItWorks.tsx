import { motion } from 'framer-motion';
import { UserPlus, BookOpen, FileText, Target, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in seconds',
  },
  {
    icon: BookOpen,
    title: 'Learn & Practice',
    description: 'Master English and ace interviews',
  },
  {
    icon: FileText,
    title: 'Resume Check',
    description: 'Optimize your resume for ATS',
  },
  {
    icon: Target,
    title: 'Internship Match',
    description: 'Get matched with opportunities',
  },
  {
    icon: Trophy,
    title: 'Get Hired',
    description: 'Land your dream internship',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[100px]" />
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
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Your Journey to <span className="gradient-text">Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From signup to hired — a clear path to your dream career.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center group"
              >
                {/* Icon Container */}
                <div className="relative mx-auto mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 w-[120px] h-[120px] mx-auto rounded-2xl bg-gradient-to-br from-card to-muted border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300"
                  >
                    <step.icon className="w-10 h-10 text-primary" />
                  </motion.div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">
                    {index + 1}
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};