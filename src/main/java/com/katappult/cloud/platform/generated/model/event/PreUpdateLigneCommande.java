package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreUpdateLigneCommande extends KatappultEvent {

    public PreUpdateLigneCommande() {
        super();
    }

    public PreUpdateLigneCommande(Persistable subject) {
        super(subject);
    }

     public PreUpdateLigneCommande(Persistable subject, UIAttributes uiAttributes) {
            super(subject, uiAttributes);
        }
}
