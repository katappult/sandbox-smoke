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


@Entity(name = "GenPanier")
@Table(name = "panier")
@Access(AccessType.PROPERTY)

public class Panier extends BusinessObject implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Date dateCreation;
    	private List<LignePanier> lignePaniers;
    private com.katappult.core.model.account.UserAccount owner;



    @Override
    public void updateFrom(Persistable entity) {
        super.updateFrom(entity);
        setDateCreation(((Panier)entity).getDateCreation());
        
    }

    @Override
    @Transient
    public Class<?> getDomainClass() {
        return Panier.class;
    }


    @Id
    @Override
    @SequenceGenerator(name="panier_oid_seq", sequenceName="panier_oid_seq", allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="panier_oid_seq")
    @Column(columnDefinition = "serial", updatable = false)
    public Long getOid() {
        return super._getOid();
    }

    
		@TransferIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy="panier")
    public List<LignePanier> getLignePaniers() {
        return lignePaniers;
    }

    public void setLignePaniers(final List<LignePanier> lignePaniers) {
        this.lignePaniers = lignePaniers;
    }

    public void addToLignePaniers(LignePanier entity){
      if(lignePaniers == null){
        lignePaniers = new ArrayList();
      }

      lignePaniers.add(entity);
      entity.setPanier(this);
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


    @UIAttribute(fieldName = "dateCreation", required = false, blankAllowed = true, fieldEditor = UIFieldEditor.TEXT_FIELD)
    @Column(name = "date_creation")
    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }


}
