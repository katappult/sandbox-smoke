package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeleteProduit extends KatappultEvent {

    public PreDeleteProduit() {
            super();
    }

    public PreDeleteProduit(Persistable subject) {
        super(subject);
    }
}
