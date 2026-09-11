package .model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.model.numberable.INumberable;
import com.katappult.core.rest.model.AbstractResponse;
import com.katappult.cloud.platform.generated.model.Commande;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.utils.ObjectIdentifierUtils;
import com.katappult.cloud.platform.generated.model.dto.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

import java.io.Serializable;
import lombok.*;
import java.math.BigDecimal;


@Getter
@Setter
public class CommandeRestResponse extends AbstractResponse{

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date createDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    private String lifecycleState;
    private String number;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date dateCommande;
    private BigDecimal montantTotal;
    

    public CommandeRestResponse(){

    }

    @JsonIgnore
    public CommandeRestResponse populateFromEntity(Persistable entity) {
        super.populateFromEntity(entity);

        this.setCreateDate(entity.getPersistenceInfo().getCreateDate());
        this.setLastModifiedDate(entity.getPersistenceInfo().getLastModifiedDate());
        this.setCreatedBy(entity._getCreatedBy());
        this.setLastModifiedBy(entity._getLastModifiedBy());

        if (entity instanceof ILifecycleManaged) {
            this.setLifecycleState(((ILifecycleManaged)entity).getLifecycleInfo().getCurrentState());
        }

        if(entity instanceof INumberable){
            this.setNumber(((INumberable)entity).getNumber());
        }

        setDateCommande(((Commande)entity).getDateCommande());
        setMontantTotal(((Commande)entity).getMontantTotal());
        

        return this;
    }
}
