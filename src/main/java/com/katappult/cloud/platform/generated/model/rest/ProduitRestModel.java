package com.katappult.cloud.platform.generated.model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractResponse;
import com.katappult.cloud.platform.generated.model.Produit;
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
public class ProduitRestModel {

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

    private String nom;
    private String description;
    private String unite;
    private Boolean miseEnAvant;
    private Boolean actif;
    private BigDecimal prix;
    


    @JsonIgnore
    public ProduitRestModel populateFromEntity(Persistable entity) {
        this.setCreateDate(entity.getPersistenceInfo().getCreateDate());
        this.setLastModifiedDate(entity.getPersistenceInfo().getLastModifiedDate());
        this.setCreatedBy(entity._getCreatedBy());
        this.setLastModifiedBy(entity._getLastModifiedBy());
        this.setFullId(ObjectIdentifierUtils.encode(entity.getFullIdentifier()));
        this.setUid(entity.getUid());

        if (entity instanceof ILifecycleManaged lifecycleManaged) {
            this.setLifecycleState(lifecycleManaged.getLifecycleInfo().getCurrentState());
        }

        setNom(((Produit)entity).getNom());
        setDescription(((Produit)entity).getDescription());
        setUnite(((Produit)entity).getUnite());
        setMiseEnAvant(((Produit)entity).getMiseEnAvant());
        setActif(((Produit)entity).getActif());
        setPrix(((Produit)entity).getPrix());
        

        return this;
     }





}
