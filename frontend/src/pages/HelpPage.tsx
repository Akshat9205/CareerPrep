import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, BookOpen, Video, FileText, ExternalLink, Search } from 'lucide-react';

const HelpPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I get started with CareerPrep?',
      answer: 'Simply sign up for a free account, complete your profile, and start exploring our learning modules. You can upload your resume for analysis, practice mock interviews, and access company-specific preparation materials.',
      category: 'Getting Started'
    },
    {
      question: 'Is CareerPrep free to use?',
      answer: 'Yes! CareerPrep offers a comprehensive free tier that includes access to learning modules, resume analysis, mock interviews, and internship recommendations. Premium features may be added in the future.',
      category: 'Pricing'
    },
    {
      question: 'How does the resume analysis work?',
      answer: 'Upload your resume (PDF or DOCX), select your target company, and our AI-powered system will analyze it against company-specific requirements. You\'ll receive a match score, skill gap analysis, and improvement suggestions.',
      category: 'Features'
    },
    {
      question: 'What companies do you support for resume analysis?',
      answer: 'We currently support analysis for major tech companies including Google, Amazon, Microsoft, Adobe, Meta, Atlassian, TCS, Infosys, Wipro, Accenture, and more. We regularly add new companies to our database.',
      category: 'Features'
    },
    {
      question: 'How accurate are the internship recommendations?',
      answer: 'Our internship recommendations are powered by real-time data from JSearch API and matched to your skill gaps. We provide match percentages to help you prioritize opportunities that align with your career goals.',
      category: 'Features'
    },
    {
      question: 'Can I track my progress on the platform?',
      answer: 'Yes! Your dashboard shows your progress across learning modules, interview practice sessions, and roadmap completion. You can also view your analysis history and track improvements over time.',
      category: 'Features'
    },
    {
      question: 'How do the mock interviews work?',
      answer: 'Our AI-powered mock interviews simulate real interview scenarios. You can practice technical questions, behavioral questions, and company-specific interviews. The system provides instant feedback on your responses.',
      category: 'Features'
    },
    {
      question: 'What is the career roadmap feature?',
      answer: 'The career roadmap generates a personalized 4-6 month plan based on your resume analysis. It includes monthly milestones, learning resources, project recommendations, and certification paths to help you reach your target company.',
      category: 'Features'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach us through the contact page or email directly at agakshat112005@gmail.com. We typically respond within 24 hours. For urgent matters, you can also call +91 8755827155.',
      category: 'Support'
    },
    {
      question: 'Is my data secure on CareerPrep?',
      answer: 'Absolutely. We use industry-standard encryption for data storage and transmission. Your resumes and personal information are never shared with third parties without your consent.',
      category: 'Privacy'
    },
    {
      question: 'Can I delete my account and data?',
      answer: 'Yes, you can request account deletion from your settings page. All your personal data, resumes, and analysis results will be permanently deleted within 30 days.',
      category: 'Privacy'
    },
    {
      question: 'Do you offer certifications upon completion?',
      answer: 'While we don\'t issue certificates directly, we recommend relevant industry certifications based on your career goals. Our roadmap feature guides you toward certifications valued by your target companies.',
      category: 'Learning'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

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
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-primary/10 border-primary/20">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Help Center</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">help you?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions, learn about our features, and get the support you need.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container-custom max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: 'Getting Started', color: 'from-blue-500 to-cyan-500' },
                { icon: Video, label: 'Video Tutorials', color: 'from-purple-500 to-pink-500' },
                { icon: FileText, label: 'Documentation', color: 'from-green-500 to-teal-500' },
                { icon: MessageSquare, label: 'Contact Support', color: 'from-orange-500 to-yellow-500' }
              ].map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container-custom max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to the most common questions about CareerPrep.
              </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setSearchQuery('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !searchQuery ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchQuery(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchQuery === category ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl border border-border/50 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-foreground">{faq.question}</h3>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/50"
                    >
                      <p className="p-6 text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container-custom max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 rounded-2xl border border-border/50"
            >
              <h2 className="text-3xl font-bold mb-4 text-foreground text-center">Still need help?</h2>
              <p className="text-muted-foreground text-center mb-8">
                Can't find what you're looking for? Reach out to our support team directly.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <a
                  href="mailto:agakshat112005@gmail.com"
                  className="flex items-center gap-4 p-6 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Us</p>
                    <p className="text-sm text-muted-foreground">agakshat112005@gmail.com</p>
                  </div>
                </a>

                <a
                  href="tel:+8755827155"
                  className="flex items-center gap-4 p-6 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Call Us</p>
                    <p className="text-sm text-muted-foreground">+91 8755827155</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">Located in Agra, Uttar Pradesh, India</p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
                >
                  Visit Contact Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
