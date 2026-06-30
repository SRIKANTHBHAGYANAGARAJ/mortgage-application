package hobbiebackend.service.ml;

import hobbiebackend.model.entities.MortgageApplication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MortgagePredictionService {

    public Map<String, Object> predictApproval(MortgageApplication application) {
        Map<String, Object> prediction = new HashMap<>();

        double score = calculateRiskScore(application);
        double approvalProbability = calculateApprovalProbability(score, application);

        prediction.put("approvalProbability", Math.round(approvalProbability * 100));
        prediction.put("riskScore", Math.round(score));
        prediction.put("recommendation", getRecommendation(approvalProbability));
        prediction.put("factors", getRiskFactors(application));
        prediction.put("timestamp", LocalDateTime.now());

        return prediction;
    }

    private double calculateRiskScore(MortgageApplication application) {
        double score = 0;

        // Credit Score (max 30 points)
        if (application.getCreditScore() >= 750) score += 30;
        else if (application.getCreditScore() >= 700) score += 25;
        else if (application.getCreditScore() >= 650) score += 18;
        else if (application.getCreditScore() >= 600) score += 10;
        else score += 5;

        // DTI Ratio (max 25 points)
        if (application.getDebtToIncomeRatio() <= 0.28) score += 25;
        else if (application.getDebtToIncomeRatio() <= 0.36) score += 18;
        else if (application.getDebtToIncomeRatio() <= 0.43) score += 10;
        else score += 5;

        // Employment Status (max 15 points)
        String emp = application.getEmploymentStatus();
        if ("FULL_TIME".equalsIgnoreCase(emp)) score += 15;
        else if ("SELF_EMPLOYED".equalsIgnoreCase(emp)) score += 12;
        else if ("PART_TIME".equalsIgnoreCase(emp)) score += 10;
        else if ("RETIRED".equalsIgnoreCase(emp)) score += 8;
        else score += 5;

        // Down Payment (max 15 points)
        double downPaymentPercent = application.getDownPayment().doubleValue() /
                application.getPropertyPrice().doubleValue() * 100;
        if (downPaymentPercent >= 20) score += 15;
        else if (downPaymentPercent >= 10) score += 10;
        else score += 5;

        // Loan Term (max 10 points)
        if (application.getLoanTermYears() <= 15) score += 10;
        else if (application.getLoanTermYears() <= 20) score += 8;
        else if (application.getLoanTermYears() <= 25) score += 5;
        else score += 3;

        // Income Stability (max 5 points)
        if (application.getAnnualIncome().doubleValue() > 100000) score += 5;
        else if (application.getAnnualIncome().doubleValue() > 75000) score += 3;
        else score += 1;

        return Math.min(score, 100);
    }

    private double calculateApprovalProbability(double riskScore, MortgageApplication application) {
        double probability = riskScore / 100.0;

        // Adjust based on property type
        if ("SINGLE_FAMILY".equals(application.getPropertyType())) probability += 0.05;
        else if ("CONDO".equals(application.getPropertyType())) probability -= 0.02;

        return Math.min(Math.max(probability, 0.1), 0.99);
    }

    private String getRecommendation(double probability) {
        if (probability >= 0.75) return "✅ Highly likely to be approved. Great financial profile!";
        else if (probability >= 0.60) return "📈 Good chance of approval. Consider improving credit score.";
        else if (probability >= 0.45) return "📊 Moderate chance. Try increasing down payment.";
        else return "⚠️ Low chance. Consider improving financial profile or consulting an advisor.";
    }

    private List<Map<String, Object>> getRiskFactors(MortgageApplication application) {
        List<Map<String, Object>> factors = new ArrayList<>();

        Map<String, Object> creditFactor = new HashMap<>();
        creditFactor.put("name", "Credit Score");
        creditFactor.put("value", application.getCreditScore());
        creditFactor.put("impact", application.getCreditScore() >= 700 ? "low" : "medium");
        creditFactor.put("recommendation", application.getCreditScore() < 700 ?
                "Consider improving credit score by paying down debt" : "Good credit score maintained");
        factors.add(creditFactor);

        Map<String, Object> dtiFactor = new HashMap<>();
        dtiFactor.put("name", "Debt-to-Income Ratio");
        dtiFactor.put("value", String.format("%.1f%%", application.getDebtToIncomeRatio() * 100));
        dtiFactor.put("impact", application.getDebtToIncomeRatio() <= 0.36 ? "low" : "high");
        dtiFactor.put("recommendation", application.getDebtToIncomeRatio() > 0.36 ?
                "Reduce monthly debt obligations" : "Healthy debt-to-income ratio");
        factors.add(dtiFactor);

        double downPaymentPercent = application.getDownPayment().doubleValue() /
                application.getPropertyPrice().doubleValue() * 100;
        Map<String, Object> downFactor = new HashMap<>();
        downFactor.put("name", "Down Payment");
        downFactor.put("value", String.format("%.1f%%", downPaymentPercent));
        downFactor.put("impact", downPaymentPercent >= 20 ? "low" : "medium");
        downFactor.put("recommendation", downPaymentPercent < 20 ?
                "Consider increasing down payment to avoid PMI" : "Excellent down payment");
        factors.add(downFactor);

        return factors;
    }

    public Map<String, Object> getGlobalTrends() {
        Map<String, Object> trends = new HashMap<>();
        trends.put("averageRate", 6.75);
        trends.put("trend", "slightly decreasing");
        trends.put("yearOverYear", -0.25);
        trends.put("lastUpdated", LocalDateTime.now());
        trends.put("forecast", Arrays.asList(
                Map.of("month", "Jan", "rate", 6.8),
                Map.of("month", "Feb", "rate", 6.75),
                Map.of("month", "Mar", "rate", 6.7),
                Map.of("month", "Apr", "rate", 6.65),
                Map.of("month", "May", "rate", 6.6)
        ));
        return trends;
    }

    public List<Map<String, Object>> getCompetitorAnalysis() {
        List<Map<String, Object>> competitors = new ArrayList<>();

        String[] names = {"Wells Fargo", "JPMorgan Chase", "Bank of America", "Citibank", "US Bank", "Ally Bank", "Better Mortgage"};
        double[] rates = {6.85, 6.75, 6.90, 6.80, 6.95, 6.60, 6.55};
        double[] fees = {1.2, 1.0, 1.3, 1.1, 1.4, 0.8, 0.9};
        int[] satisfaction = {85, 88, 82, 86, 80, 92, 90};
        double[] marketShare = {12.5, 10.8, 8.5, 6.2, 5.5, 4.2, 3.8};

        for (int i = 0; i < names.length; i++) {
            Map<String, Object> competitor = new HashMap<>();
            competitor.put("name", names[i]);
            competitor.put("rate", rates[i]);
            competitor.put("fee", fees[i]);
            competitor.put("customerSatisfaction", satisfaction[i]);
            competitor.put("marketShare", marketShare[i]);
            competitors.add(competitor);
        }

        return competitors;
    }
}