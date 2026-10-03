package com.katappult.cloud.platform.generated.model;

import com.katappult.core.model.account.*;
import com.katappult.core.model.persistable.BusinessObject;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.utils.UIAttribute;
import com.katappult.core.utils.UIFieldEditor;
import com.katappult.core.utils.common.TransferIgnore;

import java.util.*;
import jakarta.persistence.*;
import java.io.Serializable;

import java.io.Serial;

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenCategorie")
@Table(name = "categorie")
@Access(AccessType.PROPERTY)

public class Categorie extends BusinessObject implements Serializable , IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String titre;
    private String description;
    private ThumbInfo thumbInfo;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setTitre(((Categorie)entity).getTitre());
        setDescription(((Categorie)entity).getDescription());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Categorie.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="categorie_oid_seq", sequenceName="categorie_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="categorie_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    
	@Embedded
    @Override
    public ThumbInfo getThumbInfo() {
        return thumbInfo;
    }

    @Override
    public void setThumbInfo(ThumbInfo thumbInfo) {
        this.thumbInfo = thumbInfo;
    }

    @UIAttribute(fieldName = "titre", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "titre")
    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    @UIAttribute(fieldName = "description", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
