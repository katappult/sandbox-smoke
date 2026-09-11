package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateLignePanier extends KatappultEvent {

    public PostUpdateLignePanier() {
        super();
    }

    public PostUpdateLignePanier(Persistable subject) {
        super(subject);
    }

    public PostUpdateLignePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
