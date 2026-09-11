package com.katappult.cloud.platform.generated.repository.impl;

import .repository.api.PanierRepository;
import .repository.utils.PanierQueryUtils;
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
public class PanierRepositoryImpl implements PanierRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QPanier qPanier = new QPanier("entity");

        BooleanExpression whereClause = PanierQueryUtils.listQuery(qPanier, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qPanier)
                        .from(qPanier)
                        .where(whereClause);

        query = PanierQueryUtils
            .orderSpecifier(query, qPanier, params);

        return repository.readPage(query, qPanier, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QPanier qPanier = new QPanier("entity");
        return false;
    }

    @Override
    public PageResult search(PanierQuerySpec querySpec, PageRequest pageRequest) {
        QPanier qPanier = new QPanier("entity");

        BooleanExpression whereClause = PanierQueryUtils.search(querySpec, qPanier);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qPanier)
                        .from(qPanier)
                        .where(whereClause);

        return repository.readPage(query, qPanier, pageRequest);
    }


    

    @Override
    public PageResult navigateLignePanier(final Panier entity, final PageRequest pageRequest) {
         QLignePanier qLignePanier = new QLignePanier("entity");

         JPAQuery query = repository
                .jpaQuery()
                .select(qLignePanier)
                .from(qLignePanier)
                .where(qLignePanier.panier().eq(entity));

         return repository.readPage(query, qLignePanier, pageRequest);
    }

    @Override
    public Panier getOneToManyLignePanierInverse(final LignePanier entity) {
        QLignePanier qLignePanier = new QLignePanier("entity");
        QPanier qPanier =  new QPanier("panier");

        Panier result = repository
                .jpaQuery()
                .select(qPanier)
                .from(qLignePanier, qPanier)
                .where(
                    qLignePanier.oid.eq(entity.getOid()),
                    qLignePanier.panier().eq(qPanier)
                )
                .fetchOne();

        return result;
    }



    @Override
    public PageResult searchManyToOneLegacyOwner(final String searchTerm, final PageRequest pageRequest) {

        QUserAccount qRoleB = new QUserAccount("entity");
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

    public UserAccount getManyToOneLegacyOwner(final Panier roleAEntity){
        QUserAccount qRoleB = new QUserAccount("entity");
        QPanier qRoleA = new QPanier("roleA");

        return repository
                .jpaQuery()
                .select(qRoleB)
                .from(qRoleA, qRoleB)
                .where(qRoleA.owner().eq(qRoleB).and(qRoleA.eq(roleAEntity)))
                .fetchOne();
    }


    @Override
    public PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params) {
        QPanier qRoleA = new QPanier("roleA");

        JPAQuery query = repository.selectFrom(qRoleA)
                .where(qRoleA.owner().eq(owner))
                .orderBy(qRoleA.persistenceInfo().createDate.desc());

        return repository.readPage(query, qRoleA, pageRequest);
    }

    @Override
    public Panier getSingleItemOfOwner(UserAccount owner) {
        QPanier qRoleA = new QPanier("entity");

        return repository.selectFrom(qRoleA)
                .where(qRoleA.owner().eq(owner))
                .fetchOne();
    }


    @Override
    public Panier findById(Long id) {
        return (Panier) repository.findByIdNotNull(id, Panier.class);
    }

    @Override
    public Optional<Panier> findByIdOptional(Long id) {
        Panier response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(Panier entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(Panier entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<Panier> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(Panier entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Panier entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Panier... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(Panier entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public Panier merge(Panier entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Panier mergeAndFlush(Panier entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Panier refresh(Panier entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(Panier entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(Panier entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<Panier> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<Panier> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
