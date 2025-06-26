import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, BookOpen, Award, Rocket, Cpu, Shield } from 'lucide-react';

const team: React.FC = () => {
  const researchers = [
    {
      name: 'Milan Sahoo',
      role: 'Research & Development Lead',
      image: 'https://milanprotfiolio.vercel.app/images/image.png',
      bio: 'Technologist specializing in AI/ML and VR with published research in human-computer interaction. Currently leading R&D initiatives at Agnirath Aerospace.',
      achievements: [
        "Published in Journal of Modern Research",
        "Author in 'Artificial Intelligence Everywhere'",
        "R&D Team Lead at Agnirath Aerospace"
      ],
      publications: [
        "Virtual Reality and Human Experience (Journal of Modern Research)",
        "AI Applications in Aerospace (Book Chapter)"
      ],
      social: {
        linkedin: 'https://www.linkedin.com/in/milansahooms',
        github: 'https://github.com/Milan721166',
        mail: 'milansahoo7211662005@gmail.com'
      }
    },
    {
      name: 'Malay Maity',
      role: 'AI & Cybersecurity Specialist',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQFazpBw2SIxow/profile-displayphoto-shrink_400_400/B4DZZRxKc1GkAg-/0/1745128570373?e=1755734400&v=beta&t=_DBm7i6W-EvwvAdbSBE5vy6QBYtDGl0J9iWB1Kx9ftI',
      bio: 'Computer Science researcher focusing on secure AI systems and cybersecurity frameworks for next-gen applications.',
      achievements: [
        "Authored AI-Cybersecurity research papers",
        "Contributor to 'AI Everywhere' publication",
        "Developed secure ML models"
      ],
      publications: [
        "Exploring the Intersection of AI and Cybersecurity",
        "Secure Neural Networks for Food Delivery Systems"
      ],
      social: {
        linkedin: 'https://www.linkedin.com/in/malay21maity05',
        github: 'https://github.com/MalayMaity21',
        mail: 'maitymalay27747@gmail.com'
      }
    }
  ];

  const techDomains = [
    {
      icon: <Cpu className="w-8 h-8 text-indigo-600" />,
      title: "Artificial Intelligence",
      description: "Developing cutting-edge ML models for predictive analytics"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Cybersecurity",
      description: "Building secure systems for data protection"
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-600" />,
      title: "Aerospace Tech",
      description: "Applying AI in defense and space technologies"
    }
  ];

  // Function to handle social link clicks with proper URL formatting
  const handleSocialClick = (url: string) => {
    let formattedUrl = url;
    if (url.startsWith('www.')) {
      formattedUrl = 'https://' + url;
    } else if (!url.startsWith('http')) {
      formattedUrl = 'https://' + url;
    }
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Research Team
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              Pioneering innovation at the intersection of AI, cybersecurity, and aerospace technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Researchers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {researchers.map((researcher, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative">
                    <img 
                      src={researcher.image} 
                      alt={researcher.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r"></div>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{researcher.name}</h3>
                        <p className="text-indigo-600 font-medium">{researcher.role}</p>
                      </div>
                      <div className="flex space-x-3">
                        {researcher.social.linkedin && (
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSocialClick(researcher.social.linkedin)}
                            className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label={`Connect with ${researcher.name} on LinkedIn`}
                          >
                            <Linkedin className="w-5 h-5" />
                          </motion.button>
                        )}
                        {researcher.social.github && (
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSocialClick(researcher.social.github)}
                            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label={`View ${researcher.name}'s GitHub profile`}
                          >
                            <Github className="w-5 h-5" />
                          </motion.button>
                        )}
                        {researcher.social.mail && (
                          <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = `mailto:${researcher.social.mail}`}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label={`Email ${researcher.name}`}
                          >
                            <Mail className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-4 mb-6">{researcher.bio}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Key Achievements</h4>
                      <ul className="space-y-2">
                        {researcher.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Publications</h4>
                      <ul className="space-y-2">
                        {researcher.publications.map((pub, i) => (
                          <li key={i} className="flex items-start">
                            <BookOpen className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{pub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Domains */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technology Domains</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our research spans across these cutting-edge technological areas</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techDomains.map((domain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
                  {domain.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{domain.title}</h3>
                <p className="text-gray-600">{domain.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Interested in Collaborating?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We're open to research collaborations, academic partnerships, and innovative projects.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Contact Our Researchers
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default team;