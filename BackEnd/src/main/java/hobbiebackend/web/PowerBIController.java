package hobbiebackend.web;

import hobbiebackend.service.powerbi.MicrosoftGraphService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/powerbi")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://localhost:3001"})
public class PowerBIController {

    @Autowired
    private MicrosoftGraphService powerBIService;

    @GetMapping("/embed-config")
    @Operation(summary = "Get Power BI embed configuration", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Object>> getEmbedConfig() {
        try {
            Map<String, Object> config = powerBIService.getEmbedConfig();
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get statistics for Power BI dashboard", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(powerBIService.getStatistics());
    }

    @GetMapping("/report-data")
    @Operation(summary = "Get report data for Power BI", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<Map<String, Object>>> getReportData() {
        return ResponseEntity.ok(powerBIService.getReportData());
    }

    @GetMapping("/status-distribution")
    @Operation(summary = "Get status distribution for charts", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Long>> getStatusDistribution() {
        return ResponseEntity.ok(powerBIService.getStatusDistribution());
    }

    @GetMapping("/user")
    @Operation(summary = "Get current user info from Microsoft Graph", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getUserInfo() {
        try {
            String accessToken = powerBIService.getAccessToken();
            Map<String, Object> userInfo = powerBIService.getUserInfo(accessToken);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reports")
    @Operation(summary = "Get Power BI reports", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getReports() {
        try {
            String accessToken = powerBIService.getAccessToken();
            List<Map<String, Object>> reports = powerBIService.getPowerBIReports(accessToken);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}