package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;

public class PostUpdateLigneCommande extends KatappultEvent {

    public PostUpdateLigneCommande() {
        super();
    }

    public PostUpdateLigneCommande(Persistable subject) {
        super(subject);
    }

    public PostUpdateLigneCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
