package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeleteLigneCommande extends KatappultEvent {

    public PostDeleteLigneCommande() {
        super();
    }

    public PostDeleteLigneCommande(Persistable subject) {
        super(subject);
    }
}
