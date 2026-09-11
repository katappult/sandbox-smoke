package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeleteLignePanier extends KatappultEvent {

    public PostDeleteLignePanier() {
        super();
    }

    public PostDeleteLignePanier(Persistable subject) {
        super(subject);
    }
}
