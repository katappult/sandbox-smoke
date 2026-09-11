package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;


public class PreDeleteLigneCommande extends KatappultEvent {

    public PreDeleteLigneCommande() {
            super();
    }

    public PreDeleteLigneCommande(Persistable subject) {
        super(subject);
    }
}
