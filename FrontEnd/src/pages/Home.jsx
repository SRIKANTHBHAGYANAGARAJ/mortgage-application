import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const hero = document.querySelector(".hero-section");
      const heroContent = document.querySelector(".hero-content");
      if (hero && heroContent) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🏠",
      title: "Smart Mortgage Calculator",
      description:
        "Get instant monthly payment estimates with our AI-powered calculator.",
      color: "#00d4ff",
    },
    {
      icon: "🤖",
      title: "AI Recommendations",
      description:
        "Receive personalized mortgage recommendations based on your financial profile.",
      color: "#6c5ce7",
    },
    {
      icon: "❄️",
      title: "Snowflake Analytics",
      description:
        "Real-time data processing and analytics powered by Snowflake.",
      color: "#00e676",
    },
    {
      icon: "📊",
      title: "Financial Dashboard",
      description:
        "Track all your applications and financial metrics in one place.",
      color: "#ff6b6b",
    },
    {
      icon: "🌍",
      title: "Global Analytics",
      description: "Compare mortgage rates and trends across global markets.",
      color: "#ffd93d",
    },
    {
      icon: "💬",
      title: "24/7 AI Assistant",
      description:
        "Get instant help and answers from our intelligent chatbot assistant.",
      color: "#ff9ff3",
    },
  ];

  const stats = [
    { value: "$2.5B+", label: "Mortgage Processed" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "15K+", label: "Happy Clients" },
    { value: "4.9★", label: "Average Rating" },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-sphere sphere-1"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <span className="hero-badge">
              <span className="badge-dot"></span>
              Powered by Snowflake ❄️
            </span>
            <h1 className="hero-title">
              Smart Mortgage
              <br />
              <span className="gradient-text">Solutions</span>
            </h1>
            <p className="hero-description">
              Get personalized mortgage recommendations and real-time analytics
              powered by AI and Snowflake data platform.
            </p>
            <div className="hero-buttons">
              <Link to="/calculator" className="btn-primary">
                Calculate Now
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/register" className="btn-secondary">
                Get Started
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-stats"
          >
            {stats.map((stat, index) => (
              <div key={index} className="stat-card glass">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-tag">Features</span>
            <h2 className="section-title">Why Choose Mortgage.IO</h2>
            <p className="section-description">
              Experience the future of mortgage processing with our advanced
              platform.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card glass"
                style={{ "--feature-color": feature.color }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container glass">
          <div className="cta-content">
            <h2>Ready to Find Your Dream Home?</h2>
            <p>
              Get started with your mortgage application today and receive
              personalized recommendations in minutes.
            </p>
            <Link to="/register" className="btn-primary cta-btn">
              Start Your Application
              <span className="btn-arrow">→</span>
            </Link>
          </div>
          <div className="cta-particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
