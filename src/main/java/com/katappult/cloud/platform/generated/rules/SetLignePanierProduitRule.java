package com.katappult.cloud.platform.generated.rules;

import com.katappult.core.model.account.UserAccount;
import com.katappult.core.model.KatappultEvent;
import com.katappult.core.service.rules.api.IVetoableBusinessRule;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.utils.ObjectIdentifierUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.katappult.core.service.api.IPersistableService;
import org.springframework.stereotype.Service;
import lombok.*;
//IMPORT

@AllArgsConstructor
@Service
public class SetLignePanierProduitRule implements IVetoableBusinessRule {

    private final IPersistableService persistableService;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false)
    public void apply(KatappultEvent event) {

        if(event.getUiAttributes() != null && event.getUiAttributes().getAllAttributesFromUI() != null) {
            String produitId = (String) event.getUiAttributes().getAllAttributesFromUI().get("produitId");
            if(StringUtils.isNotBlank(produitId)) {

                LignePanier entity = (LignePanier) event.getSubject();

                String produitIdDecoded = ObjectIdentifierUtils.decode(produitId);
                Produit roleB = (Produit) persistableService.findById(produitIdDecoded);
                entity.setProduit(roleB);

                persistableService.mergeWithoutEvent(entity);
            }
        }
    }

}