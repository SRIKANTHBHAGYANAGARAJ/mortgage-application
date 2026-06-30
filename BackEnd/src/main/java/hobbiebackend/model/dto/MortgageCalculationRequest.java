package hobbiebackend.model.dto;

import javax.validation.constraints.*;
import java.math.BigDecimal;

public class MortgageCalculationRequest {

    @NotNull(message = "Property price is required")
    @Positive(message = "Property price must be positive")
    private BigDecimal propertyPrice;

    @NotNull(message = "Down payment is required")
    @PositiveOrZero(message = "Down payment must be zero or positive")
    private BigDecimal downPayment;

    @NotNull(message = "Interest rate is required")
    @Positive(message = "Interest rate must be positive")
    private Double interestRate;

    @NotNull(message = "Loan term is required")
    @Min(value = 1, message = "Loan term must be at least 1 year")
    @Max(value = 40, message = "Loan term cannot exceed 40 years")
    private Integer loanTermYears;

    // Getters and Setters
    public BigDecimal getPropertyPrice() { return propertyPrice; }
    public void setPropertyPrice(BigDecimal propertyPrice) { this.propertyPrice = propertyPrice; }

    public BigDecimal getDownPayment() { return downPayment; }
    public void setDownPayment(BigDecimal downPayment) { this.downPayment = downPayment; }

    public Double getInterestRate() { return interestRate; }
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate; }

    public Integer getLoanTermYears() { return loanTermYears; }
    public void setLoanTermYears(Integer loanTermYears) { this.loanTermYears = loanTermYears; }
}