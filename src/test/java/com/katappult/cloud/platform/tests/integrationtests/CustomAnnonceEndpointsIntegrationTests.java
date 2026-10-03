package com.katappult.cloud.platform.tests.integrationtests;

import com.katappult.generated.integrationtests.AbstractGeneratedTests;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CustomAnnonceEndpointsIntegrationTests extends AbstractGeneratedTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @Order(1)
    void createWithoutToken_shouldReturn401() throws Exception {
        mockMvc.perform(post("/api/v1/annonce/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"titre\": \"Test\", \"prix\": 10, \"actif\": true, \"produitUid\": \"p1\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void publicListWithoutToken_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/pub/v1/annonce?page=0&pageSize=10"))
                .andExpect(status().isOk());
    }
}
