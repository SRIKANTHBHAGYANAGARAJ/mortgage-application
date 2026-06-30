package hobbiebackend.web;

import hobbiebackend.model.dto.AuthRequest;
import hobbiebackend.model.dto.AuthResponse;
import hobbiebackend.model.dto.RegisterRequest;
import hobbiebackend.model.entities.UserEntity;
import hobbiebackend.model.entities.UserRoleEntity;
import hobbiebackend.model.enums.UserRoleEnum;
import hobbiebackend.model.repository.UserRepository;
import hobbiebackend.model.repository.UserRoleRepository;
import hobbiebackend.security.HobbieUserDetailsService;
import hobbiebackend.utility.JWTUtility;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private HobbieUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtility jwtUtility;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtUtility.generateToken(userDetails);

        UserEntity user = userRepository.findByUsername(request.getUsername()).orElse(null);
        String role = user != null && !user.getRoles().isEmpty()
                ? "ROLE_" + user.getRoles().get(0).getRole().name()
                : "ROLE_USER";

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUsername(request.getUsername());
        response.setRole(role);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        UserRoleEntity userRoleEntity = userRoleRepository.findByRole(UserRoleEnum.USER)
                .orElseThrow(() -> new RuntimeException("User role not found. Please seed the database."));

        user.setRoles(Collections.singletonList(userRoleEntity));

        UserEntity registered = userRepository.save(user);
        return new ResponseEntity<>(registered, HttpStatus.CREATED);
    }
}