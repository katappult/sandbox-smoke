package .model;

import com.querydsl.core.types.Path;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.dsl.*;
import com.katappult.core.model.account.*;


import javax.annotation.Generated;

import static com.querydsl.core.types.PathMetadataFactory.*;

@Generated("com.mysema.query.codegen.EntitySerializer")
public class QPanier extends EntityPathBase<Panier> {

    private static final long serialVersionUID = -118259594L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPanier panier = new QPanier("entity");

    public final com.katappult.core.model.persistable.QBusinessObject _super;

    // inherited
    protected com.katappult.core.model.composite.QContainerInfo containerInfo;

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    public final StringPath uid = createString("uid");

    // inherited
    protected com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo;


    //inherited
    public final NumberPath<Long> version;

     public final com.querydsl.core.types.dsl.DatePath<java.util.Date> dateCreation = createDate("dateCreation", java.util.Date.class);
    protected com.katappult.core.model.account.QUserAccount owner;



    public QPanier(String variable) {
        this(Panier.class, forVariable(variable), INITS);

        
    }

    public QPanier(Path<? extends Panier> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QPanier(PathMetadata metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QPanier(PathMetadata metadata, PathInits inits) {
        this(Panier.class, metadata, inits);
    }

    public QPanier(Class<? extends Panier> type, PathMetadata metadata, PathInits inits) {
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

     public com.katappult.core.model.account.QUserAccount owner() {
        if (owner == null) {
            owner = new com.katappult.core.model.account.QUserAccount(forProperty("owner"));
        }
        return owner;
    }

// METHODS
}

