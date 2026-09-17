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
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.model.typed.TypeInfo;
import com.katappult.core.model.typed.TypeManaged;

import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.model.lifecyclemanaged.LifecycleInfo;

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenProduit")
@Table(name = "produit")
@Access(AccessType.PROPERTY)

public class Produit extends BusinessObject implements Serializable , ITypeManaged, ILifecycleManaged, IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String titre;
    private String description;
    private BigDecimal prix;
    private Boolean enStock;
    	private TypeInfo typeInfo;
	private LifecycleInfo lifecycleInfo;
private ThumbInfo thumbInfo;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setTitre(((Produit)entity).getTitre());
        setDescription(((Produit)entity).getDescription());
        setPrix(((Produit)entity).getPrix());
        setEnStock(((Produit)entity).getEnStock());
        
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

    @Convert(converter = Boolean01Converter.class)
    @UIAttribute(fieldName = "enStock", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "en_stock")
    public Boolean getEnStock() {
        return enStock;
    }

    public void setEnStock(Boolean enStock) {
        this.enStock = enStock;
    }


}
