package com.katappult.cloud.platform.generated.model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateProduit extends KatappultEvent {

    public PreCreateProduit() {
        super();
    }

    public PreCreateProduit(Persistable subject) {
        super(subject);
    }

    public PreCreateProduit(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
