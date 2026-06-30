package hobbiebackend.service;

import hobbiebackend.model.dto.AppClientSignUpDto;
import hobbiebackend.model.dto.BusinessRegisterDto;
import hobbiebackend.model.entities.AppClient;
import hobbiebackend.model.entities.BusinessOwner;
import hobbiebackend.model.entities.Hobby;
import hobbiebackend.model.entities.UserEntity;

import java.util.List;

public interface UserService {
    List<UserEntity> seedUsersAndUserRoles();
    AppClient register(AppClientSignUpDto user);
    BusinessOwner registerBusiness(BusinessRegisterDto business);
    BusinessOwner saveUpdatedUser(BusinessOwner businessOwner);
    AppClient saveUpdatedUserClient(AppClient appClient);
    UserEntity findUserById(Long userId);
    UserEntity findUserByEmail(String email);
    boolean deleteUser(Long id);
    BusinessOwner findBusinessOwnerById(Long id);
    UserEntity findUserByUsername(String username);
    boolean userExists(String username, String email);
    void saveUserWithUpdatedPassword(UserEntity userEntity);
    AppClient findAppClientById(Long clientId);
    void findAndRemoveHobbyFromClientsRecords(Hobby hobby);
    boolean businessExists(String businessName);
    AppClient findAppClientByUsername(String username);
    BusinessOwner findBusinessByUsername(String username);
}