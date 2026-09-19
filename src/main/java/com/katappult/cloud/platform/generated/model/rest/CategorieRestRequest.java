package com.katappult.cloud.platform.generated.model.rest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.rest.model.AbstractListRestModel;
import com.katappult.cloud.platform.generated.model.dto.CategorieDTO;
import com.katappult.cloud.platform.generated.model.Categorie;
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
public class CategorieRestRequest extends AbstractRestRequest {

     private String titre;
    

     @Override
     @JsonIgnore
     public <T extends Persistable> T newEntityInstance(){
         Categorie entity = new Categorie();
         return (T) entity;
     }

     @JsonIgnore
     public <T extends Persistable> T getEntity() {
         return newEntityInstance();
     }




}
