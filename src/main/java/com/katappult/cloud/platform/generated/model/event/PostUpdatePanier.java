package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdatePanier extends KatappultEvent {

    public PostUpdatePanier() {
        super();
    }

    public PostUpdatePanier(Persistable subject) {
        super(subject);
    }

    public PostUpdatePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
