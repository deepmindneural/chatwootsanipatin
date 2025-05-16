package com.chatwoot.configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeStrategies;

@Configuration
public class ClienteHttpConfig {

    @Value("${chatwoot.url}")
    private String chatwootUrl;
    
    @Value("${chatwoot.api.key}")
    private String chatwootApiKey;

    @Bean
    public WebClient chatwootWebClient() {
        return WebClient.builder()
            .baseUrl(chatwootUrl)
            .defaultHeader("api_access_token", chatwootApiKey)
            .defaultHeader("Content-Type", "application/json")
            .exchangeStrategies(ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build())
            .build();
    }
    
    @Bean
    public WebClient whatsappWebClient(@Value("${whatsapp.360dialog.api.key:}") String apiKey360Dialog) {
        return WebClient.builder()
            .defaultHeader("D360-API-KEY", apiKey360Dialog)
            .defaultHeader("Content-Type", "application/json")
            .build();
    }
}
