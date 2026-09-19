package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateProduit extends KatappultEvent {

    public PostCreateProduit() {
        super();
    }

    public PostCreateProduit(Persistable subject) {
        super(subject);
    }

    public PostCreateProduit(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
