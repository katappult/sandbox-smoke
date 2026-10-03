package com.katappult.cloud.platform.generated.repository.impl;

import com.katappult.cloud.platform.generated.repository.api.ProduitRepository;
import com.katappult.cloud.platform.generated.repository.utils.ProduitQueryUtils;
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
public class ProduitRepositoryImpl implements ProduitRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QProduit qProduit = new QProduit("entity");

        BooleanExpression whereClause = ProduitQueryUtils.listQuery(qProduit, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qProduit)
                        .from(qProduit)
                        .where(whereClause);

        query = ProduitQueryUtils
            .orderSpecifier(query, qProduit, params);

        return repository.readPage(query, qProduit, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QProduit qProduit = new QProduit("entity");
        return false;
    }

    @Override
    public PageResult search(ProduitQuerySpec querySpec, PageRequest pageRequest) {
        QProduit qProduit = new QProduit("entity");

        BooleanExpression whereClause = ProduitQueryUtils.search(querySpec, qProduit);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qProduit)
                        .from(qProduit)
                        .where(whereClause);

        return repository.readPage(query, qProduit, pageRequest);
    }


    

    @Override
    public Produit findById(Long id) {
        return (Produit) repository.findByIdNotNull(id, Produit.class);
    }

    @Override
    public Optional<Produit> findByIdOptional(Long id) {
        Produit response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(Produit entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(Produit entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<Produit> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(Produit entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Produit entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Produit... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(Produit entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public Produit merge(Produit entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Produit mergeAndFlush(Produit entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Produit refresh(Produit entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(Produit entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(Produit entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<Produit> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<Produit> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
