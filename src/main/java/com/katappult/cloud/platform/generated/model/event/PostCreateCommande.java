package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateCommande extends KatappultEvent {

    public PostCreateCommande() {
        super();
    }

    public PostCreateCommande(Persistable subject) {
        super(subject);
    }

    public PostCreateCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
