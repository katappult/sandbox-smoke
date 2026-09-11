package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.LignePanierDTO;
import com.katappult.cloud.platform.generated.model.LignePanier;
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
public class LignePanierRestRequest extends AbstractRestRequest {

     private Integer quantite;
    private String produitFullId;


     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         LignePanier entity = new LignePanier();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
