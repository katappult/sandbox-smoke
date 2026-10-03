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
public class ProduitListRestModel extends AbstractListRestModel {


    private String titre;
    private String description;
    private Boolean featured;
    private Boolean active;
    private List<String> allIllustrations = new ArrayList<>();


    @JsonIgnore
    public void populateFromEntity(Persistable entity) {
        super.populateFromEntity(entity);

        setTitre(((Produit)entity).getTitre());
        setDescription(((Produit)entity).getDescription());
        setFeatured(((Produit)entity).getFeatured());
        setActive(((Produit)entity).getActive());
        this.allIllustrations = com.katappult.core.service.KatappultThumbedServicesHelper.getAllIllustrations((IThumbed) entity);

    }

}
