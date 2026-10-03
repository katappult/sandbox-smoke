package com.katappult.generated.integrationtests;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AnnonceCustomIntegrationTests extends AbstractGeneratedTests {

    private static String annonceEnAttenteUid;
    private static String annonceValideeUid;
    private static String annonceRefuseeUid;
    private String clientAccountUid;

    @Override
    @BeforeAll
    void login() throws Exception {
        super.login();
        clientAccountUid = getAccountId(CLIENT_USERNAME);

        annonceEnAttenteUid = createAnnonce("Pending", "pending", new BigDecimal("5.00"));
        annonceValideeUid = createAnnonce("Accepted", "accepted", new BigDecimal("6.00"));
        annonceRefuseeUid = createAnnonce("Refused", "refused", new BigDecimal("7.00"));
    }

    @Test
    @Order(0)
    void createAnnonce_withoutAuth_returns401() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("titre", "No auth");
        body.put("description", "no auth");
        body.put("prix", new BigDecimal("1.00"));
        body.put("actif", true);
        body.put("authorUid", "fake-uid");

        mockMvc.perform(post("/api/v1/annonce/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(1)
    void createAnnonce_activeClient_createsInStateNew() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("titre", "Active create");
        body.put("description", "active creation");
        body.put("prix", new BigDecimal("9.99"));
        body.put("actif", true);
        body.put("authorUid", "fake-uid");

        MvcResult result = mockMvc.perform(post("/api/v1/annonce/create")
                        .header("Authorization", "Bearer " + clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.path("data").path("uid").asText()).isNotBlank();
        assertThat(json.path("data").path("lifecycleState").asText()).isEqualTo("NEW");
        assertThat(json.path("data").path("authorUid").asText()).isEqualTo(clientAccountUid);
    }

    @Test
    @Order(2)
    void acceptAnnonce_admin_setsAccepted() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/annonce/{uid}/valider", annonceValideeUid)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.path("data").path("lifecycleState").asText()).isEqualTo("ACCEPTED");
    }

    @Test
    @Order(3)
    void refuseAnnonce_admin_setsRefused() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/annonce/{uid}/refuser", annonceRefuseeUid)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.path("data").path("lifecycleState").asText()).isEqualTo("REFUSED");
    }

    @Test
    @Order(4)
    void moderateAnnonce_withoutAuth_returns401() throws Exception {
        mockMvc.perform(post("/api/v1/annonce/{uid}/valider", annonceEnAttenteUid))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void moderateAnnonce_nonAdmin_returns403() throws Exception {
        mockMvc.perform(post("/api/v1/annonce/{uid}/valider", annonceEnAttenteUid)
                        .header("Authorization", "Bearer " + clientToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(6)
    void publicListing_returnsOnlyAcceptedAnnonces() throws Exception {
        // Sans token
        assertPublicListingContainsAcceptedOnly(null);

        // Avec token
        assertPublicListingContainsAcceptedOnly(adminToken);
    }

    @Test
    @Order(7)
    void createAnnonce_inactiveAccount_isRefused() throws Exception {
        String email = uniqueEmail();
        registerUser(email);
        String accountUid = getAccountId(email);

        mockMvc.perform(post("/core/api/v1/admin/accounts/{uid}/lock", accountUid)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        String inactiveToken = login(email, DEFAULT_PASS);

        Map<String, Object> body = new HashMap<>();
        body.put("titre", "Inactive");
        body.put("description", "inactive");
        body.put("prix", new BigDecimal("1.00"));
        body.put("actif", true);
        body.put("authorUid", "fake-uid");

        mockMvc.perform(post("/api/v1/annonce/create")
                        .header("Authorization", "Bearer " + inactiveToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().is4xxClientError());
    }

    private void assertPublicListingContainsAcceptedOnly(String token) throws Exception {
        var request = get("/api/v1/annonce/validated");
        if (token != null) {
            request.header("Authorization", "Bearer " + token);
        }

        MvcResult result = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        JsonNode data = json.path("data");
        List<String> uids = new ArrayList<>();
        if (data.isArray()) {
            for (JsonNode node : data) {
                uids.add(node.path("uid").asText());
            }
        }

        assertThat(uids).contains(annonceValideeUid);
        assertThat(uids).doesNotContain(annonceRefuseeUid);
        assertThat(uids).doesNotContain(annonceEnAttenteUid);
    }

    private String createAnnonce(String titre, String description, BigDecimal prix) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("titre", titre);
        body.put("description", description);
        body.put("prix", prix);
        body.put("actif", true);
        body.put("authorUid", "fake-uid");

        MvcResult result = mockMvc.perform(post("/api/v1/annonce/create")
                        .header("Authorization", "Bearer " + clientToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.path("data").path("uid").asText();
    }
}
