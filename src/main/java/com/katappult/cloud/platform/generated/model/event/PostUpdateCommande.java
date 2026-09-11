package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateCommande extends KatappultEvent {

    public PostUpdateCommande() {
        super();
    }

    public PostUpdateCommande(Persistable subject) {
        super(subject);
    }

    public PostUpdateCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
