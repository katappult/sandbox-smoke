package com.katappult.cloud.platform.generated.model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.AnnonceDTO;
import com.katappult.cloud.platform.generated.model.Annonce;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.katappult.core.rest.model.AbstractRestRequest;

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
public class AnnonceRestRequest extends AbstractRestRequest {

     private String titre;
    private String description;
    private BigDecimal prix;
    private String creatorFullId;


     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         Annonce entity = new Annonce();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
