package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;

public class PostDeleteProduit extends KatappultEvent {

    public PostDeleteProduit() {
        super();
    }

    public PostDeleteProduit(Persistable subject) {
        super(subject);
    }
}
