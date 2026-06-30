package hobbiebackend.service.ai;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatbotService {

    private final Map<String, String> intentResponses = new HashMap<>();
    private final Map<String, List<String>> intentSuggestions = new HashMap<>();

    public ChatbotService() {
        initializeResponses();
        initializeSuggestions();
    }

    private void initializeResponses() {
        intentResponses.put("greeting", "👋 Hello! I'm your mortgage assistant. How can I help you today?");
        intentResponses.put("help", "I can help you with:\n• Mortgage calculations\n• Application status\n• Loan recommendations\n• Interest rates\n• Credit score tips\n• Down payment advice\n• Refinancing options");
        intentResponses.put("calculator", "📊 You can use our mortgage calculator at /calculator. It will show you monthly payments, total interest, and more. Just enter property price, down payment, interest rate, and loan term.");
        intentResponses.put("application", "📋 To apply for a mortgage, go to /apply. You'll need:\n• Personal info (name, email, phone)\n• Property details (price, address, type)\n• Financial information (income, debt, credit score)");
        intentResponses.put("rates", "💰 Current average mortgage rates are around 6.75% for a 30-year fixed. Rates vary by lender and your financial profile. A higher credit score usually gets better rates.");
        intentResponses.put("credit", "📈 For the best rates, aim for a credit score above 740. Check your credit report regularly, pay down debt, and avoid opening new accounts before applying.");
        intentResponses.put("downpayment", "🏠 A 20% down payment helps avoid PMI. Some programs allow as little as 3% down for first-time buyers. FHA loans can go as low as 3.5%.");
        intentResponses.put("refinance", "🔄 Refinancing can lower your rate or change your loan term. Check current rates and calculate your break-even point before deciding.");
        intentResponses.put("global", "🌍 Our global analytics shows mortgage rates across major lenders. Check out the Global Analytics page for competitor comparisons and market trends.");
        intentResponses.put("prediction", "🤖 Our AI prediction analyzes your financial profile and gives you approval probability. Submit an application first, then view the prediction on your application detail page.");
        intentResponses.put("default", "I'm not sure about that. Please ask about:\n• Mortgage rates\n• Applications\n• Calculators\n• Credit scores\n• Down payments\n• Global analytics\n• AI predictions");
    }

    private void initializeSuggestions() {
        intentSuggestions.put("greeting", Arrays.asList("Calculate my mortgage", "Check rates", "Apply for a loan", "Global analytics"));
        intentSuggestions.put("help", Arrays.asList("Calculate my mortgage", "Check application status", "Get loan recommendations", "What are current rates?"));
        intentSuggestions.put("rates", Arrays.asList("Best mortgage rates", "How to get lower rates", "Rate trends", "Compare lenders"));
        intentSuggestions.put("credit", Arrays.asList("How to improve credit", "What credit score is needed", "Credit score range"));
        intentSuggestions.put("application", Arrays.asList("Start application", "Check status", "Required documents"));
        intentSuggestions.put("default", Arrays.asList("Calculate my mortgage", "Check application status", "Get loan recommendations", "What are current rates?"));
    }

    public Map<String, Object> getResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        String lowerMessage = message.toLowerCase();

        String intent = detectIntent(lowerMessage);
        String reply = intentResponses.getOrDefault(intent, intentResponses.get("default"));
        List<String> suggestions = intentSuggestions.getOrDefault(intent, intentSuggestions.get("default"));

        response.put("message", reply);
        response.put("intent", intent);
        response.put("suggestions", suggestions);

        return response;
    }

    private String detectIntent(String message) {
        if (message.matches(".*(hi|hello|hey|greetings|good morning|good afternoon).*")) return "greeting";
        if (message.matches(".*(help|support|assist|what can you).*")) return "help";
        if (message.matches(".*(calculate|calculator|payment|monthly|mortgage payment).*")) return "calculator";
        if (message.matches(".*(apply|application|submit|applying).*")) return "application";
        if (message.matches(".*(rate|interest|apr|mortgage rate).*")) return "rates";
        if (message.matches(".*(credit|score|fico|credit score).*")) return "credit";
        if (message.matches(".*(down payment|downpayment|pmi|down).*")) return "downpayment";
        if (message.matches(".*(refinance|refi|refinancing).*")) return "refinance";
        if (message.matches(".*(global|analytics|world|competitor).*")) return "global";
        if (message.matches(".*(predict|prediction|prob|approval|chance).*")) return "prediction";
        return "default";
    }
}