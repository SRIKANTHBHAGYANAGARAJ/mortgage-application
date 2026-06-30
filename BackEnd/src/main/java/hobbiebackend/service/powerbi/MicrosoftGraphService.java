package hobbiebackend.service.powerbi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hobbiebackend.config.MicrosoftGraphConfig;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.enums.MortgageStatusEnum;
import hobbiebackend.model.repository.MortgageApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
public class MicrosoftGraphService {

    @Autowired
    private MicrosoftGraphConfig config;

    @Autowired
    private MortgageApplicationRepository mortgageApplicationRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ============ MICROSOFT GRAPH AUTH ============

    // Get Microsoft Graph Access Token
    public String getAccessToken() throws Exception {
        if (!config.isConfigured()) {
            return "preview_token";
        }

        String url = "https://login.microsoftonline.com/" + config.getTenantId() + "/oauth2/v2.0/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "client_id=" + config.getClientId() +
                "&client_secret=" + config.getClientSecret() +
                "&scope=https://graph.microsoft.com/.default" +
                "&grant_type=client_credentials";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    // Get User Info from Microsoft Graph
    public Map<String, Object> getUserInfo(String accessToken) throws Exception {
        if ("preview_token".equals(accessToken)) {
            return getPreviewUserInfo();
        }

        String url = "https://graph.microsoft.com/v1.0/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", jsonNode.has("id") ? jsonNode.get("id").asText() : "unknown");
        userInfo.put("displayName", jsonNode.has("displayName") ? jsonNode.get("displayName").asText() : "User");
        userInfo.put("email", jsonNode.has("mail") ? jsonNode.get("mail").asText() :
                jsonNode.has("userPrincipalName") ? jsonNode.get("userPrincipalName").asText() : "user@example.com");
        userInfo.put("userPrincipalName", jsonNode.has("userPrincipalName") ? jsonNode.get("userPrincipalName").asText() : "user@example.com");

        return userInfo;
    }

    // ============ POWER BI ============

    // Get Power BI Embed Token
    public String getPowerBIEmbedToken(String accessToken) throws Exception {
        if ("preview_token".equals(accessToken) || !config.isConfigured()) {
            return "preview_embed_token";
        }

        String url = "https://api.powerbi.com/v1.0/myorg/groups/" +
                config.getWorkspaceId() +
                "/reports/" +
                config.getReportId() +
                "/GenerateToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("accessLevel", "view");
        requestBody.put("allowSaveAs", false);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("token").asText();
    }

    // Get Power BI Reports
    public List<Map<String, Object>> getPowerBIReports(String accessToken) throws Exception {
        if ("preview_token".equals(accessToken) || !config.isConfigured()) {
            return getPreviewReports();
        }

        String url = "https://api.powerbi.com/v1.0/myorg/groups/" + config.getWorkspaceId() + "/reports";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        List<Map<String, Object>> reports = new ArrayList<>();

        for (JsonNode report : jsonNode.get("value")) {
            Map<String, Object> reportInfo = new HashMap<>();
            reportInfo.put("id", report.get("id").asText());
            reportInfo.put("name", report.get("name").asText());
            reportInfo.put("webUrl", report.get("webUrl").asText());
            reportInfo.put("embedUrl", report.get("embedUrl").asText());
            reports.add(reportInfo);
        }

        return reports;
    }

    // Get Complete Embed Config
    public Map<String, Object> getEmbedConfig() throws Exception {
        Map<String, Object> configMap = new HashMap<>();
        boolean isConfigured = config.isConfigured();

        configMap.put("isConfigured", isConfigured);
        configMap.put("workspaceId", config.getWorkspaceId());
        configMap.put("reportId", config.getReportId());
        configMap.put("embedUrl", config.getEmbedUrl());

        try {
            if (isConfigured) {
                String accessToken = getAccessToken();
                String embedToken = getPowerBIEmbedToken(accessToken);
                configMap.put("token", embedToken);
                configMap.put("accessToken", accessToken);
                configMap.put("mode", "live");
                configMap.put("message", "✅ Connected to Microsoft Graph + Power BI");
            } else {
                configMap.put("token", "preview_token");
                configMap.put("mode", "preview");
                configMap.put("message", "🔵 Preview Mode - Add Azure credentials for live Power BI");
            }
            configMap.put("success", true);
        } catch (Exception e) {
            configMap.put("success", false);
            configMap.put("error", e.getMessage());
            configMap.put("token", "preview_token");
            configMap.put("mode", "preview");
            configMap.put("message", "⚠️ Error connecting - Using preview mode");
        }

        return configMap;
    }

    // ============ STATISTICS ============

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        List<MortgageApplication> apps = mortgageApplicationRepository.findAll();

        if (apps.isEmpty()) {
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

        stats.put("totalApplications", (long) apps.size());
        stats.put("averagePropertyPrice", Math.round(apps.stream()
                .mapToDouble(a -> a.getPropertyPrice().doubleValue())
                .average().orElse(0)));
        stats.put("averageMonthlyPayment", Math.round(apps.stream()
                .mapToDouble(a -> a.getMonthlyPayment().doubleValue())
                .average().orElse(0)));
        stats.put("averageCreditScore", Math.round(apps.stream()
                .mapToDouble(MortgageApplication::getCreditScore)
                .average().orElse(0)));
        stats.put("approved", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.APPROVED).count());
        stats.put("pending", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING).count());
        stats.put("denied", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.DENIED).count());
        stats.put("pendingReview", apps.stream()
                .filter(a -> a.getApplicationStatus() == MortgageStatusEnum.PENDING_REVIEW).count());
        stats.put("hasData", true);

        return stats;
    }

    public List<Map<String, Object>> getReportData() {
        List<Map<String, Object>> reportData = new ArrayList<>();
        List<MortgageApplication> applications = mortgageApplicationRepository.findAll();

        if (applications.isEmpty()) {
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

    // ============ PREVIEW DATA ============

    private Map<String, Object> getPreviewUserInfo() {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", "preview_user");
        userInfo.put("displayName", "Preview User");
        userInfo.put("email", "preview@mortgage.io");
        userInfo.put("userPrincipalName", "preview@mortgage.io");
        return userInfo;
    }

    private List<Map<String, Object>> getPreviewReports() {
        List<Map<String, Object>> reports = new ArrayList<>();
        Map<String, Object> report = new HashMap<>();
        report.put("id", "preview_report");
        report.put("name", "Mortgage Analytics (Preview)");
        report.put("webUrl", "https://app.powerbi.com/");
        report.put("embedUrl", "https://app.powerbi.com/reportEmbed");
        reports.add(report);
        return reports;
    }

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
}