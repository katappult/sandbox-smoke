package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateCategorie extends KatappultEvent {

    public PreUpdateCategorie() {
        super();
    }

    public PreUpdateCategorie(Persistable subject) {
        super(subject);
    }

     public PreUpdateCategorie(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
