package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateAnnonce extends KatappultEvent {

    public PostUpdateAnnonce() {
        super();
    }

    public PostUpdateAnnonce(Persistable subject) {
        super(subject);
    }

    public PostUpdateAnnonce(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
