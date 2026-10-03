package com.katappult.generated.integrationtests;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Locks down access control of the Annonce endpoints:
 * 401 without a token, 403 when a ROLE_USER triggers a moderation action.
 *
 * The moderation routes are the ones exposed by the custom facade
 * (CustomAnnonceServiceFacade): POST /annonce/{uid}/validate and POST /annonce/{uid}/refuse,
 * both guarded by the class-level @PreAuthorize (ADMIN_ENTITY_ANNONCE / UPDATE_ANNONCE / ROLE_SUPERADMIN).
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Annonce security integration tests")
class AnnonceSecurityIntegrationTests extends AbstractGeneratedTests {

    private static final String API = "/api/v1";
    private static final String ANNONCE_URL = API + "/annonce";
    private static final String UNKNOWN_UID = "00000000-0000-0000-0000-000000000000";

    private String annonceUid;

    @BeforeAll
    void setup() throws Exception {
        login();
        annonceUid = createEntity(ANNONCE_URL, Map.of(
                "titre", randomString(),
                "description", randomString()));
    }

    @Test
    @Order(1)
    @DisplayName("GET annonce without token returns 401")
    void getAnnonce_withoutToken_returns401() throws Exception {
        mockMvc.perform(get(ANNONCE_URL + "/" + UNKNOWN_UID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    @DisplayName("POST annonce without token returns 401")
    void createAnnonce_withoutToken_returns401() throws Exception {
        mockMvc.perform(post(ANNONCE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("titre", randomString()))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("ROLE_USER validating an annonce returns 403")
    void clientChangeState_validate_returns403() throws Exception {
        mockMvc.perform(post(ANNONCE_URL + "/" + annonceUid + "/validate")
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    @DisplayName("ROLE_USER refusing an annonce returns 403")
    void clientChangeState_refuse_returns403() throws Exception {
        mockMvc.perform(post(ANNONCE_URL + "/" + annonceUid + "/refuse")
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(5)
    @Disabled("Blocked: no annonce-ownership business rule exists in the workspace "
            + "(rules/AnnonceTransitionsRule.java and rules/ModerationAccessRule.java are empty stubs). "
            + "Documented scenario: client A creates an annonce, client B PATCHes /api/v1/annonce/{uidA} "
            + "and must get 403. Enable once the ownership rule is implemented and committed.")
    @DisplayName("ROLE_USER updating another user's annonce returns 403")
    void clientUpdateOtherUsersAnnonce_returns403() throws Exception {
        // Intentionally empty: see the @Disabled reason above.
    }

    private String createEntity(String url, Map<String, Object> body) throws Exception {
        String response = mockMvc.perform(post(url)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return extractUid(response);
    }

    private String extractUid(String response) throws Exception {
        JsonNode uid = findUid(objectMapper.readTree(response));
        if (uid == null) {
            throw new IllegalStateException("No uid found in create response: " + response);
        }
        return uid.asText();
    }

    private JsonNode findUid(JsonNode node) {
        if (node.isObject() && node.hasNonNull("uid") && !node.get("uid").asText().isBlank()) {
            return node.get("uid");
        }
        for (JsonNode child : node) {
            JsonNode found = findUid(child);
            if (found != null) {
                return found;
            }
        }
        return null;
    }
}
