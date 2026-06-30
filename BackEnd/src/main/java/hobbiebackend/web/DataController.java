package hobbiebackend.web;

import hobbiebackend.service.snowflake.SnowflakeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:4200")
public class DataController {

    @Autowired
    private SnowflakeService snowflakeService;

    @PostMapping("/snowflake/init")
    @Operation(summary = "Initialize Snowflake warehouse and tables", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<String> initializeSnowflake() {
        snowflakeService.createMortgageWarehouse();
        snowflakeService.createMortgageDatabase();
        snowflakeService.createMortgageSchema();
        snowflakeService.createMortgageTable();
        snowflakeService.createAnalyticsView();
        return ResponseEntity.ok("Snowflake initialized successfully");
    }
}