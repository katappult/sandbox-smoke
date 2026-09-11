package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeletePanier extends KatappultEvent {

    public PreDeletePanier() {
            super();
    }

    public PreDeletePanier(Persistable subject) {
        super(subject);
    }
}
