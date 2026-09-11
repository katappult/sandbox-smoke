package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreatePanier extends KatappultEvent {

    public PostCreatePanier() {
        super();
    }

    public PostCreatePanier(Persistable subject) {
        super(subject);
    }

    public PostCreatePanier(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
