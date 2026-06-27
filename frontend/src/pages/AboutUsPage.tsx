import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Target, Users, Award, Zap, Globe, Heart, Shield, TrendingUp, BookOpen, Briefcase, BrainCircuit, FileText, Building2 } from 'lucide-react';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '100+', label: 'Companies', icon: Building2 },
    { value: '95%', label: 'Success Rate', icon: Award },
    { value: '24/7', label: 'Support', icon: Shield }
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Learning',
      description: 'Our advanced AI algorithms personalize your learning journey, adapting to your strengths and weaknesses to maximize your potential.'
    },
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'Get detailed feedback on your resume with company-specific insights, ATS optimization, and improvement suggestions.'
    },
    {
      icon: Briefcase,
      title: 'Internship Matching',
      description: 'Real-time internship recommendations based on your skills, interests, and career goals from top companies worldwide.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Modules',
      description: 'Access structured learning modules for English communication, technical skills, interview preparation, and more.'
    },
    {
      icon: Target,
      title: 'Career Roadmaps',
      description: 'Personalized career roadmaps that guide you step-by-step from your current level to your dream job.'
    },
    {
      icon: Zap,
      title: 'Mock Interviews',
      description: 'Practice with AI-powered mock interviews that simulate real interview scenarios with instant feedback.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Student-First Approach',
      description: 'Every feature we build is designed with students in mind, ensuring accessibility and affordability for everyone.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We believe in democratizing career preparation, making world-class resources available to students everywhere.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'We constantly evolve our platform based on the latest industry trends and student feedback.'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container-custom max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Empowering Students to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Launch Their Careers</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                CareerPrep is an AI-powered career preparation platform designed to help students improve their English communication, prepare for interviews, optimize resumes for ATS systems, and discover their dream internships.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl border border-border/50">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container-custom max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                To bridge the gap between academic education and industry requirements by providing students with accessible, intelligent, and effective career preparation tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Democratize Access',
                  description: 'Making premium career preparation resources available to every student, regardless of their background or financial situation.'
                },
                {
                  title: 'Leverage AI',
                  description: 'Using cutting-edge artificial intelligence to provide personalized learning experiences and actionable insights.'
                },
                {
                  title: 'Drive Success',
                  description: 'Focusing on real outcomes - helping students land their dream internships and launch successful careers.'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 rounded-2xl border border-border/50"
                >
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container-custom max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-foreground">What We Offer</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                A comprehensive suite of tools designed to prepare you for every stage of your career journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container-custom max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-foreground">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do at CareerPrep.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="container-custom max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-3xl border border-border/50"
            >
              <h2 className="text-4xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  CareerPrep was born from a simple observation: while students work hard to build their skills, they often struggle to bridge the gap between academic knowledge and industry expectations. We saw talented individuals missing opportunities not because they lacked ability, but because they lacked guidance on how to present themselves effectively.
                </p>
                <p>
                  Our founders, having experienced this challenge firsthand, set out to create a solution. We built CareerPrep to be the mentor, coach, and guide that every student deserves - one that's available 24/7, personalized to each individual's needs, and powered by the latest in AI technology.
                </p>
                <p>
                  Today, we're proud to serve thousands of students worldwide, helping them prepare for interviews at top companies, optimize their resumes to pass ATS systems, improve their communication skills, and ultimately land their dream internships and jobs. But we're just getting started - our vision is to make quality career preparation accessible to every student, everywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-primary">
          <div className="container-custom max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-primary-foreground">Ready to Launch Your Career?</h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already preparing for their dream careers with CareerPrep.
              </p>
              <button className="px-8 py-4 rounded-xl bg-background text-foreground font-medium hover:bg-background/90 transition-all shadow-lg">
                Get Started Free
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
