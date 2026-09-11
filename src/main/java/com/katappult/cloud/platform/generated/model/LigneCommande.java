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


@Entity(name = "GenLigneCommande")
@Table(name = "ligne_commande")
@Access(AccessType.PROPERTY)

public class LigneCommande extends BusinessObject implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Integer quantite;
    private BigDecimal prixUnitaire;
    	private Commande commande;
    private .Produit produit;



    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setQuantite(((LigneCommande)entity).getQuantite());
        setPrixUnitaire(((LigneCommande)entity).getPrixUnitaire());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return LigneCommande.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="ligne_commande_oid_seq", sequenceName="ligne_commande_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="ligne_commande_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

        @TransferIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "one_to_many_commande_fk_oid", nullable = true)
    public Commande getCommande() {
        return commande;
    }

    public void setCommande(final Commande commande) {
        this.commande = commande;
    }

    @TransferIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "many_to_one_produit_fk_oid", nullable = true)
    public .Produit getProduit() {
        return produit;
    }


    public void setProduit(final .Produit produit) {
        this.produit = produit;
    }


    @UIAttribute(fieldName = "quantite", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "quantite")
    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    @UIAttribute(fieldName = "prixUnitaire", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "prix_unitaire")
    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }


}
