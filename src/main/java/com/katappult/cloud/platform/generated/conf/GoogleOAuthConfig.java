package com.katappult.cloud.platform.generated.conf;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

/**
 * Vérificateur d'ID token Google (flux Google Identity Services côté frontend).
 * L'audience acceptée = le client OAuth configuré via {@code google.oauth.client.id}
 * (défaut dev dans env/dev, {@code GOOGLE_OAUTH_CLIENT_ID} en prod).
 */
@Configuration
public class GoogleOAuthConfig {

    @Bean
    public GoogleIdTokenVerifier googleIdTokenVerifier(
            @Value("${google.oauth.client.id}") String clientId) {
        return new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }
}
