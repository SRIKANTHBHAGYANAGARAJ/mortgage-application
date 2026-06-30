package hobbiebackend.model.repository;

import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.model.enums.MortgageStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MortgageApplicationRepository extends JpaRepository<MortgageApplication, Long> {
    List<MortgageApplication> findByEmail(String email);
    List<MortgageApplication> findByApplicationStatus(MortgageStatusEnum status);
    List<MortgageApplication> findByApplicantNameContaining(String name);
    List<MortgageApplication> findByApplicationStatusAndCreditScoreGreaterThanEqual(MortgageStatusEnum status, Integer creditScore);

    @Query("SELECT m FROM MortgageApplication m WHERE m.user.id = :userId")
    List<MortgageApplication> findByUserId(@Param("userId") Long userId);

    long countByApplicationStatus(MortgageStatusEnum applicationStatus);
}