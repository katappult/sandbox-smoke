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

@Entity(name = "GenProduit")
@Table(name = "produit")
@Access(AccessType.PROPERTY)

public class Produit extends BusinessObject implements Serializable , IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String titre;
    private String description;
    private Boolean featured;
    private Boolean active;
    private ThumbInfo thumbInfo;
	private Categorie categorie;
	private List<Annonce> annonces;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setTitre(((Produit)entity).getTitre());
        setDescription(((Produit)entity).getDescription());
        setFeatured(((Produit)entity).getFeatured());
        setActive(((Produit)entity).getActive());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Produit.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="produit_oid_seq", sequenceName="produit_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="produit_oid_seq")
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
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "one_to_many_categorie_fk_oid", nullable = true)
    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(final Categorie categorie) {
        this.categorie = categorie;
    }


		@TransferIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy="produit")
    public List<Annonce> getAnnonces() {
        return annonces;
    }

    public void setAnnonces(final List<Annonce> annonces) {
        this.annonces = annonces;
    }

    public void addToAnnonces(Annonce entity){
      if(annonces == null){
        annonces = new ArrayList();
      }

      annonces.add(entity);
      entity.setProduit(this);
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
