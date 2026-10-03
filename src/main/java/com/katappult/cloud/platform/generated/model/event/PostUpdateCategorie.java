package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateCategorie extends KatappultEvent {

    public PostUpdateCategorie() {
        super();
    }

    public PostUpdateCategorie(Persistable subject) {
        super(subject);
    }

    public PostUpdateCategorie(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
