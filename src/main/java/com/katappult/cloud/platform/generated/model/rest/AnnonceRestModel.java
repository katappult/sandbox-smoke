package com.katappult.cloud.platform.generated.model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractResponse;
import com.katappult.cloud.platform.generated.model.Annonce;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.utils.ObjectIdentifierUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

import java.io.Serializable;
import lombok.*;
import java.math.BigDecimal;


@NoArgsConstructor
@ToString
@Getter
@Setter
public class AnnonceRestModel {

    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    )
    private Date createDate;

    @JsonFormat(
            shape = JsonFormat.Shape.STRING,
            pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    )
    private Date lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    private String lifecycleState;
    private String uid;
    private String fullId;

    private String titre;
    private String description;
    private Boolean actif;
    private BigDecimal prix;
    


    @JsonIgnore
    public AnnonceRestModel populateFromEntity(Persistable entity) {
        this.setCreateDate(entity.getPersistenceInfo().getCreateDate());
        this.setLastModifiedDate(entity.getPersistenceInfo().getLastModifiedDate());
        this.setCreatedBy(entity._getCreatedBy());
        this.setLastModifiedBy(entity._getLastModifiedBy());
        this.setFullId(ObjectIdentifierUtils.encode(entity.getFullIdentifier()));
        this.setUid(entity.getUid());

        if (entity instanceof ILifecycleManaged lifecycleManaged) {
            this.setLifecycleState(lifecycleManaged.getLifecycleInfo().getCurrentState());
        }

        setTitre(((Annonce)entity).getTitre());
        setDescription(((Annonce)entity).getDescription());
        setActif(((Annonce)entity).getActif());
        setPrix(((Annonce)entity).getPrix());
        

        return this;
     }





}
