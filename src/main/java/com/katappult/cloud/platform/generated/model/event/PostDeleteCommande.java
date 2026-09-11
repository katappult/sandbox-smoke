package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeleteCommande extends KatappultEvent {

    public PostDeleteCommande() {
        super();
    }

    public PostDeleteCommande(Persistable subject) {
        super(subject);
    }
}
