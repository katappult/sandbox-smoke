package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreatePanier extends KatappultEvent {

    public PreCreatePanier() {
        super();
    }

    public PreCreatePanier(Persistable subject) {
        super(subject);
    }

    public PreCreatePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
