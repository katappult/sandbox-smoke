package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.CommandeDTO;
import com.katappult.cloud.platform.generated.model.Commande;
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
public class CommandeRestRequest extends AbstractRestRequest {

     @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date dateCommande;
    private BigDecimal montantTotal;
    private String ownerFullId;


     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         Commande entity = new Commande();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
