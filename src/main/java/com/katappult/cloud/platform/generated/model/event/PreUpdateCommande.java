package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateCommande extends KatappultEvent {

    public PreUpdateCommande() {
        super();
    }

    public PreUpdateCommande(Persistable subject) {
        super(subject);
    }

     public PreUpdateCommande(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
