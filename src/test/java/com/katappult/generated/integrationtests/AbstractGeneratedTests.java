package com.katappult.generated.integrationtests;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import com.katappult.cloud.platform.generated.GeneratedMainApplication;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {GeneratedMainApplication.class})
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestPropertySource(value = {
        "classpath:/application.properties",
        "classpath:/env/test/application.properties"}
)
public abstract class AbstractGeneratedTests {

    protected static final String TEST_USERNAME = "admin@nexitia.com";
    protected static final String TEST_PASSWORD = "epadmin";
    protected static final String DEFAULT_PASS = "password123";
    protected static final String LOGIN_URL = "/core/api/pub/v1/security/auth/login";
    protected static final String REGISTER_URL = "/core/api/pub/v1/person/register";
    protected static final String ME_URL = "/core/api/v1/security/auth/me";
    protected static final String ROLES_URL = "/core/api/v1/admin/roles";
    protected static final String LIST_ROLES_URL = "/core/api/v1/admin/roles";
    protected static final String PEOPLE_TYPE = "com.katappult.people.Party/Person";
    protected static final String PRINCIPAL_URL = "/core/api/v1/principals/account";

    /**
     * Compte client partagé par toute la suite de tests (aucun rôle admin).
     * Fixe (et non {@link #uniqueEmail()}) pour être créé une seule fois et
     * réutilisé (login) par toutes les classes de test qui appellent {@link #login()}.
     */
    protected static final String CLIENT_USERNAME = "client@katappult.ai";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected JsonMapper objectMapper;

    // ID du rôle ROLE_USER dans le système
    protected final AtomicReference<String> readerRoleId = new AtomicReference<>();

    /** Token admin (ROLE_SUPERADMIN) — à utiliser pour toutes les actions admin. */
    protected String adminToken;

    /** Token d'un utilisateur sans rôle admin — à utiliser pour toutes les actions client. */
    protected String clientToken;

    void login() throws Exception {
        adminToken = login(TEST_USERNAME, TEST_PASSWORD);
        assertNotNull(adminToken, "JWT token introuvable dans la réponse de login");

        // 2. Trouver l'id de ROLE_USER
        MvcResult rolesResult = mockMvc.perform(get(LIST_ROLES_URL)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andReturn();

        objectMapper.readTree(rolesResult.getResponse().getContentAsString())
                .withArrayProperty("dataList")
                .forEach(node -> {
                    JsonNode internalNameNode = node.get("internalName");
                    if (internalNameNode != null && "ROLE_USER".equals(internalNameNode.asText())) {
                        readerRoleId.set(node.get("uid").asText());
                    }
                });
        assertNotNull(readerRoleId.get(), "ROLE_USER introuvable dans le système");

        clientToken = ensureClientToken();
        assertNotNull(clientToken, "Token client introuvable");
    }

    /**
     * Crée le compte client partagé s'il n'existe pas encore (idempotent — le contexte Spring,
     * et donc la base H2, est réutilisé entre les classes de test), puis retourne son JWT.
     */
    private String ensureClientToken() throws Exception {
        MvcResult attempt = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", CLIENT_USERNAME,
                                "password", DEFAULT_PASS))))
                .andReturn();

        if (attempt.getResponse().getStatus() != 200) {
            registerUser(CLIENT_USERNAME);
        }
        return login(CLIENT_USERNAME, DEFAULT_PASS);
    }

    protected String login(String username, String password) throws Exception {
        Map<String, String> credentials = Map.of(
                "username", username,
                "password", password
        );

        MvcResult result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("attributes").get("token").asText();
    }

    protected int randomInt() {
        return new Random().nextInt(10) + 1;
    }

    protected String randomString() {
        return RandomStringUtils.randomAlphabetic(40);
    }


    // =========================================================================
    // HELPERS
    // =========================================================================

    void registerUser(String email) throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(buildRegisterBody(email)))
                .andExpect(status().isOk());
    }

    String getAccountId(String email) throws Exception {
        String token = login(email, DEFAULT_PASS);
        MvcResult result = mockMvc.perform(get(ME_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountUid").exists())
                .andReturn();

        String accountId = objectMapper.readTree(result.getResponse().getContentAsString()).get("accountUid").asText();
        assertNotNull(accountId);
        return accountId;
    }

    String buildRegisterBody(String email) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "firstName", "Test",
                "lastName", "User",
                "gender", "1",
                "peopleType", PEOPLE_TYPE,
                "withAccount", true,
                "accountEmail", email,
                "accountPassword", DEFAULT_PASS
        ));
    }
    /**
     * Email unique pour éviter les collisions entre tests
     */
    protected String uniqueEmail() {
        return "test-" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    }
}
