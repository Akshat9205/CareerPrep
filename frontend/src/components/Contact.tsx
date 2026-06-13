import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, MessageSquare, User, AtSign, FileText, Clock, CheckCircle, XCircle, AlertCircle, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const teamContacts = [
  {
    name: 'Akshat Agarwal',
    role: 'Full Stack Lead',
    email: 'akshat@careerprep.dev',
    phone: '+91 87654 32109',
    github: '#',
    linkedin: '#',
    avatar: 'AA',
    color: 'from-green-500 to-teal-500',
  },
  {
    name: 'Abhinav Tripathi',
    role: 'Backend Developer',
    email: 'abhinav@careerprep.dev',
    phone: '+91 98765 43210',
    github: '#',
    linkedin: '#',
    avatar: 'AT',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Ishita Ranjan',
    role: 'Frontend Developer',
    email: 'ishita@careerprep.dev',
    phone: '+91 91234 56789',
    github: '#',
    linkedin: '#',
    avatar: 'IR',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Aditya Verma',
    role: 'UI/UX & Resume Module',
    email: 'adityav@careerprep.dev',
    phone: '+91 99887 76655',
    github: '#',
    linkedin: '#',
    avatar: 'AV',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    name: 'Aditya',
    role: 'Full stack developer',
    email: 'aditya@careerprep.dev',
    phone: '+91 93456 78901',
    github: '#',
    linkedin: '#',
    avatar: 'AD',
    color: 'from-rose-500 to-red-500',
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'support@careerprep.dev',
    href: 'mailto:support@careerprep.dev',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Pune, Maharashtra, India',
    href: '#',
  },
];

const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM IST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM IST' },
  { day: 'Sunday', hours: 'Closed' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-gray-900' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:text-blue-600' },
  { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-blue-400' },
  { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-500' },
  { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-500' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding border-t border-border relative">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Get in </span>
            <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Two-column: Form + Team */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
          >
            <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
            <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    First Name
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-green-500" />
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us more about your query..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
                />
              </div>

              <Button
                id="contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
                size="lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Team Contacts */}
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
            >
              <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
              <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
            </motion.div>

            <div className="space-y-4">
              {teamContacts.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
                >
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-green-500 mb-2">{member.role}</p>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {member.email}
                      </a>
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {member.phone}
                      </a>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="flex flex-col gap-2">
                    <a href={member.github} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};























