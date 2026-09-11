package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateProduit extends KatappultEvent {

    public PostUpdateProduit() {
        super();
    }

    public PostUpdateProduit(Persistable subject) {
        super(subject);
    }

    public PostUpdateProduit(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
