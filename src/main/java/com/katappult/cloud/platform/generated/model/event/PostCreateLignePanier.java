package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateLignePanier extends KatappultEvent {

    public PostCreateLignePanier() {
        super();
    }

    public PostCreateLignePanier(Persistable subject) {
        super(subject);
    }

    public PostCreateLignePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
