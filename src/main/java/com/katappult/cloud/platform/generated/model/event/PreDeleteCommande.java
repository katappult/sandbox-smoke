package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeleteCommande extends KatappultEvent {

    public PreDeleteCommande() {
            super();
    }

    public PreDeleteCommande(Persistable subject) {
        super(subject);
    }
}
