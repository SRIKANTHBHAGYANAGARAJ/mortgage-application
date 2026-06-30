package hobbiebackend.web;

import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.service.MortgageService;
import hobbiebackend.service.ml.MortgagePredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://localhost:3001"})
public class MLPredictionController {

    @Autowired
    private MortgagePredictionService predictionService;

    @Autowired
    private MortgageService mortgageService;

    @PostMapping("/predict/{applicationId}")
    @Operation(summary = "Predict approval probability", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Object>> predictApproval(@PathVariable Long applicationId) {
        MortgageApplication application = mortgageService.getApplication(applicationId);
        Map<String, Object> prediction = predictionService.predictApproval(application);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/global-trends")
    @Operation(summary = "Get global market trends")
    public ResponseEntity<Map<String, Object>> getGlobalTrends() {
        Map<String, Object> trends = predictionService.getGlobalTrends();
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/competitors")
    @Operation(summary = "Get competitor analysis")
    public ResponseEntity<List<Map<String, Object>>> getCompetitors() {
        List<Map<String, Object>> competitors = predictionService.getCompetitorAnalysis();
        return ResponseEntity.ok(competitors);
    }
}