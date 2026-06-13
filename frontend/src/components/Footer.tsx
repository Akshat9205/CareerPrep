import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp, Heart, Sparkles, Zap, Target } from 'lucide-react';

const footerLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'Career Roles', href: '#roles' },
  { name: 'Success Stories', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Blog', href: '#blog' },
];

const companyLinks = [
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' },
  { name: 'Cookie Policy', href: '#cookies' },
  { name: 'GDPR Compliance', href: '#gdpr' },
];

const resourcesLinks = [
  { name: 'Career Guide', href: '#guide' },
  { name: 'Resume Templates', href: '#templates' },
  { name: 'Interview Tips', href: '#interviews' },
  { name: 'Salary Calculator', href: '#salary' },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-20 pb-10 bg-gradient-to-b from-background via-background/95 to-background/90 border-t border-border/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <a href="#home" className="flex items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors">CareerPrep</span>
              </a>
            </motion.div>
            
            <p className="text-muted-foreground leading-relaxed">
              Empowering your career journey with AI-driven insights, personalized guidance, and comprehensive skill development tools.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-110"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Resources
            </h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
            
            <div className="space-y-3 pt-4 border-t border-border/50">
              <a href="mailto:hello@careerprep.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@careerprep.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (234) 567-890</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/50"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span> 2024 CareerPrep. All rights reserved.</span>
            <span className="text-primary">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for career success
            </span>
          </div>
          
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Top</span>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};