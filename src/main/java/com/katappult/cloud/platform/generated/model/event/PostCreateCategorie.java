package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateCategorie extends KatappultEvent {

    public PostCreateCategorie() {
        super();
    }

    public PostCreateCategorie(Persistable subject) {
        super(subject);
    }

    public PostCreateCategorie(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
