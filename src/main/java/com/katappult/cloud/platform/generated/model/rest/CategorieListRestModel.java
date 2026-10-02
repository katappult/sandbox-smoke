package com.katappult.cloud.platform.generated.model.rest;

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


@NoArgsConstructor
@Getter
@Setter
@ToString
public class CategorieListRestModel extends AbstractListRestModel {


    private String nom;
    private String description;
    private Boolean miseEnAvant;
    private Boolean actif;
    private List<String> allIllustrations = new ArrayList<>();


    @JsonIgnore
    public void populateFromEntity(Persistable entity) {
        super.populateFromEntity(entity);

        setNom(((Categorie)entity).getNom());
        setDescription(((Categorie)entity).getDescription());
        setMiseEnAvant(((Categorie)entity).getMiseEnAvant());
        setActif(((Categorie)entity).getActif());
        this.allIllustrations = com.katappult.core.service.KatappultThumbedServicesHelper.getAllIllustrations((IThumbed) entity);

    }

}
