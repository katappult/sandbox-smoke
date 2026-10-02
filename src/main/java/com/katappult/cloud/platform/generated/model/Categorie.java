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

import com.katappult.core.model.parentchild.IParentChild;

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenCategorie")
@Table(name = "categorie")
@Access(AccessType.PROPERTY)

public class Categorie extends BusinessObject implements Serializable , IParentChild<Categorie>, IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String nom;
    private String description;
    private Boolean miseEnAvant;
    private Boolean actif;
    private Categorie parent;
    private List<Categorie> children;
private ThumbInfo thumbInfo;
	private List<Produit> produits;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setNom(((Categorie)entity).getNom());
        setDescription(((Categorie)entity).getDescription());
        setMiseEnAvant(((Categorie)entity).getMiseEnAvant());
        setActif(((Categorie)entity).getActif());
        
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

        @TransferIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent")
    public List<Categorie> getChildren() {
        return children;
    }

    public void setChildren(List<Categorie> children) {
        this.children = children;
    }

    public boolean addChild(Categorie child) {
        if (children == null) {
            children = new ArrayList<>();
        }

        child.parent = this;
        return this.children.add(child);
    }


    @TransferIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "one_to_many_child_parent_fk_oid", nullable = true)
    public Categorie getParent() {
        return parent;
    }

    public void setParent(Categorie parent) {
        this.parent = parent;
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


}
