package com.katappult.cloud.platform.generated.rules;

import com.katappult.cloud.platform.generated.model.Categorie;
import com.katappult.cloud.platform.generated.model.event.PostDeleteCategorie;
import com.katappult.cloud.platform.generated.services.api.ICategorieService;
import com.katappult.core.dao.api.IPersistableRepository;
import com.katappult.core.model.KatappultEvent;
import com.katappult.core.service.rules.api.IVetoableBusinessRule;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Service
public class CategorieRecursiveDeleteChildrenRule implements IVetoableBusinessRule {

    private final IPersistableRepository persistableRepository;
    private final ICategorieService service;

    @Override
    @Transactional
    public void apply(KatappultEvent katappultEvent) {
        PostDeleteCategorie event = (PostDeleteCategorie) katappultEvent;
        Categorie entityOfOurConcern = (Categorie) event.getSubject();
        deleteSubs(entityOfOurConcern);
    }

    private void deleteSubs(Categorie entity) {
        service.getAllSubCategorieOf(entity).stream().forEach(sub -> {
            deleteSubs(sub);
            persistableRepository.delete(sub);
        });
    }
}

