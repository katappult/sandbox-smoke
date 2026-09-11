package .model;

import com.querydsl.core.types.Path;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.dsl.*;
import com.katappult.core.model.account.*;


import javax.annotation.Generated;

import static com.querydsl.core.types.PathMetadataFactory.*;

@Generated("com.mysema.query.codegen.EntitySerializer")
public class QLigneCommande extends EntityPathBase<LigneCommande> {

    private static final long serialVersionUID = -118259594L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLigneCommande ligneCommande = new QLigneCommande("entity");

    public final com.katappult.core.model.persistable.QBusinessObject _super;

    // inherited
    protected com.katappult.core.model.composite.QContainerInfo containerInfo;

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    public final StringPath uid = createString("uid");

    // inherited
    protected com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo;


    //inherited
    public final NumberPath<Long> version;

     public final com.querydsl.core.types.dsl.NumberPath<java.lang.Integer> quantite = createNumber("quantite", java.lang.Integer.class);
 public final com.querydsl.core.types.dsl.NumberPath<java.math.BigDecimal> prixUnitaire = createNumber("prixUnitaire", java.math.BigDecimal.class);
protected QCommande commande;
    protected .QProduit produit;



    public QLigneCommande(String variable) {
        this(LigneCommande.class, forVariable(variable), INITS);

        
    }

    public QLigneCommande(Path<? extends LigneCommande> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QLigneCommande(PathMetadata metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QLigneCommande(PathMetadata metadata, PathInits inits) {
        this(LigneCommande.class, metadata, inits);
    }

    public QLigneCommande(Class<? extends LigneCommande> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.katappult.core.model.persistable.QBusinessObject(type, metadata, inits);
        this.version = _super.version;
    }

    public com.katappult.core.model.composite.QContainerInfo containerInfo() {
        if (containerInfo == null) {
            containerInfo = new com.katappult.core.model.composite.QContainerInfo(forProperty("containerInfo"));
        }
        return containerInfo;
    }

    public com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo() {
        if (persistenceInfo == null) {
            persistenceInfo = new com.katappult.core.model.persistable.QPersistenceInfo(forProperty("persistenceInfo"));
        }
        return persistenceInfo;
    }

     public QCommande commande() {
        if (commande == null) {
            commande = new QCommande(forProperty("commande"));
        }
        return commande;
    }

 public .QProduit produit() {
        if (produit == null) {
            produit = new .QProduit(forProperty("produit"));
        }
        return produit;
    }

// METHODS
}

