import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";
import "./MortgagePrediction.css";

const MortgagePrediction = ({ applicationId }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrediction = useCallback(async () => {
    if (!applicationId) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };
      const response = await axios.post(
        `http://localhost:8081/api/ml/predict/${applicationId}`,
        {},
        config,
      );
      setPrediction(response.data);
    } catch (err) {
      setError("Failed to load prediction");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  if (loading)
    return (
      <div
        className="prediction-loading"
        style={{
          padding: "20px",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        Loading prediction...
      </div>
    );
  if (error)
    return (
      <div
        className="prediction-error"
        style={{ padding: "20px", textAlign: "center", color: "#ff6b6b" }}
      >
        {error}
      </div>
    );
  if (!prediction) return null;

  const approvalData = [
    { name: "Approval Chance", value: prediction.approvalProbability },
    { name: "Risk", value: 100 - prediction.approvalProbability },
  ];

  const COLORS = ["#00e676", "#ff6b6b"];
  const riskFactors = prediction.factors || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prediction-container"
      style={{
        padding: "24px",
        marginTop: "20px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3
        className="prediction-title"
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#ffffff",
          marginBottom: "20px",
        }}
      >
        🤖 AI Mortgage Prediction
      </h3>

      <div
        className="prediction-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div
          className="prediction-chart"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={approvalData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {approvalData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1a2a4a",
                  border: "none",
                  borderRadius: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "28px",
                fontWeight: 800,
                color: "#00e676",
              }}
            >
              {prediction.approvalProbability}%
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Approval Chance
            </span>
          </div>
        </div>

        <div
          className="prediction-details"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "10px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Risk Score</span>
            <span style={{ fontWeight: 600, color: "#ffffff" }}>
              {prediction.riskScore}/100
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "12px 16px",
              background: "rgba(0,212,255,0.05)",
              borderRadius: "10px",
              borderLeft: "3px solid #00d4ff",
            }}
          >
            <span style={{ fontSize: "20px" }}>💡</span>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {prediction.recommendation}
            </p>
          </div>
        </div>
      </div>

      {riskFactors.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              marginBottom: "12px",
            }}
          >
            Risk Factors Analysis
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {riskFactors.map((factor, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.03)",
                  borderLeft: `3px solid ${factor.impact === "low" ? "#00e676" : factor.impact === "medium" ? "#ffd93d" : "#ff6b6b"}`,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontWeight: 500,
                    color: "#ffffff",
                    fontSize: "13px",
                  }}
                >
                  {factor.name}
                </span>
                <span
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "12px",
                  }}
                >
                  {factor.value}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "50px",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginTop: "4px",
                    background:
                      factor.impact === "low"
                        ? "rgba(0,230,118,0.1)"
                        : factor.impact === "medium"
                          ? "rgba(255,217,61,0.1)"
                          : "rgba(255,59,48,0.1)",
                    color:
                      factor.impact === "low"
                        ? "#00e676"
                        : factor.impact === "medium"
                          ? "#ffd93d"
                          : "#ff6b6b",
                  }}
                >
                  {factor.impact}
                </span>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {factor.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MortgagePrediction;
