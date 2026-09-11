package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PreCreateLigneCommande extends KatappultEvent {

    public PreCreateLigneCommande() {
        super();
    }

    public PreCreateLigneCommande(Persistable subject) {
        super(subject);
    }

    public PreCreateLigneCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }

}
