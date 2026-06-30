import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./MortgageCalculator.css";

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    propertyPrice: "",
    downPayment: "",
    interestRate: "",
    loanTermYears: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setResult(null);
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/mortgage/calculate",
        {
          propertyPrice: parseFloat(formData.propertyPrice),
          downPayment: parseFloat(formData.downPayment),
          interestRate: parseFloat(formData.interestRate),
          loanTermYears: parseInt(formData.loanTermYears),
        },
      );
      setResult(response.data);
    } catch (err) {
      setError("Calculation failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="calculator-page">
      <div className="calculator-background">
        <div className="gradient-sphere calc-sphere-1"></div>
        <div className="gradient-sphere calc-sphere-2"></div>
      </div>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1 className="calculator-title">🏠 Mortgage Calculator</h1>
          <p className="calculator-subtitle">
            Estimate your monthly mortgage payments with our AI-powered
            calculator
          </p>
        </div>

        <div className="calculator-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="calculator-form glass"
          >
            <form onSubmit={handleCalculate}>
              <div className="form-group">
                <label className="form-label">Property Price</label>
                <div className="input-with-icon">
                  <span className="input-icon">$</span>
                  <input
                    type="number"
                    name="propertyPrice"
                    value={formData.propertyPrice}
                    onChange={handleChange}
                    className="form-input with-icon"
                    placeholder="500,000"
                    required
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Down Payment</label>
                <div className="input-with-icon">
                  <span className="input-icon">$</span>
                  <input
                    type="number"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleChange}
                    className="form-input with-icon"
                    placeholder="100,000"
                    required
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

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
                  step="1"
                />
              </div>

              {error && (
                <div className="calc-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate Payment"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="calculator-results glass"
          >
            <h3 className="results-title">Payment Breakdown</h3>

            {result ? (
              <div className="results-content">
                <div className="result-card">
                  <span className="result-label">Monthly Payment</span>
                  <span className="result-value primary">
                    {formatCurrency(result.monthlyPayment)}
                  </span>
                </div>

                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">Total Payment</span>
                    <span className="result-value">
                      {formatCurrency(result.totalPayment)}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Interest</span>
                    <span className="result-value">
                      {formatCurrency(result.totalInterest)}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Loan Amount</span>
                    <span className="result-value">
                      {formatCurrency(result.loanAmount)}
                    </span>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn-secondary btn-sm">
                    Save Calculation
                  </button>
                  <button className="btn-primary btn-sm">Apply Now</button>
                </div>
              </div>
            ) : (
              <div className="results-placeholder">
                <span className="placeholder-icon">🏠</span>
                <p className="placeholder-text">
                  Enter your loan details to see your monthly payment estimate
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
