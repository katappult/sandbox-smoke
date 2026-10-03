package com.katappult.cloud.platform.tests.integrationtests;

import com.katappult.generated.integrationtests.AbstractGeneratedTests;
import org.junit.jupiter.api.*;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("CustomAnnonceServiceFacade integration tests")
public class CustomAnnonceServiceFacade_integration_Tests extends AbstractGeneratedTests {

    @BeforeAll
    void setup() throws Exception {
        login();
    }

    @Test
    @Order(1)
    void validate_should_return_401_without_token() throws Exception {
        mockMvc.perform(post("/annonce/test-uid/validate"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void refuse_should_return_401_without_token() throws Exception {
        mockMvc.perform(post("/annonce/test-uid/refuse"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(3)
    void mine_should_return_401_without_token() throws Exception {
        mockMvc.perform(get("/annonce/mine"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    void mine_should_return_200_when_authenticated() throws Exception {
        mockMvc.perform(get("/annonce/mine")
                        .header("Authorization", clientToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
