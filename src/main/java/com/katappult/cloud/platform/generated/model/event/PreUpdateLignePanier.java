package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateLignePanier extends KatappultEvent {

    public PreUpdateLignePanier() {
        super();
    }

    public PreUpdateLignePanier(Persistable subject) {
        super(subject);
    }

     public PreUpdateLignePanier(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
