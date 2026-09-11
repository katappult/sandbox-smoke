package com.katappult.generated.integrationtests;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Teste les règles de sécurité (@PreAuthorize) de ProduitGeneratedServiceFacade
 * avec de vrais utilisateurs et de vrais tokens JWT.
 *
 * Scénarios :
 *  - utilisateur sans rôle         → 403 Forbidden sur tous les endpoints
 *  - utilisateur avec ROLE_READER  → accès aux endpoints en lecture (list, details, search)
 *  - admin (ROLE_SUPERADMIN)       → accès complet
 */
class ProduitSecurityTests extends AbstractGeneratedTests {

    private static final String ROOT = "produit";

    // Token d'un utilisateur sans aucun rôle
    private String unauthorizedToken;

    // Token d'un utilisateur avec ROLE_READER
    private String readerToken;

    // ID du compte reader (pour ajouter/retirer le rôle dans les tests de cycle)
    private String readerAccountId;
    private String readerEmail;

    // =========================================================================
    // Setup
    // =========================================================================

    @BeforeAll
    @Override
    void login() throws Exception {
        // 1. Login admin
        super.login();

        // 3. Créer un utilisateur sans aucun rôle
        String unauthorizedEmail = uniqueEmail();
        registerUser(unauthorizedEmail);
        unauthorizedToken = login(unauthorizedEmail, DEFAULT_PASS);
        assertNotNull(unauthorizedToken, "Token utilisateur non-autorisé introuvable");

        // 4. Créer un utilisateur et lui assigner ROLE_READER
        readerEmail = uniqueEmail();
        registerUser(readerEmail);
        readerAccountId = getAccountId(readerEmail);

        mockMvc.perform(post(ROLES_URL + "/" + readerRoleId.get() + "/members/" + readerAccountId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        // Re-login pour obtenir un token avec le rôle pris en compte
        readerToken = login(readerEmail, DEFAULT_PASS);
        assertNotNull(readerToken, "Token utilisateur reader introuvable");
    }

    // =========================================================================
    // Sans authentification → 511
    // =========================================================================

    @Test
    void list_withoutAuth_returns401() throws Exception {
        mockMvc.perform(get(ROOT + "/list"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @Test
    void create_withoutAuth_returns401() throws Exception {
        mockMvc.perform(post(ROOT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @Test
    void advancedSearch_withoutAuth_returns401() throws Exception {
        mockMvc.perform(post(ROOT + "/advanced_search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    // =========================================================================
    // Utilisateur sans rôle → 403
    // =========================================================================

    @Test
    void list_withUnauthorizedUser_returns403() throws Exception {
        mockMvc.perform(get(ROOT + "/list")
                        .header("Authorization", unauthorizedToken))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void create_withUnauthorizedUser_returns403() throws Exception {
        mockMvc.perform(post(ROOT)
                        .header("Authorization", unauthorizedToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void details_with_fake_id_returns400() throws Exception {
        mockMvc.perform(get(ROOT + "/fake")
                        .header("Authorization", unauthorizedToken))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    void update_with_fake_id_returns400() throws Exception {
        mockMvc.perform(put(ROOT + "/fake")
                        .header("Authorization", unauthorizedToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().is4xxClientError())
                .andDo(print());
    }

    @Test
    void advancedSearch_withUnauthorizedUser_returns403() throws Exception {
        mockMvc.perform(post(ROOT + "/advanced_search")
                        .header("Authorization", unauthorizedToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void search_withUnauthorizedUser_returns403() throws Exception {
        mockMvc.perform(get(ROOT + "/search")
                        .header("Authorization", unauthorizedToken)
                        .param("searchTerm", "x"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    // =========================================================================
    // Utilisateur avec ROLE_READER → accès en lecture autorisé
    // =========================================================================

    @Test
    void list_withReaderRole_is_not_Allowed() throws Exception {
        mockMvc.perform(get(ROOT + "/list")
                        .header("Authorization", readerToken)
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void advancedSearch_withReaderRole_is_not_Allowed() throws Exception {
        mockMvc.perform(post(ROOT + "/advanced_search")
                        .header("Authorization", readerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    @Test
    void search_withReaderRole_is_not_Allowed() throws Exception {
        mockMvc.perform(get(ROOT + "/search")
                        .header("Authorization", readerToken)
                        .param("searchTerm", "test"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andDo(print());
    }

    @Test
    void create_withReaderRole_isForbidden() throws Exception {
        // ROLE_READER ne doit pas permettre la création
        mockMvc.perform(post(ROOT)
                        .header("Authorization", readerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andDo(print());
    }

    // =========================================================================
    // Admin (ROLE_SUPERADMIN) → accès complet
    // =========================================================================

    @Test
    void list_withAdmin_isAllowed() throws Exception {
        mockMvc.perform(get(ROOT + "/list")
                        .header("Authorization", adminToken)
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());
    }

    @Test
    void advancedSearch_withAdmin_isAllowed() throws Exception {
        mockMvc.perform(post(ROOT + "/advanced_search")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andDo(print());
    }

    @Test
    void cycleAddRemoveRole_accessChangesAccordingly() throws Exception {
        mockMvc.perform(get(ROOT + "/list")
                        .header("Authorization", readerToken)
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isForbidden());
    }
}
