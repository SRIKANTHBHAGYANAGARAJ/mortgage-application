package hobbiebackend.model.dto;

import hobbiebackend.model.enums.GenderEnum;

public class UpdateAppClientDto {
    private Long id;
    private String fullName;
    private GenderEnum gender;
    private String password;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public GenderEnum getGender() { return gender; }
    public void setGender(GenderEnum gender) { this.gender = gender; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}