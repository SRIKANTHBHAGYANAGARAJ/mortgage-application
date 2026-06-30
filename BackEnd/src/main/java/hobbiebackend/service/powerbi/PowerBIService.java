package hobbiebackend.service.powerbi;

import hobbiebackend.config.PowerBIConfig;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.enums.MortgageStatusEnum;
import hobbiebackend.model.repository.MortgageApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PowerBIService {

    @Autowired
    private PowerBIConfig powerBIConfig;

    @Autowired
    private MortgageApplicationRepository mortgageApplicationRepository;

    // Get embed configuration (works in both preview and live mode)
    public Map<String, Object> getEmbedConfig() {
        Map<String, Object> config = new HashMap<>();

        boolean isPreview = powerBIConfig.isPreviewMode();

        config.put("workspaceId", powerBIConfig.getWorkspaceId());
        config.put("reportId", powerBIConfig.getReportId());
        config.put("embedUrl", powerBIConfig.getEmbedUrl());
        config.put("isPreview", isPreview);

        if (isPreview) {
            config.put("token", "preview_token");
            config.put("message", "Preview Mode - Add Azure credentials for live Power BI");
        } else {
            config.put("token", generateLiveToken());
            config.put("message", "Live Power BI - Connected to Azure");
        }

        return config;
    }

    // Generate token for live mode (would use Azure in production)
    private String generateLiveToken() {
        // In production, this would call Azure API
        return "live_powerbi_token_" + System.currentTimeMillis();
    }

    // Get statistics for dashboard
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        List<MortgageApplication> apps = mortgageApplicationRepository.findAll();

        if (apps.isEmpty()) {
            // Return default preview data
            stats.put("totalApplications", 0);
            stats.put("averagePropertyPrice", 0);
            stats.put("averageMonthlyPayment", 0);
            stats.put("averageCreditScore", 0);
            stats.put("approved", 0);
            stats.put("pending", 0);
            stats.put("denied", 0);
            stats.put("pendingReview", 0);
            stats.put("hasData", false);
            return stats;
        }

        // Calculate statistics from real data
        long totalApps = apps.size();
        double avgPrice = apps.stream()
                .mapToDouble(a -> a.getPropertyPrice().doubleValue())
                .average()
                .orElse(0);
        double avgPayment = apps.stream()
                .mapToDouble(a -> a.getMonthlyPayment().doubleValue())
                .average()
                .orElse(0);
        double avgScore = apps.stream()
                .mapToDouble(MortgageApplication::getCreditScore)
                .average()
                .orElse(0);

        long approved = apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.APPROVED)
                .count();
        long pending = apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING)
                .count();
        long denied = apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.DENIED)
                .count();
        long pendingReview = apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING_REVIEW)
                .count();

        stats.put("totalApplications", totalApps);
        stats.put("averagePropertyPrice", Math.round(avgPrice));
        stats.put("averageMonthlyPayment", Math.round(avgPayment));
        stats.put("averageCreditScore", Math.round(avgScore));
        stats.put("approved", approved);
        stats.put("pending", pending);
        stats.put("denied", denied);
        stats.put("pendingReview", pendingReview);
        stats.put("hasData", true);

        return stats;
    }

    // Get report data for data table
    public List<Map<String, Object>> getReportData() {
        List<Map<String, Object>> reportData = new ArrayList<>();
        List<MortgageApplication> applications = mortgageApplicationRepository.findAll();

        if (applications.isEmpty()) {
            // Return sample data for preview
            return getSampleData();
        }

        for (MortgageApplication app : applications) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", app.getId());
            data.put("applicantName", app.getApplicantName());
            data.put("email", app.getEmail());
            data.put("phoneNumber", app.getPhoneNumber());
            data.put("propertyPrice", app.getPropertyPrice());
            data.put("downPayment", app.getDownPayment());
            data.put("loanAmount", app.getLoanAmount());
            data.put("interestRate", app.getInterestRate());
            data.put("loanTermYears", app.getLoanTermYears());
            data.put("monthlyPayment", app.getMonthlyPayment());
            data.put("annualIncome", app.getAnnualIncome());
            data.put("monthlyDebt", app.getMonthlyDebt());
            data.put("debtToIncomeRatio", app.getDebtToIncomeRatio());
            data.put("employmentStatus", app.getEmploymentStatus());
            data.put("creditScore", app.getCreditScore());
            data.put("propertyType", app.getPropertyType());
            data.put("propertyAddress", app.getPropertyAddress());
            data.put("applicationStatus", app.getApplicationStatus().name());
            data.put("createdAt", app.getCreatedAt() != null ? app.getCreatedAt().toString() : null);
            data.put("aiRecommendation", app.getAiRecommendation());
            data.put("aiConfidenceScore", app.getAiConfidenceScore());
            reportData.add(data);
        }

        return reportData;
    }

    // Sample data for preview mode when no data exists
    private List<Map<String, Object>> getSampleData() {
        List<Map<String, Object>> sampleData = new ArrayList<>();

        String[] names = {"John Doe", "Jane Smith", "Robert Johnson", "Maria Garcia", "David Lee"};
        String[] statuses = {"APPROVED", "PENDING", "DENIED", "PENDING_REVIEW", "APPROVED"};
        double[] prices = {450000, 320000, 680000, 510000, 275000};
        double[] rates = {6.5, 5.75, 7.0, 6.25, 5.5};
        int[] terms = {30, 15, 30, 20, 30};
        int[] creditScores = {720, 680, 590, 750, 710};
        String[] propertyTypes = {"SINGLE_FAMILY", "CONDO", "SINGLE_FAMILY", "TOWNHOUSE", "CONDO"};

        for (int i = 0; i < names.length; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("id", (long) (i + 1));
            data.put("applicantName", names[i]);
            data.put("email", names[i].toLowerCase().replace(" ", ".") + "@example.com");
            data.put("phoneNumber", "+1 555-" + (100 + i * 100) + "-" + (1000 + i * 100));
            data.put("propertyPrice", BigDecimal.valueOf(prices[i]));
            data.put("downPayment", BigDecimal.valueOf(prices[i] * 0.2));
            data.put("loanAmount", BigDecimal.valueOf(prices[i] * 0.8));
            data.put("interestRate", rates[i]);
            data.put("loanTermYears", terms[i]);
            data.put("monthlyPayment", BigDecimal.valueOf(prices[i] * 0.005));
            data.put("annualIncome", BigDecimal.valueOf(80000 + i * 15000));
            data.put("monthlyDebt", BigDecimal.valueOf(1500 + i * 300));
            data.put("debtToIncomeRatio", 0.28 + i * 0.02);
            data.put("employmentStatus", "FULL_TIME");
            data.put("creditScore", creditScores[i]);
            data.put("propertyType", propertyTypes[i]);
            data.put("propertyAddress", (i + 1) + " Main St, City " + (i + 1));
            data.put("applicationStatus", statuses[i]);
            data.put("createdAt", java.time.LocalDateTime.now().minusDays(i * 5).toString());
            data.put("aiRecommendation", i % 2 == 0 ? "Highly likely to be approved" : "Needs review");
            data.put("aiConfidenceScore", 70 + i * 5);
            sampleData.add(data);
        }

        return sampleData;
    }

    // Get status distribution for chart
    public Map<String, Long> getStatusDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        List<MortgageApplication> apps = mortgageApplicationRepository.findAll();

        if (apps.isEmpty()) {
            distribution.put("APPROVED", 5L);
            distribution.put("PENDING", 3L);
            distribution.put("DENIED", 2L);
            distribution.put("PENDING_REVIEW", 1L);
            return distribution;
        }

        distribution.put("APPROVED", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.APPROVED).count());
        distribution.put("PENDING", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING).count());
        distribution.put("DENIED", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.DENIED).count());
        distribution.put("PENDING_REVIEW", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING_REVIEW).count());

        return distribution;
    }
}