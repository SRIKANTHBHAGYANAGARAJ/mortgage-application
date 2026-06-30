import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  const values = [
    {
      icon: "🎯",
      title: "Mission",
      description:
        "To make mortgage processing accessible, transparent, and efficient for everyone.",
    },
    {
      icon: "💡",
      title: "Innovation",
      description:
        "Leveraging cutting-edge AI and Snowflake analytics to deliver intelligent mortgage solutions.",
    },
    {
      icon: "🤝",
      title: "Trust",
      description:
        "Building confidence through transparency, security, and data-driven decisions.",
    },
    {
      icon: "🌍",
      title: "Impact",
      description:
        "Empowering individuals and families to achieve their dream of homeownership.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-background">
          <div className="gradient-sphere about-sphere-1"></div>
          <div className="gradient-sphere about-sphere-2"></div>
        </div>
        <div className="about-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="about-title">About Mortgage.IO</h1>
            <p className="about-subtitle">
              We're transforming the mortgage industry with intelligent
              technology, powered by AI and Snowflake's data platform.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="about-container">
        <div className="about-grid">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="value-card glass"
            >
              <span className="value-icon">{value.icon}</span>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="about-cta glass">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of satisfied customers who found their dream home
            with our help.
          </p>
          <button className="btn-primary">Start Your Journey</button>
        </div>
      </div>
    </div>
  );
};

export default About;
