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
import java.math.BigDecimal;
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.model.typed.TypeInfo;
import com.katappult.core.model.typed.TypeManaged;

import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.model.lifecyclemanaged.LifecycleInfo;

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenAnnonce")
@Table(name = "annonce")
@Access(AccessType.PROPERTY)

public class Annonce extends BusinessObject implements Serializable , ITypeManaged, ILifecycleManaged, IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String titre;
    private String description;
    private BigDecimal prix;
    	private TypeInfo typeInfo;
	private LifecycleInfo lifecycleInfo;
private ThumbInfo thumbInfo;
	private Produit produit;
    private com.katappult.core.model.account.UserAccount creator;



    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setTitre(((Annonce)entity).getTitre());
        setDescription(((Annonce)entity).getDescription());
        setPrix(((Annonce)entity).getPrix());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Annonce.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="annonce_oid_seq", sequenceName="annonce_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="annonce_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    
	@Embedded
    @Override
    public TypeInfo getTypeInfo() {
        return typeInfo;
    }

    @Override
    public void setTypeInfo(TypeInfo typeInfo) {
        this.typeInfo = typeInfo;
    }

	@Embedded
    @Override
    public LifecycleInfo getLifecycleInfo() {
        return lifecycleInfo;
    }

    @Override
    public void setLifecycleInfo(LifecycleInfo lifecycleInfo) {
        this.lifecycleInfo = lifecycleInfo;
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
    @JoinColumn(name = "one_to_many_produit_fk_oid", nullable = true)
    public Produit getProduit() {
        return produit;
    }

    public void setProduit(final Produit produit) {
        this.produit = produit;
    }

    @TransferIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "many_to_one_creator_fk_oid", nullable = true)
    public com.katappult.core.model.account.UserAccount getCreator() {
        return creator;
    }


    public void setCreator(final com.katappult.core.model.account.UserAccount creator) {
        this.creator = creator;
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

    @UIAttribute(fieldName = "prix", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "prix")
    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }


}
