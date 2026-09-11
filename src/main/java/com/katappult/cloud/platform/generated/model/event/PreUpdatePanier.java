package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdatePanier extends KatappultEvent {

    public PreUpdatePanier() {
        super();
    }

    public PreUpdatePanier(Persistable subject) {
        super(subject);
    }

     public PreUpdatePanier(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
