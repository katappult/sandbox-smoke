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
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.model.typed.TypeInfo;
import com.katappult.core.model.typed.TypeManaged;

import com.katappult.core.model.lifecyclemanaged.ILifecycleManaged;
import com.katappult.core.model.lifecyclemanaged.LifecycleInfo;
import com.katappult.core.model.numberable.INumberable;


@Entity(name = "GenCommande")
@Table(name = "commande")
@Access(AccessType.PROPERTY)

public class Commande extends BusinessObject implements Serializable , ITypeManaged, ILifecycleManaged, INumberable{

    @Serial
    private static final long serialVersionUID = 1L;

    private Date dateCommande;
    private BigDecimal montantTotal;
    	private TypeInfo typeInfo;
	private LifecycleInfo lifecycleInfo;
	private String number = "";
	private List<LigneCommande> ligneCommandes;
    private com.katappult.core.model.account.UserAccount owner;



    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setDateCommande(((Commande)entity).getDateCommande());
        setMontantTotal(((Commande)entity).getMontantTotal());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Commande.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="commande_oid_seq", sequenceName="commande_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="commande_oid_seq")
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

	@Override
    @Column(name = "number", nullable = true, length = 40, unique = true)
    public String getNumber() {
        return number;
    }


    @Override
    public void setNumber(final String number) {
        this.number = number;
    }

		@TransferIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy="commande")
    public List<LigneCommande> getLigneCommandes() {
        return ligneCommandes;
    }

    public void setLigneCommandes(final List<LigneCommande> ligneCommandes) {
        this.ligneCommandes = ligneCommandes;
    }

    public void addToLigneCommandes(LigneCommande entity){
      if(ligneCommandes == null){
        ligneCommandes = new ArrayList();
      }

      ligneCommandes.add(entity);
      entity.setCommande(this);
    }

    @TransferIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "many_to_one_owner_fk_oid", nullable = true)
    public com.katappult.core.model.account.UserAccount getOwner() {
        return owner;
    }


    public void setOwner(final com.katappult.core.model.account.UserAccount owner) {
        this.owner = owner;
    }


    @UIAttribute(fieldName = "dateCommande", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "date_commande")
    public Date getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(Date dateCommande) {
        this.dateCommande = dateCommande;
    }

    @UIAttribute(fieldName = "montantTotal", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "montant_total")
    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }


}
