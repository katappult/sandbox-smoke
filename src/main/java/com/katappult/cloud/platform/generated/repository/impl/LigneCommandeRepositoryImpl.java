package com.katappult.cloud.platform.generated.repository.impl;

import .repository.api.LigneCommandeRepository;
import .repository.utils.LigneCommandeQueryUtils;
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
public class LigneCommandeRepositoryImpl implements LigneCommandeRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QLigneCommande qLigneCommande = new QLigneCommande("entity");

        BooleanExpression whereClause = LigneCommandeQueryUtils.listQuery(qLigneCommande, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qLigneCommande)
                        .from(qLigneCommande)
                        .where(whereClause);

        query = LigneCommandeQueryUtils
            .orderSpecifier(query, qLigneCommande, params);

        return repository.readPage(query, qLigneCommande, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QLigneCommande qLigneCommande = new QLigneCommande("entity");
        return false;
    }

    @Override
    public PageResult search(LigneCommandeQuerySpec querySpec, PageRequest pageRequest) {
        QLigneCommande qLigneCommande = new QLigneCommande("entity");

        BooleanExpression whereClause = LigneCommandeQueryUtils.search(querySpec, qLigneCommande);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qLigneCommande)
                        .from(qLigneCommande)
                        .where(whereClause);

        return repository.readPage(query, qLigneCommande, pageRequest);
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

    public Produit getManyToOneLegacyProduit(final LigneCommande roleAEntity){
        QProduit qRoleB = new QProduit("entity");
        QLigneCommande qRoleA = new QLigneCommande("roleA");

        return repository
                .jpaQuery()
                .select(qRoleB)
                .from(qRoleA, qRoleB)
                .where(qRoleA.produit().eq(qRoleB).and(qRoleA.eq(roleAEntity)))
                .fetchOne();
    }


    @Override
    public PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params) {
        QLigneCommande qRoleA = new QLigneCommande("roleA");

        JPAQuery query = repository.selectFrom(qRoleA)
                .where(qRoleA.produit().eq(produit))
                .orderBy(qRoleA.persistenceInfo().createDate.desc());

        return repository.readPage(query, qRoleA, pageRequest);
    }

    @Override
    public LigneCommande getSingleItemOfProduit(Produit produit) {
        QLigneCommande qRoleA = new QLigneCommande("entity");

        return repository.selectFrom(qRoleA)
                .where(qRoleA.produit().eq(produit))
                .fetchOne();
    }


    @Override
    public LigneCommande findById(Long id) {
        return (LigneCommande) repository.findByIdNotNull(id, LigneCommande.class);
    }

    @Override
    public Optional<LigneCommande> findByIdOptional(Long id) {
        LigneCommande response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(LigneCommande entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(LigneCommande entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<LigneCommande> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(LigneCommande entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(LigneCommande entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(LigneCommande... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(LigneCommande entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public LigneCommande merge(LigneCommande entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public LigneCommande mergeAndFlush(LigneCommande entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public LigneCommande refresh(LigneCommande entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(LigneCommande entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(LigneCommande entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<LigneCommande> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<LigneCommande> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
