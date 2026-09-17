package com.katappult.cloud.platform.generated.rules;

import com.katappult.core.utils.exceptions.BusinessRuleException;
import com.katappult.core.model.ErrorCodeFamilyWithType;
import com.katappult.core.model.KatappultEvent;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.service.rules.api.IVetoableBusinessRule;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ProduitSetType implements IVetoableBusinessRule {

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false)
    public void apply(KatappultEvent event) {
        //throw new BusinessRuleException(ErrorCodeFamilyWithType.FORBIDDEN);
    }

}
