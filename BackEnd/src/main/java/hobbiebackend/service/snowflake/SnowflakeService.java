package hobbiebackend.service.snowflake;

import hobbiebackend.model.entities.MortgageApplication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SnowflakeService {

    public void createMortgageWarehouse() {
        System.out.println("Snowflake disabled");
    }

    public void createMortgageDatabase() {
        System.out.println("Snowflake disabled");
    }

    public void createMortgageSchema() {
        System.out.println("Snowflake disabled");
    }

    public void createMortgageTable() {
        System.out.println("Snowflake disabled");
    }

    public void insertMortgageApplication(MortgageApplication application) {
        System.out.println("Snowflake insert skipped");
    }

    public List<MortgageApplication> getMortgageApplications() {
        return new ArrayList<>();
    }

    public void updateApplicationStatus(Long id, String status) {
        System.out.println("Snowflake update skipped");
    }

    public List<MortgageApplication> getHighRiskApplications() {
        return new ArrayList<>();
    }

    public void createAnalyticsView() {
        System.out.println("Snowflake analytics view creation skipped");
    }
}