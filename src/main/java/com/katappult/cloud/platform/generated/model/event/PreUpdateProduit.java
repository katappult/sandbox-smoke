package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateProduit extends KatappultEvent {

    public PreUpdateProduit() {
        super();
    }

    public PreUpdateProduit(Persistable subject) {
        super(subject);
    }

     public PreUpdateProduit(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
