package com.katappult.cloud.platform.generated.model;

import com.querydsl.core.types.Path;
import com.querydsl.core.types.PathMetadata;
import com.querydsl.core.types.dsl.*;
import com.katappult.core.model.account.*;


import javax.annotation.Generated;

import static com.querydsl.core.types.PathMetadataFactory.*;

@Generated("com.mysema.query.codegen.EntitySerializer")
public class QProduit extends EntityPathBase<Produit> {

    private static final long serialVersionUID = -118259594L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QProduit produit = new QProduit("entity");

    public final com.katappult.core.model.persistable.QBusinessObject _super;

    // inherited
    protected com.katappult.core.model.composite.QContainerInfo containerInfo;

    public final NumberPath<Long> oid = createNumber("oid", Long.class);

    public final StringPath uid = createString("uid");

    // inherited
    protected com.katappult.core.model.persistable.QPersistenceInfo persistenceInfo;


    //inherited
    public final NumberPath<Long> version;

     public final com.querydsl.core.types.dsl.StringPath titre = createString("titre");
 public final com.querydsl.core.types.dsl.StringPath description = createString("description");
 public final com.querydsl.core.types.dsl.NumberPath<java.math.BigDecimal> prix = createNumber("prix", java.math.BigDecimal.class);
 public final com.querydsl.core.types.dsl.BooleanPath enStock = createBoolean("enStock");
protected com.katappult.core.model.typed.QTypeInfo typeInfo;
	protected com.katappult.core.model.lifecyclemanaged.QLifecycleInfo lifecycleInfo;


    public QProduit(String variable) {
        this(Produit.class, forVariable(variable), INITS);

        this.typeInfo = INITS.isInitialized("typeInfo") ? new com.katappult.core.model.typed.QTypeInfo(forProperty("typeInfo"), INITS.get("typeInfo")) : null;
	this.lifecycleInfo = INITS.isInitialized("lifecycleInfo") ? new com.katappult.core.model.lifecyclemanaged.QLifecycleInfo(forProperty("lifecycleInfo"), INITS.get("lifecycleInfo")) : null;

    }

    public QProduit(Path<? extends Produit> path) {
        this(path.getType(), path.getMetadata(), path.getMetadata().isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QProduit(PathMetadata metadata) {
        this(metadata, metadata.isRoot() ? INITS : PathInits.DEFAULT);
    }

    public QProduit(PathMetadata metadata, PathInits inits) {
        this(Produit.class, metadata, inits);
    }

    public QProduit(Class<? extends Produit> type, PathMetadata metadata, PathInits inits) {
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

    
public com.katappult.core.model.typed.QTypeInfo typeInfo() {
        if (typeInfo == null) {
            typeInfo = new com.katappult.core.model.typed.QTypeInfo(forProperty("typeInfo"));
        }
        return typeInfo;
    }

	public com.katappult.core.model.lifecyclemanaged.QLifecycleInfo lifecycleInfo() {
        if (lifecycleInfo == null) {
            lifecycleInfo = new com.katappult.core.model.lifecyclemanaged.QLifecycleInfo(forProperty("lifecycleInfo"));
        }
        return lifecycleInfo;
    }

// METHODS
}

