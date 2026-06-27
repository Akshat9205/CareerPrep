import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer at Google',
    image: '👨‍💻',
    rating: 5,
    content: 'CareerPrep transformed my interview preparation. The AI mock interviews helped me crack Google\'s coding rounds. The company-wise prep was spot on!',
  },
  {
    name: 'Priya Patel',
    role: 'Data Analyst at Amazon',
    image: '👩‍💼',
    rating: 5,
    content: 'The resume AI feature got my resume past ATS systems. I landed 3 interview calls within a week of optimizing my resume on CareerPrep.',
  },
  {
    name: 'Amit Kumar',
    role: 'SDE at Microsoft',
    image: '👨‍🔬',
    rating: 5,
    content: 'The English proficiency modules helped me ace the communication rounds. The personalized learning path adapted to my weaknesses perfectly.',
  },
  {
    name: 'Sneha Reddy',
    role: 'Frontend Developer at Meta',
    image: '👩‍🎨',
    rating: 5,
    content: 'From struggling with DSA to cracking Meta\'s interview - CareerPrep\'s structured approach and company-specific patterns made all the difference.',
  },
  {
    name: 'Vikram Singh',
    role: 'Backend Developer at Infosys',
    image: '👨‍💻',
    rating: 5,
    content: 'The internship tracking feature helped me stay organized. I applied to 50+ companies and landed my dream role at Infosys.',
  },
  {
    name: 'Anjali Gupta',
    role: 'Full Stack Developer at Startup',
    image: '👩‍💻',
    rating: 5,
    content: 'The mock interviews with AI feedback were incredibly helpful. It felt like practicing with a real interviewer. Highly recommended!',
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-[120px]" />
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
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who have transformed their careers with CareerPrep
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative glass-card p-6 h-full overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary/20">
                  <Quote className="w-8 h-8" />
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500+', label: 'Placements' },
            { value: '50+', label: 'Partner Companies' },
            { value: '4.8★', label: 'Average Rating' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
