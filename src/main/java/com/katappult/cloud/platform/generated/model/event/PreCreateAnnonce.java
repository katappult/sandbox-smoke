package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateAnnonce extends KatappultEvent {

    public PreCreateAnnonce() {
        super();
    }

    public PreCreateAnnonce(Persistable subject) {
        super(subject);
    }

    public PreCreateAnnonce(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
