package hobbiebackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MicrosoftGraphConfig {

    @Value("${azure.client.id:}")
    private String clientId;

    @Value("${azure.client.secret:}")
    private String clientSecret;

    @Value("${azure.tenant.id:}")
    private String tenantId;

    @Value("${azure.redirect.uri:http://localhost:3001}")
    private String redirectUri;

    @Value("${powerbi.workspace.id:}")
    private String workspaceId;

    @Value("${powerbi.report.id:}")
    private String reportId;

    @Value("${powerbi.embed.url:https://app.powerbi.com/reportEmbed}")
    private String embedUrl;

    // Getters
    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getTenantId() { return tenantId; }
    public String getRedirectUri() { return redirectUri; }
    public String getWorkspaceId() { return workspaceId; }
    public String getReportId() { return reportId; }
    public String getEmbedUrl() { return embedUrl; }

    // Check if configured
    public boolean isConfigured() {
        return clientId != null && !clientId.isEmpty() &&
                !clientId.equals("YOUR_CLIENT_ID_FROM_AZURE");
    }
}