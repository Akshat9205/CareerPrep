import { motion } from 'framer-motion';
import { BrainCircuit, Target, FileText, Users, Trophy, Sparkles, ArrowRight, CheckCircle, TrendingUp, Award } from 'lucide-react';

const steps = [
  {
    icon: BrainCircuit,
    title: 'AI Assessment',
    description: 'Get personalized career analysis with our AI-powered assessment that identifies your strengths and ideal career paths',
    features: ['Skills Analysis', 'Personality Match', 'Career Mapping'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Target,
    title: 'Skill Mastery',
    description: 'Master in-demand skills with adaptive learning paths, real-world projects, and expert mentorship',
    features: ['Interactive Courses', 'Live Projects', '1-on-1 Mentoring'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: FileText,
    title: 'Resume AI',
    description: 'Transform your resume with AI optimization that passes ATS systems and impresses recruiters',
    features: ['ATS Optimization', 'Keyword Enhancement', 'Design Templates'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Network Building',
    description: 'Connect with industry professionals, join exclusive communities, and access hidden job markets',
    features: ['Professional Network', 'Community Access', 'Referral Programs'],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Trophy,
    title: 'Career Launch',
    description: 'Land your dream role with interview preparation, salary negotiation, and continued career growth',
    features: ['Interview Coaching', 'Salary Negotiation', 'Career Growth'],
    color: 'from-indigo-500 to-purple-500'
  },
];

export const HowItWorks = () => {
  return (
    <section id="about-us" className="section-padding relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Career Transformation Process</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            From <span className="gradient-text">Potential</span> to{" "}
            <span className="gradient-text">Professional</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our proven 5-stage methodology transforms ambitious individuals into industry-ready professionals through AI-driven personalization and expert guidance.
          </p>
        </motion.div>

        {/* Enhanced Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-[80px] left-[8%] right-[8%] h-1">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Enhanced Icon Container */}
                <div className="relative mx-auto mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative z-10 w-[140px] h-[140px] mx-auto rounded-2xl bg-gradient-to-br from-card to-muted border border-border/50 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 shadow-lg"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <step.icon className="w-12 h-12 text-primary relative z-10" />
                  </motion.div>
                  
                  {/* Enhanced Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25"
                  >
                    {index + 1}
                  </motion.div>

                  {/* Enhanced Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                </div>

                {/* Enhanced Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Mobile Arrow */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="lg:hidden flex justify-center mt-8"
                  >
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent border border-secondary/10">
            <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Career Transformations</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
            <div className="text-3xl font-bold gradient-text mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};