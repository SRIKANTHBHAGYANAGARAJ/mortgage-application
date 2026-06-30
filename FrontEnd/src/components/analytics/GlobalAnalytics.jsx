import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import "./GlobalAnalytics.css";

const GlobalAnalytics = () => {
  const [trends, setTrends] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trendsRes, competitorsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/ml/global-trends"),
        axios.get("http://localhost:8081/api/ml/competitors"),
      ]);
      setTrends(trendsRes.data);
      setCompetitors(competitorsRes.data);
    } catch (error) {
      console.error("Failed to fetch global analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className="analytics-loading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "rgba(255,255,255,0.5)",
          fontSize: "18px",
        }}
      >
        Loading global data... 🌍
      </div>
    );

  return (
    <div className="global-analytics">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="analytics-header"
      >
        <h2 className="analytics-title">🌍 Global Mortgage Analytics</h2>
        <p className="analytics-subtitle">
          Real-time market trends and competitor insights
        </p>
      </motion.div>

      <div className="analytics-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="trends-card glass"
        >
          <h4 className="card-title">Market Trends</h4>
          <div className="trend-stats">
            <div className="trend-stat">
              <span className="stat-label">Average Rate</span>
              <span className="stat-value">
                {trends?.averageRate || "N/A"}%
              </span>
            </div>
            <div className="trend-stat">
              <span className="stat-label">Trend</span>
              <span className={`stat-value trend-${trends?.trend}`}>
                {trends?.trend || "stable"} 📈
              </span>
            </div>
            <div className="trend-stat">
              <span className="stat-label">Year over Year</span>
              <span className="stat-value">
                {trends?.yearOverYear || "N/A"}%
              </span>
            </div>
            <div className="trend-stat">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">
                {trends?.lastUpdated
                  ? new Date(trends.lastUpdated).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="competitors-card glass"
        >
          <h4 className="card-title">Competitor Analysis</h4>
          <div className="competitor-list">
            {competitors.map((comp, index) => (
              <div key={index} className="competitor-item">
                <span className="comp-name">{comp.name}</span>
                <span className="comp-rate">{comp.rate}%</span>
                <span className="comp-fee">Fee: {comp.fee}%</span>
                <span className="comp-satisfaction">
                  ⭐ {comp.customerSatisfaction}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="competitor-chart glass"
      >
        <h4 className="card-title">Competitor Rate Comparison</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={competitors}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                background: "#1a2a4a",
                border: "none",
                borderRadius: "10px",
              }}
            />
            <Legend />
            <Bar dataKey="rate" fill="#00d4ff" name="Interest Rate %" />
            <Bar dataKey="marketShare" fill="#6c5ce7" name="Market Share %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default GlobalAnalytics;
