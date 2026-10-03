package com.katappult.cloud.platform.rules;

import com.katappult.core.business.event.PreSetSateEvent;
import com.katappult.core.business.rules.IVetoableBusinessRule;
import com.katappult.core.business.KatappultEvent;
import com.katappult.core.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

@Component("AnnonceLifecycleTransitionRule")
public class AnnonceLifecycleTransitionRule implements IVetoableBusinessRule {

    @Override
    public void apply(KatappultEvent event) {
        PreSetSateEvent preSetSateEvent = (PreSetSateEvent) event;
        String from = preSetSateEvent.getFromState();
        String to = preSetSateEvent.getToState();

        boolean allowed = "NEW".equals(from) && ("ACCEPTED".equals(to) || "REFUSED".equals(to));

        if (!allowed) {
            throw new BusinessRuleException("ANNONCE_TRANSITION_INVALIDE: " + from + " -> " + to);
        }
    }
}
