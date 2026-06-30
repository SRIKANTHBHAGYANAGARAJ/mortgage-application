package hobbiebackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import hobbiebackend.model.dto.MortgageApplicationRequest;
import hobbiebackend.model.entities.MortgageApplication;
import hobbiebackend.service.MortgageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://localhost:3001"})
public class BulkUploadController {

    @Autowired
    private MortgageService mortgageService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/bulk-upload")
    public ResponseEntity<Map<String, Object>> bulkUpload(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int success = 0;
        int total = 0;

        try {
            String content = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            ).lines().reduce("", (acc, line) -> acc + line);

            List<Map<String, Object>> records = parseFileContent(content, file.getOriginalFilename());
            total = records.size();

            for (int i = 0; i < records.size(); i++) {
                try {
                    MortgageApplicationRequest request = objectMapper.convertValue(records.get(i), MortgageApplicationRequest.class);
                    mortgageService.submitApplication(request, "system");
                    success++;
                } catch (Exception e) {
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                }
            }

            response.put("total", total);
            response.put("success", success);
            response.put("failed", total - success);
            response.put("errors", errors);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private List<Map<String, Object>> parseFileContent(String content, String filename) {
        List<Map<String, Object>> records = new ArrayList<>();

        try {
            if (filename.endsWith(".json")) {
                if (content.trim().startsWith("[")) {
                    List<Map<String, Object>> jsonRecords = objectMapper.readValue(content, List.class);
                    records.addAll(jsonRecords);
                } else {
                    Map<String, Object> singleRecord = objectMapper.readValue(content, Map.class);
                    records.add(singleRecord);
                }
            } else if (filename.endsWith(".csv")) {
                String[] lines = content.split("\n");
                if (lines.length > 1) {
                    String[] headers = lines[0].split(",");
                    for (int i = 1; i < lines.length; i++) {
                        String[] values = lines[i].split(",");
                        Map<String, Object> record = new HashMap<>();
                        for (int j = 0; j < headers.length && j < values.length; j++) {
                            record.put(headers[j].trim(), values[j].trim());
                        }
                        records.add(record);
                    }
                }
            }
        } catch (Exception e) {
            // Log error
        }

        return records;
    }
}