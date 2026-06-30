package hobbiebackend.service;

import hobbiebackend.model.dto.MortgageApplicationRequest;
import hobbiebackend.model.dto.MortgageCalculationRequest;
import hobbiebackend.model.dto.MortgageCalculationResponse;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.enums.MortgageStatusEnum;

import java.util.List;

public interface MortgageService {
    MortgageCalculationResponse calculateMortgage(MortgageCalculationRequest request);
    MortgageApplication submitApplication(MortgageApplicationRequest request, String username);
    MortgageApplication getApplication(Long id);
    List<MortgageApplication> getApplicationsByUser(String username);
    List<MortgageApplication> getApplicationsByStatus(MortgageStatusEnum status);
    MortgageApplication updateApplicationStatus(Long id, MortgageStatusEnum status);
    MortgageApplication updateApplicationStatus(Long id, String status);
    List<MortgageApplication> getAllApplications();
    void deleteApplication(Long id);
    List<MortgageApplication> getHighRiskApplications();
    List<MortgageApplication> getRecentApplications(int days);
    Long getApplicationCountByStatus(MortgageStatusEnum status);
}