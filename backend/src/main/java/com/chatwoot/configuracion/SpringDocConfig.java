package com.chatwoot.configuracion;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración para la documentación de la API con SpringDoc (Swagger UI)
 */
@Configuration
public class SpringDocConfig {

    @Value("${springdoc.swagger-ui.server-url:http://localhost:8080}")
    private String serverUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Integración ChatWoot - WhatsApp")
                        .description("API para gestionar la integración entre ChatWoot y WhatsApp Business API a través de 360dialog")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Soporte")
                                .email("soporte@sanipatin.com")
                                .url("https://sanipatin.com"))
                        .license(new License()
                                .name("Licencia Privada")
                                .url("https://sanipatin.com/terminos")))
                .servers(List.of(
                        new Server()
                                .url(serverUrl)
                                .description("Servidor de la API")
                ));
    }
}
