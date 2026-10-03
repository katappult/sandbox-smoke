package com.katappult.generated.integrationtests;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Assertions;
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
 * Exercises the moderation workflow of an Annonce: a client creates an annonce (initial state
 * EN_ATTENTE), an admin validates or refuses it (POST /annonce/{uid}/validate | /refuse),
 * and the resulting state is visible on the annonce.
 *
 * State names come from changelogs/migrations/20250101000000-annonce-lifecycle.xml:
 * initialState = EN_ATTENTE, states = EN_ATTENTE / VALIDEE / REFUSEE.
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Annonce moderation workflow integration tests")
class AnnonceModerationIntegrationTests extends AbstractGeneratedTests {

    private static final String API = "/api/v1";
    private static final String ANNONCE_URL = API + "/annonce";
    private static final String INITIAL_STATE = "EN_ATTENTE";
    private static final String VALIDATED_STATE = "VALIDEE";
    private static final String REFUSED_STATE = "REFUSEE";

    @BeforeAll
    void setup() throws Exception {
        login();
    }

    @Test
    @Order(1)
    @DisplayName("client creates an annonce, admin validates it, VALIDEE is visible")
    void fullModerationWorkflow_clientCreates_adminValidates_statusVisible() throws Exception {
        String annonceUid = createAnnonceAsClient();

        Assertions.assertTrue(loadAnnonce(annonceUid).contains(INITIAL_STATE),
                "A freshly created annonce must be in the " + INITIAL_STATE + " state");

        changeState(annonceUid, "validate");

        Assertions.assertTrue(loadAnnonce(annonceUid).contains(VALIDATED_STATE),
                "The annonce must be " + VALIDATED_STATE + " after the admin validation");
    }

    @Test
    @Order(2)
    @DisplayName("client creates an annonce, admin refuses it, REFUSEE is visible")
    void fullModerationWorkflow_clientCreates_adminRefuses_statusVisible() throws Exception {
        String annonceUid = createAnnonceAsClient();

        changeState(annonceUid, "refuse");

        Assertions.assertTrue(loadAnnonce(annonceUid).contains(REFUSED_STATE),
                "The annonce must be " + REFUSED_STATE + " after the admin refusal");
    }

    @Test
    @Order(3)
    @Disabled("Blocked: the PRE_CREATE account-activity rule is an empty stub "
            + "(rules/AnnonceCreationRule.java) and no account deactivation path is available here. "
            + "Documented scenario: deactivate an account, authenticate as it, POST /api/v1/annonce "
            + "must be rejected by the business rule. Enable once the rule exists.")
    @DisplayName("an inactive account cannot create an annonce")
    void inactiveAccount_cannotCreateAnnonce() throws Exception {
        // Intentionally empty: see the @Disabled reason above.
    }

    private String createAnnonceAsClient() throws Exception {
        String response = mockMvc.perform(post(ANNONCE_URL)
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "titre", randomString(),
                                "description", randomString()))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return extractUid(response);
    }

    private void changeState(String annonceUid, String action) throws Exception {
        mockMvc.perform(post(ANNONCE_URL + "/" + annonceUid + "/" + action)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    private String loadAnnonce(String annonceUid) throws Exception {
        return mockMvc.perform(get(ANNONCE_URL + "/" + annonceUid)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
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
