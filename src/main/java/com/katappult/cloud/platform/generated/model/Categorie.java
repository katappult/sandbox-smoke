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
import com.katappult.core.model.Boolean01Converter;

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
    private Boolean featured;
    private Boolean active;
    private ThumbInfo thumbInfo;
	private List<Produit> produits;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setTitre(((Categorie)entity).getTitre());
        setDescription(((Categorie)entity).getDescription());
        setFeatured(((Categorie)entity).getFeatured());
        setActive(((Categorie)entity).getActive());
        
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

		@TransferIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy="categorie")
    public List<Produit> getProduits() {
        return produits;
    }

    public void setProduits(final List<Produit> produits) {
        this.produits = produits;
    }

    public void addToProduits(Produit entity){
      if(produits == null){
        produits = new ArrayList();
      }

      produits.add(entity);
      entity.setCategorie(this);
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

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "featured", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "featured")
    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "active", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "active")
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }


}
