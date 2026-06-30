import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./MortgageApplication.css";

const MortgageApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phoneNumber: "",
    propertyPrice: "",
    downPayment: "",
    interestRate: "",
    loanTermYears: "",
    annualIncome: "",
    monthlyDebt: "",
    employmentStatus: "FULL_TIME",
    creditScore: "",
    propertyType: "SINGLE_FAMILY",
    propertyAddress: "",
  });

  const employmentOptions = [
    "FULL_TIME",
    "PART_TIME",
    "SELF_EMPLOYED",
    "RETIRED",
    "UNEMPLOYED",
  ];
  const propertyTypes = [
    "SINGLE_FAMILY",
    "CONDO",
    "TOWNHOUSE",
    "MULTI_FAMILY",
    "APARTMENT",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };

      const response = await axios.post(
        "http://localhost:8081/api/mortgage/apply",
        {
          ...formData,
          propertyPrice: parseFloat(formData.propertyPrice),
          downPayment: parseFloat(formData.downPayment),
          interestRate: parseFloat(formData.interestRate),
          loanTermYears: parseInt(formData.loanTermYears),
          annualIncome: parseFloat(formData.annualIncome),
          monthlyDebt: parseFloat(formData.monthlyDebt),
          creditScore: parseInt(formData.creditScore),
        },
        config,
      );

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/application/${response.data.id}`);
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Application submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      <div className="application-container">
        <div className="application-header">
          <h1 className="application-title">📋 Submit Application</h1>
          <p className="application-subtitle">
            Fill in your details to get started with your mortgage application
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="application-card glass"
        >
          {success ? (
            <div className="success-state">
              <span className="success-icon">✅</span>
              <h3 className="success-title">Application Submitted!</h3>
              <p className="success-text">
                Your application is being processed. You will be redirected
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="application-form">
              {error && (
                <div className="form-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-section">
                <h4 className="section-title">Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+1 555 123 4567"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Employment Status</label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      {employmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">Property Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Price ($)</label>
                    <input
                      type="number"
                      name="propertyPrice"
                      value={formData.propertyPrice}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="500000"
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Down Payment ($)</label>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="100000"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Interest Rate (%)</label>
                    <input
                      type="number"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="6.5"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Loan Term (Years)</label>
                    <input
                      type="number"
                      name="loanTermYears"
                      value={formData.loanTermYears}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="30"
                      required
                      min="1"
                      max="40"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Address</label>
                    <input
                      type="text"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="123 Main St, City, State"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">Financial Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Annual Income ($)</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="120000"
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Debt ($)</label>
                    <input
                      type="number"
                      name="monthlyDebt"
                      value={formData.monthlyDebt}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="2000"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Credit Score</label>
                    <input
                      type="number"
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="720"
                      required
                      min="300"
                      max="850"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageApplication;
