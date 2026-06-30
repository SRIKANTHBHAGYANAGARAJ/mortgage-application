package hobbiebackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PowerBIConfig {

    @Value("${powerbi.workspace.id:preview}")
    private String workspaceId;

    @Value("${powerbi.report.id:preview}")
    private String reportId;

    @Value("${powerbi.client.id:preview}")
    private String clientId;

    @Value("${powerbi.client.secret:preview}")
    private String clientSecret;

    @Value("${powerbi.tenant.id:preview}")
    private String tenantId;

    @Value("${powerbi.embed.url:https://app.powerbi.com/}")
    private String embedUrl;

    // Getters
    public String getWorkspaceId() { return workspaceId; }
    public String getReportId() { return reportId; }
    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getTenantId() { return tenantId; }
    public String getEmbedUrl() { return embedUrl; }

    // Check if in preview mode
    public boolean isPreviewMode() {
        return "preview".equals(workspaceId) || workspaceId == null || workspaceId.isEmpty();
    }
}