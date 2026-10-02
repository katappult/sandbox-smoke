package com.katappult.cloud.platform.generated.rules;

import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.event.*;
import com.katappult.core.service.api.IPersistableService;
import com.katappult.core.model.KatappultEvent;
import com.katappult.core.service.rules.api.IVetoableBusinessRule;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.katappult.core.utils.ObjectIdentifierUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Service
public class CategorieCreationSetParentRule implements IVetoableBusinessRule {

    private final IPersistableService persistableService;

    @Override
    @Transactional
    public void apply(KatappultEvent katappultEvent) {

        PostCreateCategorie postCreateCategorie = (PostCreateCategorie) katappultEvent;
        Categorie entityOfOurConcern = (Categorie) postCreateCategorie.getSubject();

        Optional<Object> parentIdAsOptional = katappultEvent.getAdditionnalAttribute("parentFullId");
        parentIdAsOptional.ifPresent(object -> {

            if(object != null && object instanceof String && StringUtils.isNotEmpty((String) object)) {

                String idDecoded = ObjectIdentifierUtils.decode((String) object);
                Categorie parent = (Categorie) persistableService.findById(idDecoded);

                parent.addChild(entityOfOurConcern);

                persistableService.mergeWithoutEvent(entityOfOurConcern, parent);
            }

        });
    }
}

