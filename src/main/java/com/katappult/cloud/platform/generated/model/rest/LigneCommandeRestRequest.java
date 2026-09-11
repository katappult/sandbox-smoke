package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.LigneCommandeDTO;
import com.katappult.cloud.platform.generated.model.LigneCommande;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.katappult.core.rest.model.AbstractRestRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

import java.io.Serializable;
import lombok.*;

@NoArgsConstructor
@ToString
@Getter
@Setter
public class LigneCommandeRestRequest extends AbstractRestRequest {

     private Integer quantite;
    private BigDecimal prixUnitaire;
    private String produitFullId;


     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         LigneCommande entity = new LigneCommande();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
