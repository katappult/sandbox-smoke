package com.katappult.cloud.platform.services.custom;

import com.katappult.cloud.platform.dao.api.ICustomAnnonceRepository;
import com.katappult.cloud.platform.generated.dao.api.IAnnonceRepository;
import com.katappult.cloud.platform.generated.dao.api.IProduitRepository;
import com.katappult.cloud.platform.generated.model.Annonce;
import com.katappult.cloud.platform.generated.model.Produit;
import com.katappult.cloud.platform.generated.services.api.IAnnonceService;
import com.katappult.cloud.platform.rest.dto.CreateAnnonceRequest;
import com.katappult.core.exception.BusinessRuleException;
import com.katappult.core.model.UserAccount;
import com.katappult.core.util.KatappultCoreServicesHelper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomAnnonceServiceTest {

    @Mock
    private IAnnonceService annonceService;
    @Mock
    private IAnnonceRepository annonceRepository;
    @Mock
    private IProduitRepository produitRepository;
    @Mock
    private ICustomAnnonceRepository customAnnonceRepository;
    @Mock
    private KatappultCoreServicesHelper coreServicesHelper;

    @InjectMocks
    private CustomAnnonceService customAnnonceService;

    @Test
    void createAnnonce_shouldSetAuthorFromSecurityContext() {
        UserAccount author = new UserAccount();
        author.setUid("user-uid");
        author.setActive(true);
        when(currentUserAccount()).thenReturn(author);

        Produit produit = new Produit();
        produit.setUid("produit-uid");
        when(produitRepository.findByUid("produit-uid")).thenReturn(Optional.of(produit));

        Annonce savedAnnonce = new Annonce();
        savedAnnonce.setUid("annonce-uid");
        savedAnnonce.setTitre("Titre");
        savedAnnonce.setPrix(BigDecimal.TEN);
        savedAnnonce.setActif(true);
        savedAnnonce.setAuthor(author);
        savedAnnonce.setProduit(produit);
        when(annonceService.create(any())).thenReturn(savedAnnonce);

        CreateAnnonceRequest request = new CreateAnnonceRequest("Titre", "Desc", BigDecimal.TEN, true, "produit-uid");
        var result = customAnnonceService.createAnnonce(request);

        assertNotNull(result);
        assertEquals("annonce-uid", result.uid());
        assertEquals("user-uid", result.authorUid());
    }

    @Test
    void createAnnonce_shouldThrowBusinessRuleExceptionForInactiveAccount() {
        UserAccount author = new UserAccount();
        author.setUid("user-uid");
        author.setActive(false);
        when(currentUserAccount()).thenReturn(author);

        CreateAnnonceRequest request = new CreateAnnonceRequest("Titre", "Desc", BigDecimal.TEN, true, "produit-uid");
        assertThrows(BusinessRuleException.class, () -> customAnnonceService.createAnnonce(request));
    }

    private UserAccount currentUserAccount() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        UserAccount user = new UserAccount();
        user.setUid("user-uid");
        user.setActive(true);
        when(authentication.getPrincipal()).thenReturn(user);
        return user;
    }
}
