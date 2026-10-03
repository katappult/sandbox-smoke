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
import java.math.BigDecimal;


@NoArgsConstructor
@Getter
@Setter
@ToString
public class AnnonceListRestModel extends AbstractListRestModel {


    private String titre;
    private String description;
    private BigDecimal prix;
    private List<String> allIllustrations = new ArrayList<>();


    @JsonIgnore
    public void populateFromEntity(Persistable entity) {
        super.populateFromEntity(entity);

        setTitre(((Annonce)entity).getTitre());
        setDescription(((Annonce)entity).getDescription());
        setPrix(((Annonce)entity).getPrix());
        this.allIllustrations = com.katappult.core.service.KatappultThumbedServicesHelper.getAllIllustrations((IThumbed) entity);

    }

}
