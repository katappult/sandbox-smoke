package com.katappult.generated.integrationtests;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Locks down access control of the catalogue endpoints (Categorie / Produit):
 * 401 without a token, 403 when a ROLE_USER tries to set featured / active, 200 for an admin.
 *
 * Endpoints are read from the generated facades, whose class-level @RequestMapping has no
 * prefix: the "/api/v1" prefix comes from the application (frontend/services/utils/service.factory.js
 * builds `${API_ROOT}/api/v1/${apiPath}`).
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Catalogue (Categorie / Produit) security integration tests")
class CatalogueSecurityIntegrationTests extends AbstractGeneratedTests {

    private static final String API = "/api/v1";
    private static final String CATEGORIE_URL = API + "/categorie";
    private static final String PRODUIT_URL = API + "/produit";
    private static final String UNKNOWN_UID = "00000000-0000-0000-0000-000000000000";

    private String categorieUid;
    private String produitUid;

    @BeforeAll
    void setup() throws Exception {
        login();

        categorieUid = createEntity(CATEGORIE_URL, Map.of(
                "titre", randomString(),
                "description", randomString()));

        Map<String, Object> produit = new HashMap<>();
        produit.put("titre", randomString());
        produit.put("description", randomString());
        produit.put("categorie", Map.of("uid", categorieUid));
        produitUid = createEntity(PRODUIT_URL, produit);
    }

    @Test
    @Order(1)
    @DisplayName("GET categorie without token returns 401")
    void getCategorie_withoutToken_returns401() throws Exception {
        mockMvc.perform(get(CATEGORIE_URL + "/" + UNKNOWN_UID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    @DisplayName("GET produit without token returns 401")
    void getProduit_withoutToken_returns401() throws Exception {
        mockMvc.perform(get(PRODUIT_URL + "/" + UNKNOWN_UID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    @DisplayName("POST produit without token returns 401")
    void createProduit_withoutToken_returns401() throws Exception {
        mockMvc.perform(post(PRODUIT_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("titre", randomString()))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    @DisplayName("POST categorie without token returns 401")
    void createCategorie_withoutToken_returns401() throws Exception {
        mockMvc.perform(post(CATEGORIE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("titre", randomString()))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    @DisplayName("ROLE_USER setting featured on produit returns 403")
    void clientSetFeatured_onProduit_returns403() throws Exception {
        mockMvc.perform(patch(PRODUIT_URL + "/" + produitUid)
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("featured", true))))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(6)
    @DisplayName("ROLE_USER setting active on produit returns 403")
    void clientSetActive_onProduit_returns403() throws Exception {
        mockMvc.perform(patch(PRODUIT_URL + "/" + produitUid)
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", true))))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(7)
    @DisplayName("ROLE_USER setting featured on categorie returns 403")
    void clientSetFeatured_onCategorie_returns403() throws Exception {
        mockMvc.perform(patch(CATEGORIE_URL + "/" + categorieUid)
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("featured", true))))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(8)
    @DisplayName("ROLE_USER setting active on categorie returns 403")
    void clientSetActive_onCategorie_returns403() throws Exception {
        mockMvc.perform(patch(CATEGORIE_URL + "/" + categorieUid)
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", true))))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(9)
    @DisplayName("ROLE_ADMIN setting featured on produit returns 200")
    void adminSetFeatured_onProduit_returns200() throws Exception {
        mockMvc.perform(patch(PRODUIT_URL + "/" + produitUid)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("featured", true))))
                .andExpect(status().isOk());
    }

    @Test
    @Order(10)
    @DisplayName("featured is readable back after the admin update")
    void featured_isVisibleInRead() throws Exception {
        mockMvc.perform(get(PRODUIT_URL + "/" + produitUid)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("featured")));
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
