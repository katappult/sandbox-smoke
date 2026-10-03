package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateAnnonce extends KatappultEvent {

    public PostCreateAnnonce() {
        super();
    }

    public PostCreateAnnonce(Persistable subject) {
        super(subject);
    }

    public PostCreateAnnonce(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
