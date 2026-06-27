import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const companies = [
  {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    gradient: 'from-orange-500 to-yellow-500',
    oaPattern: '2 DSA + 15 MCQs',
    focusAreas: ['Arrays', 'Greedy', 'Graphs'],
  },
  {
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    gradient: 'from-blue-500 to-green-500',
    oaPattern: '2 DSA + 10 MCQs',
    focusAreas: ['Trees', 'DP', 'Graphs'],
  },
  {
    name: 'Infosys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Infosys_logo.svg',
    gradient: 'from-blue-600 to-cyan-500',
    oaPattern: '1 DSA + 20 MCQs',
    focusAreas: ['Arrays', 'Strings', 'Math'],
  },
  {
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    gradient: 'from-blue-500 to-indigo-500',
    oaPattern: '2 DSA + 5 MCQs',
    focusAreas: ['DP', 'Graphs', 'Trees'],
  },
  {
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    gradient: 'from-blue-400 to-cyan-400',
    oaPattern: '2 DSA + 10 MCQs',
    focusAreas: ['Arrays', 'DP', 'Trees'],
  },
];

export const Roles = () => {
  const navigate = useNavigate();

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
            Company Wise Prep
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Prepare Exactly What <span className="gradient-text">Top Companies Ask</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Targeted preparation based on actual OA patterns and focus areas from leading tech companies.
          </p>
        </motion.div>

        {/* Company Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative glass-card p-6 h-full flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Gradient Border Effect — pointer-events-none so it never blocks clicks */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Top Gradient Line — pointer-events-none */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${company.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Logo */}
                <div className="h-12 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-full w-auto object-contain"
                  />
                </div>

                {/* Company Name */}
                <h3 className="text-xl font-bold mb-4 text-foreground">{company.name}</h3>

                {/* OA Pattern */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">OA PATTERN</p>
                  <p className="text-sm font-semibold text-foreground">{company.oaPattern}</p>
                </div>

                {/* Focus Areas */}
                <div className="mb-4 flex-grow">
                  <p className="text-xs text-muted-foreground mb-2">FOCUS AREAS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {company.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-0.5 text-xs rounded-full bg-muted text-foreground"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Prep Button — relative z-10 so it always sits above overlay divs */}
                <button
                  onClick={() => navigate(`/learning?company=${company.name.toLowerCase()}`)}
                  className={`relative z-10 w-full py-3 rounded-lg bg-gradient-to-r ${company.gradient} text-white text-sm font-medium flex items-center justify-center gap-2 hover:brightness-110 hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95`}
                >
                  Start Prep
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
