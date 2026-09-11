package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.katappult.cloud.platform.generated.model.dto.*;

import java.util.*;

import java.io.Serializable;
import lombok.*;
import java.math.BigDecimal;


@NoArgsConstructor
@Getter
@Setter
@ToString
public class LigneCommandeListRestModel extends AbstractListRestModel {


    private Integer quantite;
    private BigDecimal prixUnitaire;
    

    @JsonIgnore
    public void populateFromEntity(Persistable entity) {
        super.populateFromEntity(entity);

        setQuantite(((LigneCommande)entity).getQuantite());
        setPrixUnitaire(((LigneCommande)entity).getPrixUnitaire());
        
    }

}
