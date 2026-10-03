package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeleteAnnonce extends KatappultEvent {

    public PreDeleteAnnonce() {
            super();
    }

    public PreDeleteAnnonce(Persistable subject) {
        super(subject);
    }
}
