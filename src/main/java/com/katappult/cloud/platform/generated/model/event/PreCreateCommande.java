package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateCommande extends KatappultEvent {

    public PreCreateCommande() {
        super();
    }

    public PreCreateCommande(Persistable subject) {
        super(subject);
    }

    public PreCreateCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
