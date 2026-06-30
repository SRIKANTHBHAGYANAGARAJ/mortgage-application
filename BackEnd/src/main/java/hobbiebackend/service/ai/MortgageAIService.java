package hobbiebackend.service.ai;

import hobbiebackend.model.entities.MortgageApplication;
import org.springframework.stereotype.Service;

@Service
public class MortgageAIService {

    public String getAIMortgageRecommendation(MortgageApplication application) {
        return "AI recommendation: Application looks good based on initial review.";
    }

    public Double calculateRiskScore(MortgageApplication application) {
        double score = 0;

        // Credit Score
        if (application.getCreditScore() >= 750) score += 30;
        else if (application.getCreditScore() >= 700) score += 25;
        else if (application.getCreditScore() >= 650) score += 18;
        else if (application.getCreditScore() >= 600) score += 10;
        else score += 5;

        // DTI Ratio
        if (application.getDebtToIncomeRatio() <= 0.28) score += 25;
        else if (application.getDebtToIncomeRatio() <= 0.36) score += 18;
        else if (application.getDebtToIncomeRatio() <= 0.43) score += 10;
        else score += 5;

        // Employment Status
        if ("FULL_TIME".equalsIgnoreCase(application.getEmploymentStatus())) score += 15;
        else if ("PART_TIME".equalsIgnoreCase(application.getEmploymentStatus())) score += 10;
        else if ("SELF_EMPLOYED".equalsIgnoreCase(application.getEmploymentStatus())) score += 8;
        else if ("RETIRED".equalsIgnoreCase(application.getEmploymentStatus())) score += 12;
        else score += 5;

        // Down Payment
        double downPaymentPercent = application.getDownPayment().doubleValue() /
                application.getPropertyPrice().doubleValue() * 100;
        if (downPaymentPercent >= 20) score += 15;
        else if (downPaymentPercent >= 10) score += 10;
        else score += 5;

        // Loan Term
        if (application.getLoanTermYears() <= 15) score += 10;
        else if (application.getLoanTermYears() <= 20) score += 8;
        else if (application.getLoanTermYears() <= 25) score += 5;
        else score += 3;

        // Interest Rate
        if (application.getInterestRate() <= 4.0) score += 5;
        else if (application.getInterestRate() <= 6.0) score += 3;
        else score += 1;

        return Math.min(score, 100);
    }
}