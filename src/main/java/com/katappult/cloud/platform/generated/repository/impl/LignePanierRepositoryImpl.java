package com.katappult.cloud.platform.generated.repository.impl;

import .repository.api.LignePanierRepository;
import .repository.utils.LignePanierQueryUtils;
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
public class LignePanierRepositoryImpl implements LignePanierRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QLignePanier qLignePanier = new QLignePanier("entity");

        BooleanExpression whereClause = LignePanierQueryUtils.listQuery(qLignePanier, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qLignePanier)
                        .from(qLignePanier)
                        .where(whereClause);

        query = LignePanierQueryUtils
            .orderSpecifier(query, qLignePanier, params);

        return repository.readPage(query, qLignePanier, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QLignePanier qLignePanier = new QLignePanier("entity");
        return false;
    }

    @Override
    public PageResult search(LignePanierQuerySpec querySpec, PageRequest pageRequest) {
        QLignePanier qLignePanier = new QLignePanier("entity");

        BooleanExpression whereClause = LignePanierQueryUtils.search(querySpec, qLignePanier);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qLignePanier)
                        .from(qLignePanier)
                        .where(whereClause);

        return repository.readPage(query, qLignePanier, pageRequest);
    }


    


    @Override
    public PageResult searchManyToOneLegacyProduit(final String searchTerm, final PageRequest pageRequest) {

        QProduit qRoleB = new QProduit("entity");
        BooleanExpression whereClause = qRoleB.containerInfo.container.isNotNull()
                .and(qRoleB.hidden.isFalse().or(qRoleB.hidden.isNull()));
        if (StringUtils.isNotBlank(searchTerm)) {
             whereClause = whereClause.and(
                                qRoleB.nickName.containsIgnoreCase(searchTerm)
                                .or(qRoleB.ownerSummary.containsIgnoreCase(searchTerm))
                                        .or(qRoleB.login.containsIgnoreCase(searchTerm))
                        );
        }

        JPAQuery query = repository
                .selectFrom(qRoleB)
                .where(whereClause);

        return repository.readPage(query, qRoleB, pageRequest);
    }

    public Produit getManyToOneLegacyProduit(final LignePanier roleAEntity){
        QProduit qRoleB = new QProduit("entity");
        QLignePanier qRoleA = new QLignePanier("roleA");

        return repository
                .jpaQuery()
                .select(qRoleB)
                .from(qRoleA, qRoleB)
                .where(qRoleA.produit().eq(qRoleB).and(qRoleA.eq(roleAEntity)))
                .fetchOne();
    }


    @Override
    public PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params) {
        QLignePanier qRoleA = new QLignePanier("roleA");

        JPAQuery query = repository.selectFrom(qRoleA)
                .where(qRoleA.produit().eq(produit))
                .orderBy(qRoleA.persistenceInfo().createDate.desc());

        return repository.readPage(query, qRoleA, pageRequest);
    }

    @Override
    public LignePanier getSingleItemOfProduit(Produit produit) {
        QLignePanier qRoleA = new QLignePanier("entity");

        return repository.selectFrom(qRoleA)
                .where(qRoleA.produit().eq(produit))
                .fetchOne();
    }


    @Override
    public LignePanier findById(Long id) {
        return (LignePanier) repository.findByIdNotNull(id, LignePanier.class);
    }

    @Override
    public Optional<LignePanier> findByIdOptional(Long id) {
        LignePanier response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(LignePanier entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(LignePanier entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<LignePanier> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(LignePanier entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(LignePanier entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(LignePanier... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(LignePanier entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public LignePanier merge(LignePanier entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public LignePanier mergeAndFlush(LignePanier entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public LignePanier refresh(LignePanier entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(LignePanier entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(LignePanier entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<LignePanier> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<LignePanier> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
