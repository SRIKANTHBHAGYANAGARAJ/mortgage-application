import React, { useState, useEffect } from "react";
import axios from "axios";

const PowerBIReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [embedConfig, setEmbedConfig] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchPowerBIData();
  }, []);

  const fetchPowerBIData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };

      // Fetch embed config
      const embedRes = await axios.get(
        "http://localhost:8081/api/powerbi/embed-config",
        config,
      );
      setEmbedConfig(embedRes.data);

      // Fetch statistics
      const statsRes = await axios.get(
        "http://localhost:8081/api/powerbi/statistics",
        config,
      );
      setStatistics(statsRes.data);

      // Fetch report data
      const dataRes = await axios.get(
        "http://localhost:8081/api/powerbi/report-data",
        config,
      );
      setReportData(dataRes.data);
    } catch (err) {
      setError("Failed to load Power BI data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <h2>Loading Power BI Dashboard...</h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Fetching your mortgage analytics
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
        <h2 style={{ color: "#ff6b6b" }}>{error}</h2>
        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
          style={{ marginTop: "20px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const isLive = embedConfig?.mode === "live" && embedConfig?.isConfigured;

  return (
    <div
      style={{
        padding: "100px 24px 60px",
        maxWidth: "1400px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff" }}>
            📊 Power BI Dashboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "16px",
              marginTop: "4px",
            }}
          >
            Real-time mortgage analytics powered by Microsoft Graph
          </p>
        </div>
        <div>
          <span
            style={{
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: 600,
              background: isLive
                ? "rgba(255,59,48,0.15)"
                : "rgba(0,212,255,0.15)",
              color: isLive ? "#ff3b30" : "#00d4ff",
              border: `1px solid ${isLive ? "rgba(255,59,48,0.3)" : "rgba(0,212,255,0.3)"}`,
            }}
          >
            {isLive ? "🔴 LIVE" : "🔵 Preview"}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "32px" }}>📋</span>
          <div>
            <div
              style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}
            >
              {statistics?.totalApplications || 0}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Total Applications
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "32px" }}>🏠</span>
          <div>
            <div
              style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}
            >
              {formatCurrency(statistics?.averagePropertyPrice)}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Avg Property Price
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "32px" }}>💰</span>
          <div>
            <div
              style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}
            >
              {formatCurrency(statistics?.averageMonthlyPayment)}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Avg Monthly Payment
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "20px 24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "32px" }}>📈</span>
          <div>
            <div
              style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}
            >
              {Math.round(statistics?.averageCreditScore || 0)}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              Avg Credit Score
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: "24px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ color: "#ffffff", fontSize: "18px" }}>
            📊 {isLive ? "Live Power BI Report" : "Power BI Report (Preview)"}
          </h3>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 600,
              background: isLive
                ? "rgba(0,230,118,0.15)"
                : "rgba(0,212,255,0.15)",
              color: isLive ? "#00e676" : "#00d4ff",
            }}
          >
            {isLive ? "🟢 Live" : "🔵 Preview"}
          </span>
        </div>

        {isLive ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "12px",
              border: "2px dashed rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
            <p style={{ color: "#ffffff", fontSize: "18px" }}>
              ✅ Power BI report is live!
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Report ID: {embedConfig?.reportId}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>
              Workspace: {embedConfig?.workspaceId}
            </p>
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.7)" }}>
                📊 Power BI report embedded here
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                (Full embed requires iframe support)
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
              Add Azure credentials to enable live Power BI:
            </p>
            <div
              style={{
                background: "rgba(0,0,0,0.3)",
                borderRadius: "10px",
                padding: "16px 20px",
                maxWidth: "500px",
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              <code
                style={{
                  display: "block",
                  color: "#00d4ff",
                  fontSize: "12px",
                  padding: "2px 0",
                  fontFamily: "monospace",
                }}
              >
                azure.client.id=YOUR_CLIENT_ID
              </code>
              <code
                style={{
                  display: "block",
                  color: "#00d4ff",
                  fontSize: "12px",
                  padding: "2px 0",
                  fontFamily: "monospace",
                }}
              >
                azure.client.secret=YOUR_CLIENT_SECRET
              </code>
              <code
                style={{
                  display: "block",
                  color: "#00d4ff",
                  fontSize: "12px",
                  padding: "2px 0",
                  fontFamily: "monospace",
                }}
              >
                azure.tenant.id=YOUR_TENANT_ID
              </code>
              <code
                style={{
                  display: "block",
                  color: "#00d4ff",
                  fontSize: "12px",
                  padding: "2px 0",
                  fontFamily: "monospace",
                }}
              >
                powerbi.workspace.id=YOUR_WORKSPACE_ID
              </code>
              <code
                style={{
                  display: "block",
                  color: "#00d4ff",
                  fontSize: "12px",
                  padding: "2px 0",
                  fontFamily: "monospace",
                }}
              >
                powerbi.report.id=YOUR_REPORT_ID
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 20px",
          marginTop: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.4)",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            display: "inline-block",
            background: isLive ? "#00e676" : "#ffd93d",
            animation: "pulse 2s infinite",
          }}
        ></span>
        <span>Microsoft Graph: {isLive ? "✅ Connected" : "🔵 Preview"}</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
        <span>Power BI: {isLive ? "✅ Live" : "🔵 Preview"}</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
        <span>Data: {statistics?.hasData ? "📊 Real" : "📋 Sample"}</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
        <span>Updated: {new Date().toLocaleString()}</span>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
};

export default PowerBIReport;
