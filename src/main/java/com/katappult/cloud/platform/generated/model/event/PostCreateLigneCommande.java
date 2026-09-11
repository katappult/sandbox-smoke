package .model.event;

import com.katappult.core.model.KatappultEvent;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttributes;


public class PostCreateLigneCommande extends KatappultEvent {

    public PostCreateLigneCommande() {
        super();
    }

    public PostCreateLigneCommande(Persistable subject) {
        super(subject);
    }

    public PostCreateLigneCommande(Persistable subject, UIAttributes uiAttributes) {
        super(subject, uiAttributes);
    }
}
