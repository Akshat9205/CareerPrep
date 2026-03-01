import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Card */}
          <div className="relative glass-card p-8 md:p-12 lg:p-16 rounded-3xl text-center overflow-hidden">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-primary via-secondary to-primary -z-10" />
            <div className="absolute inset-[1px] rounded-3xl bg-card -z-10" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Start Free Today</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Your Career Preparation
                <br />
                <span className="gradient-text">Starts Here</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of students who have transformed their careers with our AI-powered platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25 group text-base px-8"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-muted text-base"
                >
                  Schedule Demo
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free forever plan available
              </p>
            </motion.div>

            {/* Decorative Orbs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};