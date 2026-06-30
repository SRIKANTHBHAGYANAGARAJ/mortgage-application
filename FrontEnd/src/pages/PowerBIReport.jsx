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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import "./PowerBIReport.css";

const PowerBIReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [statistics, setStatistics] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({});
  const [embedConfig, setEmbedConfig] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchPowerBIData();
  }, []);

  const fetchPowerBIData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };

      const [statsRes, dataRes, statusRes, embedRes, userRes, reportsRes] =
        await Promise.all([
          axios.get("http://localhost:8081/api/powerbi/statistics", config),
          axios.get("http://localhost:8081/api/powerbi/report-data", config),
          axios.get(
            "http://localhost:8081/api/powerbi/status-distribution",
            config,
          ),
          axios.get("http://localhost:8081/api/powerbi/embed-config", config),
          axios.get("http://localhost:8081/api/powerbi/user", config),
          axios.get("http://localhost:8081/api/powerbi/reports", config),
        ]);

      setStatistics(statsRes.data);
      setReportData(dataRes.data);
      setStatusDistribution(statusRes.data);
      setEmbedConfig(embedRes.data);
      setUserInfo(userRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      setError("Failed to load Power BI data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = Object.entries(statusDistribution).map(
    ([name, value]) => ({
      name: name.replace("_", " "),
      value: value,
    }),
  );

  const COLORS = ["#00e676", "#ffd93d", "#ff6b6b", "#6c5ce7"];

  const formatCurrency = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="powerbi-loading">
        <div className="loading-spinner">⏳</div>
        <h2>Connecting to Microsoft Graph...</h2>
        <p>Loading Power BI Dashboard</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="powerbi-error">
        <span className="error-icon">❌</span>
        <h2>{error}</h2>
        <p>Make sure your Azure credentials are configured</p>
        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const isLive = embedConfig?.mode === "live" && embedConfig?.isConfigured;

  return (
    <div className="powerbi-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="powerbi-header"
      >
        <div className="header-left">
          <h1>📊 Power BI Dashboard</h1>
          <p>Real-time mortgage analytics powered by Microsoft Graph</p>
        </div>
        <div className="header-right">
          <span className={`status-badge ${isLive ? "live" : "preview"}`}>
            {isLive ? "🔴 LIVE" : "🔵 Preview"}
          </span>
          {userInfo && (
            <span className="user-badge">
              👤 {userInfo.displayName || "User"}
            </span>
          )}
        </div>
      </motion.div>

      {/* User Info */}
      {userInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-info-card glass"
        >
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <h4>{userInfo.displayName}</h4>
            <p>{userInfo.email}</p>
          </div>
          <span className="connection-status online">
            {isLive ? "✅ Connected to Microsoft Graph" : "🔵 Preview Mode"}
          </span>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="statistics-grid"
      >
        <div className="stat-card glass">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-value">
              {statistics?.totalApplications || 0}
            </span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>
        <div className="stat-card glass">
          <span className="stat-icon">🏠</span>
          <div className="stat-info">
            <span className="stat-value">
              {formatCurrency(statistics?.averagePropertyPrice)}
            </span>
            <span className="stat-label">Avg Property Price</span>
          </div>
        </div>
        <div className="stat-card glass">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-value">
              {formatCurrency(statistics?.averageMonthlyPayment)}
            </span>
            <span className="stat-label">Avg Monthly Payment</span>
          </div>
        </div>
        <div className="stat-card glass">
          <span className="stat-icon">📈</span>
          <div className="stat-info">
            <span className="stat-value">
              {Math.round(statistics?.averageCreditScore || 0)}
            </span>
            <span className="stat-label">Avg Credit Score</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="powerbi-tabs">
        <button
          className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          📊 Dashboard Preview
        </button>
        <button
          className={`tab-btn ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          📋 Data Table
        </button>
      </div>

      {/* Dashboard Preview */}
      {activeTab === "preview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="powerbi-preview glass"
        >
          <div className="charts-grid">
            <div className="chart-card glass">
              <h4>Applications by Status</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusChartData.map((entry, index) => (
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card glass">
              <h4>Application Status Breakdown</h4>
              <div className="status-bars">
                {statusChartData.map((item, index) => (
                  <div key={index} className="status-bar">
                    <span className="status-label">{item.name}</span>
                    <div className="bar-track">
                      <div
                        className={`bar-fill status-${item.name.toLowerCase().replace(" ", "_")}`}
                        style={{
                          width: `${Math.max((item.value / (statusChartData.reduce((sum, d) => sum + d.value, 0) || 1)) * 100, 5)}%`,
                        }}
                      />
                    </div>
                    <span className="bar-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card glass">
              <span className="metric-icon">✅</span>
              <div>
                <span className="metric-value">
                  {statistics?.approved || 0}
                </span>
                <span className="metric-label">Approved</span>
              </div>
            </div>
            <div className="metric-card glass">
              <span className="metric-icon">⏳</span>
              <div>
                <span className="metric-value">{statistics?.pending || 0}</span>
                <span className="metric-label">Pending</span>
              </div>
            </div>
            <div className="metric-card glass">
              <span className="metric-icon">❌</span>
              <div>
                <span className="metric-value">{statistics?.denied || 0}</span>
                <span className="metric-label">Denied</span>
              </div>
            </div>
            <div className="metric-card glass">
              <span className="metric-icon">📋</span>
              <div>
                <span className="metric-value">
                  {statistics?.pendingReview || 0}
                </span>
                <span className="metric-label">Review</span>
              </div>
            </div>
          </div>

          {/* Live Report */}
          <div className="live-report-container glass">
            <div className="live-report-header">
              <h4>
                📊{" "}
                {isLive ? "Live Power BI Report" : "Power BI Report (Preview)"}
              </h4>
              <span className={`live-status ${isLive ? "live" : "preview"}`}>
                {isLive ? "🟢 Live" : "🔵 Preview"}
              </span>
            </div>
            {isLive ? (
              <div className="live-report-embed">
                <p>✅ Power BI report is live!</p>
                <p>Report ID: {embedConfig?.reportId}</p>
                <p>Workspace: {embedConfig?.workspaceId}</p>
                <div className="embed-placeholder">
                  <span className="placeholder-icon">📊</span>
                  <p>Power BI report embedded here</p>
                  <small>(Full embed requires iframe support)</small>
                </div>
              </div>
            ) : (
              <div className="config-placeholder">
                <p>Add Azure credentials to enable live Power BI:</p>
                <div className="config-code">
                  <code>azure.client.id=YOUR_CLIENT_ID</code>
                  <code>azure.client.secret=YOUR_CLIENT_SECRET</code>
                  <code>azure.tenant.id=YOUR_TENANT_ID</code>
                  <code>powerbi.workspace.id=YOUR_WORKSPACE_ID</code>
                  <code>powerbi.report.id=YOUR_REPORT_ID</code>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Data Table */}
      {activeTab === "data" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="powerbi-data-container glass"
        >
          <div className="data-toolbar">
            <h3>📋 Application Data</h3>
            <span className="data-count">{reportData.length} records</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Property Price</th>
                  <th>Down Payment</th>
                  <th>Rate</th>
                  <th>Term</th>
                  <th>Monthly Payment</th>
                  <th>Credit Score</th>
                  <th>DTI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((app, index) => (
                    <tr key={index}>
                      <td>{app.applicantName || "N/A"}</td>
                      <td>{formatCurrency(app.propertyPrice)}</td>
                      <td>{formatCurrency(app.downPayment)}</td>
                      <td>{app.interestRate || 0}%</td>
                      <td>{app.loanTermYears || 0}y</td>
                      <td>{formatCurrency(app.monthlyPayment)}</td>
                      <td>{app.creditScore || "N/A"}</td>
                      <td>
                        {((app.debtToIncomeRatio || 0) * 100).toFixed(1)}%
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${app.applicationStatus?.toLowerCase() || "pending"}`}
                        >
                          {app.applicationStatus || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Status Footer */}
      <div className="powerbi-status glass">
        <span className={`status-dot ${isLive ? "green" : "yellow"}`}></span>
        <span>Microsoft Graph: {isLive ? "✅ Connected" : "🔵 Preview"}</span>
        <span className="status-separator">|</span>
        <span>Power BI: {isLive ? "✅ Live" : "🔵 Preview"}</span>
        <span className="status-separator">|</span>
        <span>Data: {statistics?.hasData ? "📊 Real" : "📋 Sample"}</span>
        <span className="status-separator">|</span>
        <span>Updated: {new Date().toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PowerBIReport;
