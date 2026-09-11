package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeleteLignePanier extends KatappultEvent {

    public PreDeleteLignePanier() {
            super();
    }

    public PreDeleteLignePanier(Persistable subject) {
        super(subject);
    }
}
