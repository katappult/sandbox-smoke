package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.ProduitDTO;
import com.katappult.cloud.platform.generated.model.Produit;
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
public class ProduitRestRequest extends AbstractRestRequest {

     private String libelle;
    private String description;
    private BigDecimal prixUnitaire;
    private Integer quantiteStock;
    

     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         Produit entity = new Produit();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
