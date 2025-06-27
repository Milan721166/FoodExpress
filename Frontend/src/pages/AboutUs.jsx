import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, Lightbulb, Shield, Users, Globe } from 'lucide-react';
import teamMember1 from '../images/milan.png'; // Update with your image path
import teamMember2 from '../images/malay.png'; // Update with your image path
import '../css/AboutUs.css'; // Ensure you have the correct CSS file for styling

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Milan Sahoo',
      role: 'Co-Founder & CTO',
      image: teamMember1,
      bio: 'Technology visionary with expertise in AI/ML and immersive technologies. Leads our technical strategy and product development.',
      contributions: [
        "Architected our core technology platform",
        "Pioneered our AI research initiatives",
        "Built our engineering culture"
      ],
      funFact: "Published author on human-computer interaction",
      social: {
        linkedin: 'https://www.linkedin.com/in/milansahooms',
        github: 'https://github.com/Milan721166',
        mail: 'milansahoo7211662005@gmail.com'
      }
    },
    {
      name: 'Malay Maity',
      role: 'Co-Founder & CSO',
      image: teamMember2,
      bio: 'Security expert focused on building trustworthy AI systems. Oversees our security strategy and research direction.',
      contributions: [
        "Developed our security framework",
        "Led our responsible AI initiatives",
        "Established research partnerships"
      ],
      funFact: "Avid contributor to open-source AI projects",
      social: {
        linkedin: 'https://www.linkedin.com/in/malay21maity05',
        github: 'https://github.com/MalayMaity21',
        mail: 'maitymalay27747@gmail.com'
      }
    }
  ];

  const ourValues = [
    {
      icon: <Lightbulb className="value-icon" />,
      title: "Innovation",
      description: "We challenge conventions to build transformative solutions"
    },
    {
      icon: <Shield className="value-icon" />,
      title: "Integrity",
      description: "We build trustworthy systems with ethical foundations"
    },
    {
      icon: <Users className="value-icon" />,
      title: "Collaboration",
      description: "We believe the best solutions come from diverse perspectives"
    },
    {
      icon: <Globe className="value-icon" />,
      title: "Impact",
      description: "We measure success by our positive influence on society"
    }
  ];

  const companyStats = [
    { value: "2+", label: "Years of Innovation" },
    { value: "5+", label: "Research Papers Published" },
    { value: "100%", label: "Passionate Team" },
    { value: "∞", label: "Future Possibilities" }
  ];

 const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        ease: "easeInOut" // Standard easing
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" // Standard easing instead of cubic-bezier
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeIn" // Standard easing
      }
    }
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" // Standard easing
      }
    }
  };


  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="about-page">
      
      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="section-header"
          >
            <motion.h2 variants={fadeInUp}>Meet Our Founders</motion.h2>
            <motion.p variants={fadeInUp}>The visionary leaders driving our mission forward</motion.p>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="team-card"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="member-image-container">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="member-details">
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="bio">{member.bio}</p>
                  
                  <div className="contributions">
                    <h4>Key Contributions</h4>
                    <ul>
                      {member.contributions.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="social-links">
                    {Object.entries(member.social).map(([key, value]) => (
                      <motion.a
                        key={key}
                        href={key === 'mail' ? `mailto:${value}` : value}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {key === 'linkedin' && <Linkedin />}
                        {key === 'github' && <Github />}
                        {key === 'mail' && <Mail />}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="section-header"
          >
            <motion.h2 variants={fadeInUp}>Our Core Values</motion.h2>
            <motion.p variants={fadeInUp}>The principles that guide everything we do</motion.p>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            {ourValues.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                variants={scaleUp}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="icon-container"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {value.icon}
                </motion.div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            {companyStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <motion.p 
                  className="stat-value"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Want to Join Our Journey?</h2>
            <p>We're always looking for passionate individuals who share our vision</p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Opportunities
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;