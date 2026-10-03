package com.katappult.cloud.platform.rules;

import com.katappult.core.business.event.PreSetSateEvent;
import com.katappult.core.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AnnonceLifecycleTransitionRuleTest {

    private final AnnonceLifecycleTransitionRule rule = new AnnonceLifecycleTransitionRule();

    @Test
    void newToAccepted_isAllowed() {
        PreSetSateEvent event = mock(PreSetSateEvent.class);
        when(event.getFromState()).thenReturn("NEW");
        when(event.getToState()).thenReturn("ACCEPTED");
        assertDoesNotThrow(() -> rule.apply(event));
    }

    @Test
    void newToRefused_isAllowed() {
        PreSetSateEvent event = mock(PreSetSateEvent.class);
        when(event.getFromState()).thenReturn("NEW");
        when(event.getToState()).thenReturn("REFUSED");
        assertDoesNotThrow(() -> rule.apply(event));
    }

    @Test
    void acceptedToRefused_isRejected() {
        PreSetSateEvent event = mock(PreSetSateEvent.class);
        when(event.getFromState()).thenReturn("ACCEPTED");
        when(event.getToState()).thenReturn("REFUSED");
        assertThrows(BusinessRuleException.class, () -> rule.apply(event));
    }

    @Test
    void newToClosed_isRejected() {
        PreSetSateEvent event = mock(PreSetSateEvent.class);
        when(event.getFromState()).thenReturn("NEW");
        when(event.getToState()).thenReturn("CLOSED");
        assertThrows(BusinessRuleException.class, () -> rule.apply(event));
    }
}
