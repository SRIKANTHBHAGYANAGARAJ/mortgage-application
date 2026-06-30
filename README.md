# ?? Mortgage-io - Full-Stack Mortgage Application with AI Integration 
 
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-brightgreen) 
![React](https://img.shields.io/badge/React-18.2.0-blue) 
![Java](https://img.shields.io/badge/Java-21-orange) 
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) 
![JWT](https://img.shields.io/badge/JWT-Authentication-orange) 
![LangChain4j](https://img.shields.io/badge/LangChain4j-AI-green) 
![OpenAI](https://img.shields.io/badge/OpenAI-Integration-purple) 
![License](https://img.shields.io/badge/License-MIT-green) 
 
--- 
 
## ?? Table of Contents 
- [Overview](#overview) 
- [Technology Stack](#technology-stack) 
- [Running the Application](#running-the-application) 
- [API Documentation](#api-documentation) 
- [Environment Variables](#environment-variables) 
- [Database Schema](#database-schema) 
- [Deployment](#deployment) 
- [Testing](#testing) 
- [Contributing](#contributing) 
- [License](#license) 
- [Contact](#contact) 
 
--- 
 
## ?? Overview 
 
**Mortgage-io** is a comprehensive full-stack mortgage application that leverages **Artificial Intelligence** to provide intelligent mortgage predictions, real-time calculations, and personalized financial advice. The platform connects users with verified business owners who offer mortgage services. 
 
### Key Highlights 
- ?? **AI-Powered Mortgage Predictions** using LangChain4j and OpenAI 
- ?? **Intelligent Chatbot** for instant mortgage queries 
- ?? **Real-time Analytics** with Power BI integration 
- ?? **Secure Authentication** using JWT tokens 
- ?? **Business Owner Dashboard** for mortgage offer management 
- ?? **Interactive Data Visualization** with Recharts 
- ?? **Cloud Integration** with Snowflake and Cloudinary 
 
--- 
 
## ??? Technology Stack 
 
### Backend Technologies 
 
### Frontend Technologies 
 
 
--- 
 
 
**Key Features Used:** 
- Natural language understanding 
- Context-aware responses 
- Integration with OpenAI models 
- Custom prompt engineering 
 
**Implementation:** 
```java 
@Service 
public class ChatbotService { 
    @Autowired 
    private ChatLanguageModel chatModel; 
ECHO is off.
    public String processMortgageQuery(String userMessage) { 
        String prompt = "You are a mortgage expert. Answer: " + userMessage; 
        return chatModel.generate(prompt); 
    } 
} 
``` 
 
--- 
 
### 2. OpenAI GPT Integration 
**Overview:** Integration with OpenAI's GPT models for advanced natural language processing and intelligent mortgage predictions. 
 
**Implementation:** 
```java 
@Service 
public class MortgageAIService { 
    @Autowired 
    private OpenAiChatModel openAIModel; 
ECHO is off.
    public MortgagePrediction predictEligibility(UserFinancialData data) { 
        String prompt = String.format( 
            "Analyze mortgage eligibility for income: %d, credit score: %d, debt: %d", 
            data.getIncome(), data.getCreditScore(), data.getDebt() 
        ); 
        String result = openAIModel.generate(prompt); 
        return parsePrediction(result); 
    } 
} 
``` 
 
**Key Features:** 
- Intelligent mortgage eligibility analysis 
- Personalized financial recommendations 
- Risk assessment and scoring 
- Natural language query processing 
 
--- 
 
### 3. Apache OpenNLP (Natural Language Processing) 
**Overview:** Open-source machine learning toolkit for natural language text processing. 
 
**Implementation:** 
```java 
@Service 
public class NLPService { 
    private TokenizerModel tokenModel; 
    private EntityRecognizerModel entityModel; 
ECHO is off.
        String[] tokens = tokenizer.tokenize(text); 
        Span[] spans = entityRecognizer.find(tokens); 
        return extractNamedEntities(tokens, spans); 
    } 
} 
``` 
 
**Key Features:** 
- Entity extraction (names, locations, amounts) 
- Text classification 
- Tokenization and sentence detection 
- Part-of-speech tagging 
 
--- 
 
**Overview:** Cloud-based media management with AI-powered image recognition and analysis capabilities. 
 
**Implementation:** 
```java 
@Service 
public class DocumentVerificationService { 
    @Autowired 
    private Cloudinary cloudinary; 
ECHO is off.
    public VerificationResult verifyDocument(MultipartFile file) { 
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),  
            ObjectUtils.asMap("detection", "adv_face", "ocr", "documents")); 
        return parseVerificationResult(uploadResult); 
    } 
} 
``` 
 
**Key Features:** 
- AI-powered face detection 
- Optical Character Recognition (OCR) 
- Document verification 
- Image optimization 
 
--- 
 
### 5. Snowflake (AI Data Warehouse) 
**Overview:** Cloud data platform for AI/ML with advanced analytics capabilities. 
 
**Implementation:** 
```java 
@Service 
public class SnowflakeService { 
    @Autowired 
    private JdbcTemplate snowflakeJdbcTemplate; 
ECHO is off.
        String query = "SELECT * FROM mortgage_analytics"; 
        return snowflakeJdbcTemplate.query(query, new AnalyticsMapper()); 
    } 
} 
``` 
 
**Key Features:** 
- Data storage for ML models 
- Analytics processing 
- Data warehousing for mortgage data 
- Scalable cloud storage 
 
--- 
 
### 6. Power BI Integration 
**Overview:** Business intelligence and analytics with interactive dashboards. 
 
**Implementation:** 
```java 
@Service 
public class PowerBIService { 
    public String getEmbeddedDashboard() { 
        return powerBIEmbedUrl; 
    } 
} 
``` 
 
**Key Features:** 
- Real-time mortgage analytics 
- Interactive dashboards 
- Data visualization 
- Embedded reports 
 
--- 
 
### 7. JWT (JSON Web Tokens) Authentication 
**Overview:** Secure authentication and authorization using JWT tokens. 
 
**Implementation:** 
```java 
@Component 
public class JWTUtility { 
    public String generateToken(UserDetails userDetails) { 
        return Jwts.builder() 
            .setSubject(userDetails.getUsername()) 
            .setIssuedAt(new Date()) 
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) 
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY) 
            .compact(); 
    } 
} 
``` 
 
**Key Features:** 
- Token-based authentication 
- Stateless session management 
- Role-based access control 
- Secure API endpoints 
 
--- 
 
## ?? Project Structure 
 
``` 
mortgage-io/ 
ÃÄÄ BackEnd/ 
³   ÃÄÄ src/ 
³   ³   ÃÄÄ main/ 
³   ³   ³   ÃÄÄ java/ 
³   ³   ³   ³   ÀÄÄ hobbiebackend/ 
³   ³   ³   ³       ÃÄÄ config/           # Configuration classes 
³   ³   ³   ³       ÃÄÄ controller/       # REST API controllers 
³   ³   ³   ³       ÃÄÄ model/            # Entities and DTOs 
³   ³   ³   ³       ÃÄÄ repository/       # JPA repositories 
³   ³   ³   ³       ÃÄÄ service/          # Business logic 
³   ³   ³   ³       ³   ÃÄÄ ai/           # AI services 
³   ³   ³   ³       ³   ÃÄÄ ml/           # ML services 
³   ³   ³   ³       ³   ÀÄÄ impl/         # Implementations 
³   ³   ³   ³       ÃÄÄ security/         # Security configuration 
³   ³   ³   ³       ÃÄÄ filter/           # JWT filters 
³   ³   ³   ³       ÃÄÄ handler/          # Exception handlers 
³   ³   ³   ³       ÃÄÄ utility/          # Utility classes 
³   ³   ³   ³       ÀÄÄ init/             # Database initialization 
³   ³   ³   ÀÄÄ resources/ 
³   ³   ³       ÀÄÄ application.properties 
³   ³   ÀÄÄ test/ 
³   ³       ÀÄÄ java/                     # Unit tests 
³   ÃÄÄ pom.xml                           # Maven dependencies 
³   ÀÄÄ mvnw                              # Maven wrapper 
³ 
ÃÄÄ FrontEnd/ 
³   ÃÄÄ src/ 
³   ³   ÃÄÄ api/                          # API services 
³   ³   ³   ÃÄÄ authentication/           # Auth APIs 
³   ³   ³   ÃÄÄ hobby/                    # Hobby/Offer APIs 
³   ³   ³   ÃÄÄ users/                    # User APIs 
³   ³   ³   ÀÄÄ customAxiosConfig/        # Axios configuration 
³   ³   ÃÄÄ components/                   # React components 
³   ³   ³   ÃÄÄ admin/                    # Admin components 
³   ³   ³   ÃÄÄ analytics/                # Analytics components 
³   ³   ³   ÃÄÄ auth/                     # Authentication components 
³   ³   ³   ÃÄÄ chatbot/                  # Chatbot component 
³   ³   ³   ÃÄÄ layout/                   # Layout components 
³   ³   ³   ÃÄÄ ml/                       # ML components 
³   ³   ³   ÃÄÄ root/                     # Root components 
³   ³   ³   ÀÄÄ protectedRoutes/          # Protected route components 
³   ³   ÃÄÄ pages/                        # Page components 
³   ³   ÃÄÄ css/                          # CSS modules 
³   ³   ÃÄÄ img/                          # Images 
³   ³   ÃÄÄ __test__/                     # Unit tests 
³   ³   ÃÄÄ App.js                        # Main component 
³   ³   ÃÄÄ App.css                       # Main CSS 
³   ³   ÀÄÄ index.js                      # Entry point 
³   ÃÄÄ public/                           # Public assets 
³   ÃÄÄ package.json                      # NPM dependencies 
³   ÀÄÄ package-lock.json                 # Locked dependencies 
³ 
ÃÄÄ .gitignore                            # Git ignore file 
ÀÄÄ README.md                             # Documentation 
``` 
 
--- 
 
## ? Features 
 
### User Features 
- ?? **Browse Mortgage Offers** from verified businesses 
- ?? **Mortgage Calculator** with real-time results 
- ?? **AI Chatbot** for mortgage queries 
- ?? **Mortgage Prediction** using AI 
- ?? **Responsive Design** for all devices 
- ?? **Save Favorite Offers** 
- ?? **Application Tracking** 
 
### Business Owner Features 
- ?? **Create Mortgage Offers** 
- ?? **Analytics Dashboard** (Power BI) 
- ?? **Track Applications** in real-time 
- ?? **Manage Client Requests** 
- ?? **Bulk Data Upload** 
 
### Admin Features 
- ?? **Global Analytics** Dashboard 
- ?? **Bulk Data Upload** 
- ?? **User Management** 
- ?? **Application Review** 
 
--- 
 
 
### Prerequisites 
- **Java 17+** - [Download](https://adoptium.net/) 
- **Node.js 16+** - [Download](https://nodejs.org/) 
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/) 
- **Maven** (optional, if not using Maven wrapper) 
 
### Step 1: Clone the Repository 
```bash 
git clone https://github.com/SRIKANTHBHAGYANAGARAJ/mortgage-io.git 
cd mortgage-io 
``` 
 
### Step 2: Backend Setup 
```bash 
cd BackEnd 
./mvnw clean install 
``` 
 
**Configure MySQL in** `BackEnd/src/main/resources/application.properties`: 
```properties 
spring.datasource.url=jdbc:mysql://localhost:3306/mortgage_db 
spring.datasource.username=root 
spring.datasource.password=your_password 
spring.jpa.hibernate.ddl-auto=update 
jwt.secret=your-super-secret-key-for-jwt-1234567890 
jwt.expiration=86400000 
server.port=8081 
openai.api.key=your-openai-api-key 
``` 
 
### Step 3: Frontend Setup 
```bash 
cd ../FrontEnd 
npm install 
``` 
 
**Create `.env` file in FrontEnd/** 
```env 
REACT_APP_API_URL=http://localhost:8081 
REACT_APP_CHATBOT_ENABLED=true 
REACT_APP_AI_ENABLED=true 
``` 
 
### Step 4: Database Setup 
```sql 
CREATE DATABASE mortgage_db; 
``` 
 
--- 
 
## ?? Running the Application 
 
### Start Backend (Terminal 1) 
```bash 
cd BackEnd 
./mvnw spring-boot:run 
``` 
 
**Backend will run at:** `http://localhost:8081` 
 
### Start Frontend (Terminal 2) 
```bash 
cd FrontEnd 
npm start 
``` 
 
**Frontend will run at:** `http://localhost:3000` 
 
### Access the Application 
- **Frontend:** http://localhost:3000 
- **Backend API:** http://localhost:8081 
- **Swagger UI:** http://localhost:8081/swagger-ui/index.html 
- **Actuator:** http://localhost:8081/actuator 
 
--- 
 
## ?? API Documentation 
 
Once the backend is running, access the Swagger UI: 
``` 
http://localhost:8081/swagger-ui/index.html 
``` 
 
### Key API Endpoints 
 
#### Authentication 
 
#### Mortgage Offers (Hobbies) 
 
 
#### Users 
 
#### Analytics 
 
--- 
 
## ?? Environment Variables 
 
### Backend (`application.properties`) 
 
#### Database 
```properties 
spring.datasource.url=jdbc:mysql://localhost:3306/mortgage_db 
spring.datasource.username=root 
spring.datasource.password=your_password 
``` 
 
#### Security (JWT) 
```properties 
jwt.secret=your-super-secret-key-for-jwt-1234567890 
jwt.expiration=86400000 
``` 
 
#### AI Services 
```properties 
openai.api.key=your-openai-api-key 
cloudinary.api.key=your-cloudinary-api-key 
snowflake.url=your-snowflake-url 
powerbi.embed-url=your-powerbi-embed-url 
``` 
 
#### Server 
```properties 
server.port=8081 
``` 
 
### Frontend (`.env`) 
 
```env 
REACT_APP_API_URL=http://localhost:8081 
REACT_APP_CHATBOT_ENABLED=true 
REACT_APP_AI_ENABLED=true 
REACT_APP_ANALYTICS_ENABLED=true 
``` 
 
--- 
 
## ??? Database Schema 
 
### Core Tables 
 
#### `users` 
```sql 
CREATE TABLE users ( 
    id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    first_name VARCHAR(100), 
    last_name VARCHAR(100), 
    role ENUM('USER', 'BUSINESS', 'ADMIN'), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
); 
``` 
 
#### `hobbies` (Mortgage Offers) 
```sql 
CREATE TABLE hobbies ( 
    id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    business_owner_id BIGINT, 
    title VARCHAR(255), 
    description TEXT, 
    category VARCHAR(100), 
    location VARCHAR(100), 
    price DECIMAL(10,2), 
    interest_rate DECIMAL(5,2), 
    down_payment_percentage DECIMAL(5,2), 
    min_credit_score INT, 
    max_loan_amount DECIMAL(15,2), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (business_owner_id) REFERENCES business_owners(id) 
); 
``` 
 
#### `mortgage_applications` 
```sql 
CREATE TABLE mortgage_applications ( 
    id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    user_id BIGINT, 
    hobby_id BIGINT, 
    amount DECIMAL(15,2), 
    status VARCHAR(50), 
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    document_status VARCHAR(50), 
    payment_status VARCHAR(50), 
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (hobby_id) REFERENCES hobbies(id) 
); 
``` 
 
--- 
 
## ?? Deployment 
 
### Docker Deployment 
 
**1. Build Backend Docker Image** 
```bash 
cd BackEnd 
docker build -t mortgage-backend . 
``` 
 
**2. Build Frontend Docker Image** 
```bash 
cd FrontEnd 
docker build -t mortgage-frontend . 
``` 
 
**3. Docker Compose** 
```yaml 
version: '3.8' 
services: 
  mysql: 
    image: mysql:8.0 
    environment: 
      MYSQL_ROOT_PASSWORD: root 
      MYSQL_DATABASE: mortgage_db 
    ports: 
      - "3306:3306" 
    volumes: 
      - mysql_data:/var/lib/mysql 
  backend: 
    build: ./BackEnd 
    ports: 
      - "8081:8081" 
    depends_on: 
      - mysql 
    environment: 
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/mortgage_db 
      SPRING_DATASOURCE_USERNAME: root 
      SPRING_DATASOURCE_PASSWORD: root 
  frontend: 
    build: ./FrontEnd 
    ports: 
      - "3000:3000" 
    depends_on: 
      - backend 
    environment: 
      REACT_APP_API_URL: http://backend:8081 
volumes: 
  mysql_data: 
``` 
 
**4. Run Docker Compose** 
```bash 
docker-compose up -d 
``` 
 
### Traditional Deployment 
 
**Backend JAR Deployment** 
```bash 
cd BackEnd 
./mvnw clean package 
java -jar target/*.jar 
``` 
 
**Frontend Build** 
```bash 
cd FrontEnd 
npm run build 
npx serve -s build 
``` 
 
--- 
 
## ?? Testing 
 
### Backend Tests 
```bash 
cd BackEnd 
./mvnw test 
``` 
 
### Frontend Tests 
```bash 
cd FrontEnd 
npm test 
``` 
 
--- 
 
## ?? Contributing 
 
1. **Fork the repository** 
2. **Create a feature branch** 
   ```bash 
   git checkout -b feature/YourFeature 
   ``` 
3. **Commit your changes** 
   ```bash 
   git commit -m "Add your feature" 
   ``` 
4. **Push to the branch** 
   ```bash 
   git push origin feature/YourFeature 
   ``` 
5. **Open a Pull Request** 
 
--- 
 
## ?? License 
 
This project is licensed under the MIT License - see the LICENSE file for details. 
 
--- 
 
## ?? Contact 
 
- **GitHub**: [SRIKANTHBHAGYANAGARAJ](https://github.com/SRIKANTHBHAGYANAGARAJ) 
- **Repository**: [mortgage-io](https://github.com/SRIKANTHBHAGYANAGARAJ/mortgage-io) 
- **Issues**: [Report Issues](https://github.com/SRIKANTHBHAGYANAGARAJ/mortgage-io/issues) 
 
--- 
 
## ?? Acknowledgments 
 
- **Spring Boot** for the robust backend framework 
- **React** for the responsive UI 
- **LangChain4j** for AI integration 
- **OpenAI** for AI capabilities 
- **Power BI** for analytics 
- **Snowflake** for data warehousing 
- **Cloudinary** for image management 
 
--- 
 
## ? Show Your Support 
 
If you find this project useful, please give it a ? on GitHub! 
 
--- 
 
**Built with ?? using Spring Boot, React, and AI** 
 
--- 
 
*Last Updated: July 2026* 
 
