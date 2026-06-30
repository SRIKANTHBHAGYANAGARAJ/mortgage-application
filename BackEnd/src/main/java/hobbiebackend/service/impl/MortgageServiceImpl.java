package hobbiebackend.service.impl;

import hobbiebackend.handler.NotFoundException;
import hobbiebackend.model.dto.MortgageApplicationRequest;
import hobbiebackend.model.dto.MortgageCalculationRequest;
import hobbiebackend.model.dto.MortgageCalculationResponse;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.entities.UserEntity;
import hobbiebackend.model.enums.MortgageStatusEnum;
import hobbiebackend.model.repository.MortgageApplicationRepository;
import hobbiebackend.model.repository.UserRepository;
import hobbiebackend.service.MortgageService;
import hobbiebackend.service.ai.MortgageAIService;
import hobbiebackend.service.snowflake.SnowflakeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MortgageServiceImpl implements MortgageService {

    private final MortgageApplicationRepository mortgageApplicationRepository;
    private final UserRepository userRepository;
    private final SnowflakeService snowflakeService;
    private final MortgageAIService aiService;
    private final ModelMapper modelMapper;

    @Autowired
    public MortgageServiceImpl(MortgageApplicationRepository mortgageApplicationRepository,
                               UserRepository userRepository,
                               SnowflakeService snowflakeService,
                               MortgageAIService aiService,
                               ModelMapper modelMapper) {
        this.mortgageApplicationRepository = mortgageApplicationRepository;
        this.userRepository = userRepository;
        this.snowflakeService = snowflakeService;
        this.aiService = aiService;
        this.modelMapper = modelMapper;
    }

    @Override
    public MortgageCalculationResponse calculateMortgage(MortgageCalculationRequest request) {
        BigDecimal loanAmount = request.getPropertyPrice().subtract(request.getDownPayment());

        double monthlyRate = request.getInterestRate() / 100 / 12;
        int numberOfPayments = request.getLoanTermYears() * 12;

        BigDecimal onePlusR = BigDecimal.ONE.add(BigDecimal.valueOf(monthlyRate));
        BigDecimal onePlusRPowerN = onePlusR.pow(numberOfPayments);

        BigDecimal numerator = loanAmount.multiply(onePlusRPowerN.multiply(BigDecimal.valueOf(monthlyRate)));
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);

        BigDecimal monthlyPayment = numerator.divide(denominator, 2, RoundingMode.HALF_UP);
        BigDecimal totalPayment = monthlyPayment.multiply(BigDecimal.valueOf(numberOfPayments));
        BigDecimal totalInterest = totalPayment.subtract(loanAmount);

        MortgageCalculationResponse response = new MortgageCalculationResponse();
        response.setMonthlyPayment(monthlyPayment);
        response.setTotalPayment(totalPayment);
        response.setTotalInterest(totalInterest);
        response.setLoanAmount(loanAmount);

        return response;
    }

    @Override
    public MortgageApplication submitApplication(MortgageApplicationRequest request, String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        MortgageApplication application = modelMapper.map(request, MortgageApplication.class);
        application.setUser(user);
        application.setLoanAmount(request.getPropertyPrice().subtract(request.getDownPayment()));

        // Calculate DTI
        BigDecimal monthlyIncome = request.getAnnualIncome().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        double dti = request.getMonthlyDebt().doubleValue() / monthlyIncome.doubleValue();
        application.setDebtToIncomeRatio(dti);

        // Calculate monthly payment
        MortgageCalculationRequest calcRequest = new MortgageCalculationRequest();
        calcRequest.setPropertyPrice(request.getPropertyPrice());
        calcRequest.setDownPayment(request.getDownPayment());
        calcRequest.setInterestRate(request.getInterestRate());
        calcRequest.setLoanTermYears(request.getLoanTermYears());

        MortgageCalculationResponse calcResponse = calculateMortgage(calcRequest);
        application.setMonthlyPayment(calcResponse.getMonthlyPayment());

        // Get AI recommendation
        String aiRecommendation = aiService.getAIMortgageRecommendation(application);
        application.setAiRecommendation(aiRecommendation);

        // Calculate risk score
        Double riskScore = aiService.calculateRiskScore(application);
        application.setAiConfidenceScore(riskScore);

        // Auto-approve or deny based on risk score
        if (riskScore >= 60) {
            application.setApplicationStatus(MortgageStatusEnum.APPROVED);
        } else if (riskScore < 40) {
            application.setApplicationStatus(MortgageStatusEnum.DENIED);
        } else {
            application.setApplicationStatus(MortgageStatusEnum.PENDING_REVIEW);
        }

        application.setCreatedAt(LocalDateTime.now());

        MortgageApplication saved = mortgageApplicationRepository.save(application);

        // Save to Snowflake
        try {
            snowflakeService.insertMortgageApplication(saved);
        } catch (Exception e) {
            System.err.println("Failed to save to Snowflake: " + e.getMessage());
        }

        return saved;
    }

    @Override
    public MortgageApplication getApplication(Long id) {
        return mortgageApplicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Application not found with id: " + id));
    }

    @Override
    public List<MortgageApplication> getApplicationsByUser(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mortgageApplicationRepository.findByUserId(user.getId());
    }

    @Override
    public List<MortgageApplication> getApplicationsByStatus(MortgageStatusEnum status) {
        return mortgageApplicationRepository.findByApplicationStatus(status);
    }

    @Override
    public MortgageApplication updateApplicationStatus(Long id, MortgageStatusEnum status) {
        MortgageApplication application = getApplication(id);
        application.setApplicationStatus(status);
        application.setUpdatedAt(LocalDateTime.now());

        MortgageApplication updated = mortgageApplicationRepository.save(application);

        try {
            snowflakeService.updateApplicationStatus(id, status.name());
        } catch (Exception e) {
            System.err.println("Failed to update Snowflake: " + e.getMessage());
        }

        return updated;
    }

    @Override
    public MortgageApplication updateApplicationStatus(Long id, String status) {
        MortgageStatusEnum statusEnum = MortgageStatusEnum.valueOf(status.toUpperCase());
        return updateApplicationStatus(id, statusEnum);
    }

    @Override
    public List<MortgageApplication> getAllApplications() {
        return mortgageApplicationRepository.findAll();
    }

    @Override
    public void deleteApplication(Long id) {
        if (!mortgageApplicationRepository.existsById(id)) {
            throw new NotFoundException("Application not found with id: " + id);
        }
        mortgageApplicationRepository.deleteById(id);
    }

    @Override
    public List<MortgageApplication> getHighRiskApplications() {
        try {
            return snowflakeService.getHighRiskApplications();
        } catch (Exception e) {
            System.err.println("Failed to get high risk applications from Snowflake: " + e.getMessage());
            // Fallback to local database
            return mortgageApplicationRepository.findAll().stream()
                    .filter(app -> app.getDebtToIncomeRatio() > 0.43 || app.getCreditScore() < 650)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public List<MortgageApplication> getRecentApplications(int days) {
        return mortgageApplicationRepository.findAll().stream()
                .filter(app -> app.getCreatedAt().isAfter(LocalDateTime.now().minusDays(days)))
                .collect(Collectors.toList());
    }

    @Override
    public Long getApplicationCountByStatus(MortgageStatusEnum status) {
        return mortgageApplicationRepository.countByApplicationStatus(status);
    }
}