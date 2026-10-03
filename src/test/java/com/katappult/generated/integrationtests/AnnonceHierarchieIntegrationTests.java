package com.katappult.generated.integrationtests;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Assertions;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies the consistency of the Annonce -> Produit -> Categorie hierarchy.
 *
 * Relation field names are read from the generated model:
 *  - Annonce.produit   (@ManyToOne, getProduit)
 *  - Produit.categorie (@ManyToOne, getCategorie)
 *  - Produit.annonces  (@OneToMany, mappedBy "produit")
 * The Categorie -> Produit reverse listing is exposed by the generated facade as
 * GET /categorie/{uid}/oneToManyProduit (CategorieGeneratedServiceFacade).
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Annonce -> Produit -> Categorie hierarchy integration tests")
class AnnonceHierarchieIntegrationTests extends AbstractGeneratedTests {

    private static final String API = "/api/v1";
    private static final String CATEGORIE_URL = API + "/categorie";
    private static final String PRODUIT_URL = API + "/produit";
    private static final String ANNONCE_URL = API + "/annonce";

    private String categorieUid;
    private String produitUid;
    private String annonceUid;

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

        Map<String, Object> annonce = new HashMap<>();
        annonce.put("titre", randomString());
        annonce.put("description", randomString());
        annonce.put("produit", Map.of("uid", produitUid));
        annonceUid = createEntity(ANNONCE_URL, annonce);
    }

    @Test
    @Order(1)
    @DisplayName("Annonce exposes its Produit, Produit exposes its Categorie, creator is auto-assigned")
    void annonce_produit_categorie_relationsCoherent() throws Exception {
        String annonceJson = getJson(ANNONCE_URL + "/" + annonceUid);
        Assertions.assertTrue(annonceJson.contains(produitUid),
                "The Annonce must expose the uid of its Produit");
        Assertions.assertTrue(annonceJson.contains("creator"),
                "The Annonce must expose its auto-assigned creator");

        String produitJson = getJson(PRODUIT_URL + "/" + produitUid);
        Assertions.assertTrue(produitJson.contains(categorieUid),
                "The Produit must expose the uid of its Categorie");
    }

    @Test
    @Order(2)
    @DisplayName("Categorie lists its Produits (reverse oneToMany)")
    void categorie_listsItsProduits() throws Exception {
        String produitsJson = getJson(CATEGORIE_URL + "/" + categorieUid + "/oneToManyProduit");
        Assertions.assertTrue(produitsJson.contains(produitUid),
                "The Categorie must list its related produits");
    }

    private String getJson(String url) throws Exception {
        return mockMvc.perform(get(url).header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
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
