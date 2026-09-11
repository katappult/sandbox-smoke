package .model;

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

import com.katappult.core.model.thumbed.IThumbed;
import com.katappult.core.model.thumbed.ThumbInfo
;

@Entity(name = "GenProduit")
@Table(name = "produit")
@Access(AccessType.PROPERTY)

public class Produit extends BusinessObject implements Serializable , IThumbed{

    @Serial
    private static final long serialVersionUID = 1L;

    private String libelle;
    private String description;
    private BigDecimal prixUnitaire;
    private Integer quantiteStock;
    private ThumbInfo thumbInfo;


    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setLibelle(((Produit)entity).getLibelle());
        setDescription(((Produit)entity).getDescription());
        setPrixUnitaire(((Produit)entity).getPrixUnitaire());
        setQuantiteStock(((Produit)entity).getQuantiteStock());
        
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

    @UIAttribute(fieldName = "libelle", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "libelle")
    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    @UIAttribute(fieldName = "description", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @UIAttribute(fieldName = "prixUnitaire", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "prix_unitaire")
    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    @UIAttribute(fieldName = "quantiteStock", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "quantite_stock")
    public Integer getQuantiteStock() {
        return quantiteStock;
    }

    public void setQuantiteStock(Integer quantiteStock) {
        this.quantiteStock = quantiteStock;
    }


}
