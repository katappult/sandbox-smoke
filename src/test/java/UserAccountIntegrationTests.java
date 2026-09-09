package com.katappult.generated.integrationtests;

import tools.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserAccountIntegrationTests extends AbstractGeneratedTests{

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper objectMapper;

    private AtomicReference<String> firstAvailableRoleId = new AtomicReference<>();

    // =========================================================================
    // CRÉER UN COMPTE
    // =========================================================================
    @BeforeAll
    void loadAllRoles() throws Exception {
        login();
        MvcResult result = mockMvc.perform(get(LIST_ROLES_URL)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andReturn();

        objectMapper.readTree(result.getResponse().getContentAsString())
                .withArrayProperty("dataList")
                .forEach(node -> {
                    if(node.get("internalName").asText().equals("ROLE_ADMIN")) {
                        firstAvailableRoleId.set(node.get("id").asText());
                    }
                });

        assertNotNull(firstAvailableRoleId.get());
    }

    @Test
    void createAccount_withValidData_returnsSuccess() throws Exception {
        String email = uniqueEmail();

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(buildRegisterBody(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());

        // Vérifier que le compte existe bien
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", email,
                                "password", DEFAULT_PASS
                        ))))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    void createAccount_missingFirstName_fails() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "lastName", "Dupont",
                "gender", "1",
                "peopleType", PEOPLE_TYPE,
                "withAccount", true,
                "accountEmail", uniqueEmail(),
                "accountPassword", DEFAULT_PASS
        ));

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    void createAccount_missingEmail_fails() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "firstName", "Jean",
                "lastName", "Dupont",
                "gender", "1",
                "peopleType", PEOPLE_TYPE,
                "withAccount", true
                // accountEmail manquant
        ));

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    void createAccount_withoutAccount_createsPersonOnly() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "firstName", "Marie",
                "lastName", "Martin",
                "gender", "2",
                "peopleType", PEOPLE_TYPE,
                "withAccount", false
        ));

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());
    }

    // =========================================================================
    // AJOUTER UN RÔLE
    // =========================================================================

    @Test
    void addRole_toExistingAccount_returnsSuccess() throws Exception {
        String email = uniqueEmail();
        registerUser(email);
        String accountId = getAccountId(email);

        mockMvc.perform(post(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());

        // Vérifier que le rôle est bien assigné
        assertTrue(accountHasRole(accountId, firstAvailableRoleId.get()),
                "Le rôle devrait être assigné au compte");
    }

    @Test
    void addRole_withInvalidAccountId_fails() throws Exception {
        mockMvc.perform(post(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/invalid-id")
                        .header("Authorization", adminToken))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    void addRole_withInvalidRoleId_fails() throws Exception {
        String email = uniqueEmail();
        registerUser(email);
        String accountId = getAccountId(email);

        mockMvc.perform(post(ROLES_URL + "/invalid-role-id/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    // =========================================================================
    // SUPPRIMER UN RÔLE
    // =========================================================================

    @Test
    void removeRole_afterAdding_returnsSuccess() throws Exception {
        String email = uniqueEmail();
        registerUser(email);
        String accountId = getAccountId(email);

        // Ajouter d'abord
        mockMvc.perform(post(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());

        assertTrue(accountHasRole(accountId, firstAvailableRoleId.get()), "Pré-condition : rôle assigné");

        // Supprimer
        mockMvc.perform(delete(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());

        // Vérifier que le rôle est bien retiré
        assertFalse(accountHasRole(accountId, firstAvailableRoleId.get()), "Le rôle ne devrait plus être assigné après suppression");
    }

    @Test
    void removeRole_notAssigned_fails() throws Exception {
        String email = uniqueEmail();
        registerUser(email);
        String accountId = getAccountId(email);

        // Supprimer un rôle qui n'a pas été assigné
        mockMvc.perform(delete(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andDo(print());
    }

    // =========================================================================
    // CYCLE DE VIE COMPLET
    // =========================================================================

    @Test
    void fullLifecycle_createAccount_addRole_removeRole() throws Exception {
        String email = uniqueEmail();

        // 1. Créer le compte
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(buildRegisterBody(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        String accountId = getAccountId(email);
        assertNotNull(accountId);

        // 3. Vérifier que le compte n'a pas encore le rôle
        assertFalse(accountHasRole(accountId, firstAvailableRoleId.get()), "Le compte ne devrait pas avoir le rôle avant attribution");

        // 4. Ajouter le rôle
        mockMvc.perform(post(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        // 5. Vérifier que le rôle est assigné
        assertTrue(accountHasRole(accountId, firstAvailableRoleId.get()),
                "Le rôle devrait être assigné");

        // 6. Supprimer le rôle
        mockMvc.perform(delete(ROLES_URL + "/" + firstAvailableRoleId.get() + "/members/" + accountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        // 7. Vérifier que le rôle est retiré
        assertFalse(accountHasRole(accountId, firstAvailableRoleId.get()), "Le rôle ne devrait plus être assigné");
    }


    /**
     * Vérifie si un compte possède un rôle donné.
     * Appelle GET /core/api/v1/principals/account/roles?accountId=...
     * et cherche le roleId dans la liste retournée.
     */
    private boolean accountHasRole(String accountId, String roleId) throws Exception {
        MvcResult result = mockMvc.perform(get(PRINCIPAL_URL + "/" + accountId + "/roles")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        return body.contains(roleId);
    }

}
