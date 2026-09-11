package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeletePanier extends KatappultEvent {

    public PostDeletePanier() {
        super();
    }

    public PostDeletePanier(Persistable subject) {
        super(subject);
    }
}
