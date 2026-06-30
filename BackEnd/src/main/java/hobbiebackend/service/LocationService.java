package hobbiebackend.service;

import hobbiebackend.model.entities.Location;
import hobbiebackend.model.enums.LocationEnum;

import java.util.List;

public interface LocationService {
    List<Location> initLocations();
    Location getLocationByName(LocationEnum locationEnum);
    List<Location> getAllLocations();
}