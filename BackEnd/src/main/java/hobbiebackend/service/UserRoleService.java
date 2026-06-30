package hobbiebackend.service;

import hobbiebackend.model.entities.UserRoleEntity;
import hobbiebackend.model.enums.UserRoleEnum;

public interface UserRoleService {
    UserRoleEntity getUserRoleByEnumName(UserRoleEnum userRoleEnum);
    UserRoleEntity saveRole(UserRoleEntity userRoleEntity);
}