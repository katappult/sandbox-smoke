package com.katappult.cloud.platform.services.custom;

import com.katappult.cloud.platform.dao.api.ICustomAnnonceRepository;
import com.katappult.cloud.platform.generated.dao.api.IAnnonceRepository;
import com.katappult.cloud.platform.generated.dao.api.IProduitRepository;
import com.katappult.cloud.platform.generated.model.Annonce;
import com.katappult.cloud.platform.generated.model.Produit;
import com.katappult.cloud.platform.generated.services.api.IAnnonceService;
import com.katappult.cloud.platform.rest.customModel.AnnonceSummaryDto;
import com.katappult.cloud.platform.rest.dto.AnnonceDto;
import com.katappult.cloud.platform.rest.dto.CreateAnnonceRequest;
import com.katappult.core.exception.BusinessRuleException;
import com.katappult.core.exception.EntityNotFoundException;
import com.katappult.core.model.UserAccount;
import com.katappult.core.model.ui.UIAttributes;
import com.katappult.core.services.KatappultCoreServicesHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomAnnonceService {

    private final IAnnonceService annonceService;
    private final IAnnonceRepository annonceRepository;
    private final IProduitRepository produitRepository;
    private final ICustomAnnonceRepository customAnnonceRepository;
    private final KatappultCoreServicesHelper coreServicesHelper;

    @Transactional
    public AnnonceDto createAnnonce(CreateAnnonceRequest request) {
        UserAccount author = currentAccount();
        if (author == null || !author.isActive()) {
            throw new BusinessRuleException("ANNONCE_CREATE_ACCOUNT_INACTIVE");
        }

        Produit produit = produitRepository.findByUid(request.produitUid())
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable"));

        UIAttributes uiAttributes = buildCreateAttributes(request, author, produit);
        Annonce annonce = annonceService.create(uiAttributes);

        return toAnnonceDto(annonce);
    }

    @Transactional
    public AnnonceDto valider(String uid) {
        Annonce annonce = annonceRepository.findByUid(uid)
                .orElseThrow(() -> new EntityNotFoundException("Annonce introuvable"));
        coreServicesHelper.lifecycleService().changeState(annonce, "ACCEPTED");
        return toAnnonceDto(annonce);
    }

    @Transactional
    public AnnonceDto refuser(String uid) {
        Annonce annonce = annonceRepository.findByUid(uid)
                .orElseThrow(() -> new EntityNotFoundException("Annonce introuvable"));
        coreServicesHelper.lifecycleService().changeState(annonce, "REFUSED");
        return toAnnonceDto(annonce);
    }

    @Transactional(readOnly = true)
    public Page<AnnonceSummaryDto> listValidated(Pageable pageable) {
        return customAnnonceRepository.findValidated(pageable)
                .map(this::toSummaryDto);
    }

    private UIAttributes buildCreateAttributes(CreateAnnonceRequest request, UserAccount author, Produit produit) {
        UIAttributes uiAttributes = new UIAttributes();
        uiAttributes.put("titre", request.titre());
        uiAttributes.put("description", request.description());
        uiAttributes.put("prix", request.prix());
        uiAttributes.put("actif", request.actif());
        uiAttributes.put("author", author);
        uiAttributes.put("produit", produit);
        return uiAttributes;
    }

    private AnnonceDto toAnnonceDto(Annonce annonce) {
        return new AnnonceDto(
                annonce.getUid(),
                annonce.getTitre(),
                annonce.getDescription(),
                annonce.getPrix(),
                annonce.getActif(),
                annonce.getAuthor() != null ? annonce.getAuthor().getUid() : null,
                annonce.getProduit() != null ? annonce.getProduit().getUid() : null,
                annonce.getLifecycleState()
        );
    }

    private AnnonceSummaryDto toSummaryDto(Annonce annonce) {
        return new AnnonceSummaryDto(
                annonce.getUid(),
                annonce.getTitre(),
                annonce.getDescription(),
                annonce.getPrix(),
                annonce.getActif(),
                annonce.getAuthor() != null ? annonce.getAuthor().getUid() : null,
                annonce.getProduit() != null ? annonce.getProduit().getUid() : null,
                annonce.getLifecycleState()
        );
    }

    private UserAccount currentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserAccount userAccount)) {
            return null;
        }
        return userAccount;
    }
}
