package com.katappult.generated.integrationtests;

import com.katappult.cloud.platform.generated.model.queryspec.ProduitQuerySpec;
import com.katappult.cloud.platform.generated.model.rest.ProduitRestRequest;
import com.katappult.core.rest.model.DeleteRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProduitIntegrationTests extends AbstractGeneratedTests{

    private static final String ROOT_URL = "/api/v1/produit";

    private String createdProduitId;

    @Override
    @BeforeAll
    void login() throws Exception {
        super.login();
        // Créer une entity de référence pour les tests suivants
        MvcResult createResult = mockMvc.perform(post(ROOT_URL)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uid").exists())
                .andReturn();

        createdProduitId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("uid").asText();
        assertNotNull(createdProduitId);
    }

    // -------------------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------------------

    @Test
    void createElement() throws Exception {
        mockMvc.perform(post(ROOT_URL)
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.uid").exists())
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // DETAILS
    // -------------------------------------------------------------------------

    @Test
    void getDetails() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/" + createdProduitId)
                        .header("Authorization",  adminToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.uid").value(createdProduitId))
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------

    @Test
    void updateElement() throws Exception {
        ProduitRestRequest updated = buildRequest();

        mockMvc.perform(put(ROOT_URL + "/" + createdProduitId)
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.uid").value(createdProduitId))
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------------------

    @Test
    void deleteElement() throws Exception {
        // créer une entity dédiée à ce test pour ne pas impacter les autres
        MvcResult result = mockMvc.perform(post(ROOT_URL)
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isOk())
                .andReturn();
        String idToDelete = objectMapper.readTree(result.getResponse().getContentAsString()).get("uid").asText();

        mockMvc.perform(get(ROOT_URL + "/" + idToDelete)
                        .header("Authorization",  adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(delete(ROOT_URL + "/" + idToDelete)
                        .header("Authorization",  adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());

        mockMvc.perform(get(ROOT_URL + "/" + idToDelete)
                        .header("Authorization",  adminToken))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------------------------
    // DELETE MULTIPLE
    // -------------------------------------------------------------------------

    @Test
    void deleteMultipleElements() throws Exception {
        MvcResult r1 = mockMvc.perform(post(ROOT_URL)
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isOk()).andReturn();

        MvcResult r2 = mockMvc.perform(post(ROOT_URL)
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isOk()).andReturn();

        DeleteRequest deleteRequest = new DeleteRequest();
        deleteRequest.getIdentifiers().add(objectMapper.readTree(r1.getResponse().getContentAsString()).get("id").asText());
        deleteRequest.getIdentifiers().add(objectMapper.readTree(r2.getResponse().getContentAsString()).get("id").asText());

        mockMvc.perform(delete(ROOT_URL + "/deleteElements")
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deleteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // LIST
    // -------------------------------------------------------------------------

    @Test
    void listElements() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/list")
                        .header("Authorization",  adminToken)
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andDo(print());
    }

    @Test
    void listElementsWithSearchTerm() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/list")
                        .header("Authorization",  adminToken)
                        .param("page", "0")
                        .param("pageSize", "10")
                        .param("searchTerm", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andDo(print());
    }

    @Test
    void listElementsWithSort() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/list")
                        .header("Authorization",  adminToken)
                        .param("page", "0")
                        .param("pageSize", "10")
                        .param("sort", "-persistenceInfo.createDate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // LIST FROM IDENTIFIERS
    // -------------------------------------------------------------------------

    @Test
    void listFromUids() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/listFromUids")
                        .header("Authorization",  adminToken)
                        .param("identifier", createdProduitId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andExpect(jsonPath("$.dataList", hasSize(greaterThanOrEqualTo(1))))
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // SEARCH (GET)
    // -------------------------------------------------------------------------

    @Test
    void searchByTerm() throws Exception {
        mockMvc.perform(get(ROOT_URL + "/search")
                        .header("Authorization",  adminToken)
                        .param("searchTerm", "test")
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // ADVANCED SEARCH (POST)
    // -------------------------------------------------------------------------

    @Test
    void advancedSearchEmpty() throws Exception {
        mockMvc.perform(post(ROOT_URL + "/advanced_search")
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProduitQuerySpec())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andDo(print());
    }

    @Test
    void advancedSearchWithCriteria() throws Exception {
        ProduitQuerySpec querySpec = new ProduitQuerySpec();
        querySpec.setSearchPage(0);
        querySpec.setSearchPageSize(10);

        mockMvc.perform(post(ROOT_URL + "/advanced_search")
                        .header("Authorization",  adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(querySpec)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.dataList").isArray())
                .andDo(print());
    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    private ProduitRestRequest buildRequest() {
        ProduitRestRequest request = new ProduitRestRequest();
        request.setTitre(randomString());
    request.setDescription(randomString());
    request.setPrix(randomInt());
    
        request.getParams().put("businessType", "com.katappult.online.types.ProduitType");
        return request;
    }
}
