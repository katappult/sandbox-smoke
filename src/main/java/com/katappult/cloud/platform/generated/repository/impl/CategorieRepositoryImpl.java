package com.katappult.cloud.platform.generated.repository.impl;

import com.katappult.cloud.platform.generated.repository.api.CategorieRepository;
import com.katappult.cloud.platform.generated.repository.utils.CategorieQueryUtils;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import com.katappult.core.dao.api.IPersistableRepository;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.querydsl.core.types.dsl.BooleanExpression;
import org.apache.commons.lang.StringUtils;
import com.querydsl.jpa.impl.JPAQuery;
import com.katappult.core.model.account.*;
import com.katappult.core.model.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@AllArgsConstructor
@Slf4j
@Repository
public class CategorieRepositoryImpl implements CategorieRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QCategorie qCategorie = new QCategorie("entity");

        BooleanExpression whereClause = CategorieQueryUtils.listQuery(qCategorie, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qCategorie)
                        .from(qCategorie)
                        .where(whereClause);

        query = CategorieQueryUtils
            .orderSpecifier(query, qCategorie, params);

        return repository.readPage(query, qCategorie, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QCategorie qCategorie = new QCategorie("entity");
        return false;
    }

    @Override
    public PageResult search(CategorieQuerySpec querySpec, PageRequest pageRequest) {
        QCategorie qCategorie = new QCategorie("entity");

        BooleanExpression whereClause = CategorieQueryUtils.search(querySpec, qCategorie);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qCategorie)
                        .from(qCategorie)
                        .where(whereClause);

        return repository.readPage(query, qCategorie, pageRequest);
    }


        
    @Override
    public List<Categorie> getAllSubCategorieOf(Categorie parent) {
        if(com.katappult.core.model.version.IVersioned.class.isAssignableFrom(Categorie.class)){
            return getAllSubElementsVersioned(parent);
        }

        QCategorie qCategorie = new QCategorie("composedEntity");
        return repository.selectFrom(qCategorie)
                .where(qCategorie.parent().isNotNull().and(qCategorie.parent().eq(parent)))
                .fetch();
    }

    @Override
    public Optional<Categorie> getParentCategorieOfAsOptional(Categorie child) {
        return Optional.ofNullable(getParentCategorieOf(child));
    }

    @Override
    public Categorie getParentCategorieOf(Categorie child) {
        if (child == null) return null;
        QCategorie qCategorie = new QCategorie("composedEntity");
        return repository.selectFrom(qCategorie)
                .where(
                        qCategorie.parent().isNull()
                                .and(qCategorie.children().contains(child))
                ).fetchOne();
    }

    @Override
    public List<Categorie> getAllRootCategorie() {
        if(com.katappult.core.model.version.IVersioned.class.isAssignableFrom(Categorie.class)){
            return getAllRootElementsVersioned();
        }

        QCategorie qCategorie = new QCategorie("composedEntity");
        return repository.selectFrom(qCategorie)
                .where(qCategorie.parent().isNull())
                .fetch();
    }

    @Override
    @Transactional
    public void addSubCategorie(Categorie parent, Categorie child) {
        Categorie parentPersist = repository.refresh(parent);
        Categorie childPersist = repository.refresh(child);
        parentPersist.addChild(childPersist);

        repository.mergeWithoutEvent(parentPersist);
    }

    protected List<Categorie> getAllRootElementsVersioned(){
        final Class targetClass = Categorie.class;
        final com.querydsl.core.types.dsl.PathBuilder entityPath = new com.querydsl.core.types.dsl.PathBuilder(targetClass, "composedEntity");

        return ((JPAQuery) repository.selectFrom(entityPath)
                .where(entityPath.get("parent", Categorie.class).isNull()
                        .and(entityPath.get("iterationInfo").get("isLatestIteration", Boolean.class).eq(true))
                        .and(entityPath.get("versionInfo").get("isLatestVersion", Boolean.class).eq(true))
                        .and(entityPath.get("workInfo").get("isWorkingCopy", Boolean.class).eq(false))
                ))
                .fetch();
    }

    protected List<Categorie> getAllSubElementsVersioned(Categorie parent){
        final Class targetClass = Categorie.class;
        final com.querydsl.core.types.dsl.PathBuilder entityPath = new com.querydsl.core.types.dsl.PathBuilder(targetClass, "composedEntity");

        return ((JPAQuery) repository.selectFrom(entityPath)
                .where(entityPath.get("parent", Categorie.class).eq(parent)
                        .and(entityPath.get("iterationInfo").get("isLatestIteration", Boolean.class).eq(true))
                        .and(entityPath.get("versionInfo").get("isLatestVersion", Boolean.class).eq(true))
                        .and(entityPath.get("workInfo").get("isWorkingCopy", Boolean.class).eq(false))
                ))
                .fetch();
    }



    @Override
    public Categorie findById(Long id) {
        return (Categorie) repository.findByIdNotNull(id, Categorie.class);
    }

    @Override
    public Optional<Categorie> findByIdOptional(Long id) {
        Categorie response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(Categorie entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(Categorie entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<Categorie> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(Categorie entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Categorie entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Categorie... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(Categorie entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public Categorie merge(Categorie entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Categorie mergeAndFlush(Categorie entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Categorie refresh(Categorie entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(Categorie entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(Categorie entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<Categorie> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<Categorie> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
