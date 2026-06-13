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










































//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}







//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}







//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}







//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}







//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}







//   {/*
// export const Contact = () => {
//   return (
//     <section className="section-padding border-t border-border relative">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-[120px]" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-[100px]" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
//             <MessageSquare className="w-4 h-4 text-green-500" />
//             <span className="text-sm text-green-700 dark:text-green-400">We'd love to hear from you</span>
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//             <span className="text-foreground">Get in </span>
//             <span className="gradient-text">Touch</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Have questions, feedback, or want to collaborate? Reach out to our team and we'll get back to you within 24 hours.
//           </p>
//         </motion.div>

//         {/* Contact Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           {contactInfo.map((item, i) => (
//             <motion.a
//               key={item.label}
//               href={item.href}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 glow-effect group cursor-pointer"
//             >
//               <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
//                 <item.icon className="w-6 h-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
//                 <p className="font-semibold text-foreground">{item.value}</p>
//               </div>
//             </motion.a>
//           ))}
//         </div>

//         {/* Two-column: Form + Team */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">

//           {/* Contact Form */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             transition={{ duration: 0.6 }}
//             className="glass-card p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-500 border border-border/50 hover:border-green-500/20"
//           >
//             <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
//             <p className="text-muted-foreground mb-8 text-sm">Fill out the form below and we'll respond as soon as possible.</p>

//             <form className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     First Name
//                   </label>
//                   <input
//                     id="contact-first-name"
//                     type="text"
//                     placeholder="John"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4 text-green-500" />
//                     Last Name
//                   </label>
//                   <input
//                     id="contact-last-name"
//                     type="text"
//                     placeholder="Doe"
//                     className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <AtSign className="w-4 h-4 text-green-500" />
//                   Email
//                 </label>
//                 {/* <input
//                   id="contact-email"
//                   type="email"
//                   placeholder="john@example.com"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-green-500" />
//                   Subject
//                 </label>
//                 <input
//                   id="contact-subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
//                   <MessageSquare className="w-4 h-4 text-green-500" />
//                   Message
//                 </label>
//                 <textarea
//                   id="contact-message"
//                   rows={5}
//                   placeholder="Tell us more about your query..."
//                   className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 hover:border-green-500/30 resize-none"
//                 />
//               </div>

//               <Button
//                 id="contact-submit"
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 group transition-all duration-300"
//                 size="lg"
//               >
//                 Send Message
//                 <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>
//           </motion.div>

//           {/* Team Contacts */}
//           <div>
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               transition={{ duration: 0.5 }}
//               className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10"
//             >
//               <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
//               <p className="text-muted-foreground text-sm">4 developers building CareerPrep. Reach out to any of us directly.</p>
//             </motion.div>

//             <div className="space-y-4">
//               {teamContacts.map((member, i) => (
//                 <motion.div
//                   key={member.name}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={fadeUp}
//                   transition={{ duration: 0.5, delay: i * 0.1 }}
//                   className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
//                 >
//                   {/* Avatar */}
//                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <span className="text-white font-bold text-lg">{member.avatar}</span>
//                   </div>

//                   {/* Info */}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-foreground">{member.name}</p>
//                     <p className="text-xs text-green-500 mb-2">{member.role}</p>
//                     <div className="flex flex-col gap-1">
//                       <a href={`mailto:${member.email}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Mail className="w-3 h-3" /> {member.email}
//                       </a>
//                       <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
//                         <Phone className="w-3 h-3" /> {member.phone}
//                       </a>
//                     </div>
//                   </div>

//                   {/* Social */}
//                   <div className="flex flex-col gap-2">
//                     <a href={member.github} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Github className="w-4 h-4" />
//                     </a>
//                     <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
//                       className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-300 group-hover:scale-110">
//                       <Linkedin className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }; */}



