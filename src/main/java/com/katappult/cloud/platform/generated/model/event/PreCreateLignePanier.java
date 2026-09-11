package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateLignePanier extends KatappultEvent {

    public PreCreateLignePanier() {
        super();
    }

    public PreCreateLignePanier(Persistable subject) {
        super(subject);
    }

    public PreCreateLignePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
