package hobbiebackend.web;

import hobbiebackend.model.dto.MortgageApplicationRequest;
import hobbiebackend.model.dto.MortgageApplicationResponse;
import hobbiebackend.model.dto.MortgageCalculationRequest;
import hobbiebackend.model.dto.MortgageCalculationResponse;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.enums.MortgageStatusEnum;
import hobbiebackend.service.MortgageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mortgage")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://localhost:3001"})
public class MortgageController {

    @Autowired
    private MortgageService mortgageService;

    @PostMapping("/calculate")
    @Operation(summary = "Calculate monthly mortgage payment")
    public ResponseEntity<MortgageCalculationResponse> calculateMortgage(@RequestBody MortgageCalculationRequest request) {
        MortgageCalculationResponse response = mortgageService.calculateMortgage(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/apply")
    @Operation(summary = "Submit mortgage application", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MortgageApplicationResponse> submitApplication(@Valid @RequestBody MortgageApplicationRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        MortgageApplication saved = mortgageService.submitApplication(request, username);

        MortgageApplicationResponse response = new MortgageApplicationResponse();
        response.setId(saved.getId());
        response.setApplicantName(saved.getApplicantName());
        response.setEmail(saved.getEmail());
        response.setPropertyPrice(saved.getPropertyPrice());
        response.setDownPayment(saved.getDownPayment());
        response.setLoanAmount(saved.getLoanAmount());
        response.setInterestRate(saved.getInterestRate());
        response.setLoanTermYears(saved.getLoanTermYears());
        response.setMonthlyPayment(saved.getMonthlyPayment());
        response.setAnnualIncome(saved.getAnnualIncome());
        response.setMonthlyDebt(saved.getMonthlyDebt());
        response.setDebtToIncomeRatio(saved.getDebtToIncomeRatio());
        response.setEmploymentStatus(saved.getEmploymentStatus());
        response.setCreditScore(saved.getCreditScore());
        response.setPropertyType(saved.getPropertyType());
        response.setPropertyAddress(saved.getPropertyAddress());
        response.setApplicationStatus(saved.getApplicationStatus().name());
        response.setAiRecommendation(saved.getAiRecommendation());
        response.setAiConfidenceScore(saved.getAiConfidenceScore());
        response.setCreatedAt(saved.getCreatedAt());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get mortgage application details", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MortgageApplication> getApplication(@PathVariable Long id) {
        MortgageApplication application = mortgageService.getApplication(id);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update application status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<MortgageApplication> updateStatus(@PathVariable Long id, @RequestParam String status) {
        MortgageApplication application = mortgageService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get application statistics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalApplications", (long) mortgageService.getAllApplications().size());
        stats.put("approved", mortgageService.getApplicationCountByStatus(MortgageStatusEnum.APPROVED));
        stats.put("pending", mortgageService.getApplicationCountByStatus(MortgageStatusEnum.PENDING));
        stats.put("pending_review", mortgageService.getApplicationCountByStatus(MortgageStatusEnum.PENDING_REVIEW));
        stats.put("denied", mortgageService.getApplicationCountByStatus(MortgageStatusEnum.DENIED));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent applications", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<MortgageApplication>> getRecentApplications() {
        List<MortgageApplication> recent = mortgageService.getRecentApplications(30);
        return ResponseEntity.ok(recent);
    }

    @GetMapping("/applications")
    @Operation(summary = "Get all applications for current user", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<MortgageApplication>> getUserApplications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<MortgageApplication> applications = mortgageService.getApplicationsByUser(username);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all applications", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<MortgageApplication>> getAllApplications() {
        List<MortgageApplication> applications = mortgageService.getAllApplications();
        return ResponseEntity.ok(applications);
    }
}