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
import java.math.BigDecimal;

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenProduit")
@Table(name = "produit")
@Access(AccessType.PROPERTY)

public class Produit extends BusinessObject implements Serializable , IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String nom;
    private String description;
    private String unite;
    private Boolean miseEnAvant;
    private Boolean actif;
    private BigDecimal prix;
    private ThumbInfo thumbInfo;
	private Categorie categorie;
	private List<Annonce> annonces;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setNom(((Produit)entity).getNom());
        setDescription(((Produit)entity).getDescription());
        setUnite(((Produit)entity).getUnite());
        setMiseEnAvant(((Produit)entity).getMiseEnAvant());
        setActif(((Produit)entity).getActif());
        setPrix(((Produit)entity).getPrix());
        
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


    @UIAttribute(fieldName = "nom", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "nom")
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    @UIAttribute(fieldName = "description", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @UIAttribute(fieldName = "unite", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "unite")
    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "miseEnAvant", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "mise_en_avant")
    public Boolean getMiseEnAvant() {
        return miseEnAvant;
    }

    public void setMiseEnAvant(Boolean miseEnAvant) {
        this.miseEnAvant = miseEnAvant;
    }

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "actif", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "actif")
    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    @UIAttribute(fieldName = "prix", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "prix")
    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }


}
