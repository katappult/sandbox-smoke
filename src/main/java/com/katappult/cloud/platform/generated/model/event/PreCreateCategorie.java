package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateCategorie extends KatappultEvent {

    public PreCreateCategorie() {
        super();
    }

    public PreCreateCategorie(Persistable subject) {
        super(subject);
    }

    public PreCreateCategorie(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
