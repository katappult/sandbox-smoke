package com.katappult.cloud.platform.generated.model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.model.numberable.INumberable;
import com.katappult.core.rest.model.AbstractResponse;
import com.katappult.cloud.platform.generated.model.Annonce;
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
public class AnnonceRestResponse extends AbstractResponse{

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date createDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    private String lifecycleState;
    private String number;

    private String titre;
    private String description;
    private BigDecimal prix;
    private List<String> allIllustrations = new ArrayList<>();


    public AnnonceRestResponse(){

    }

    @JsonIgnore
    public AnnonceRestResponse populateFromEntity(Persistable entity) {
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

        setTitre(((Annonce)entity).getTitre());
        setDescription(((Annonce)entity).getDescription());
        setPrix(((Annonce)entity).getPrix());
        this.allIllustrations = com.katappult.core.service.KatappultThumbedServicesHelper.getAllIllustrations((IThumbed) entity);


        return this;
    }
}
