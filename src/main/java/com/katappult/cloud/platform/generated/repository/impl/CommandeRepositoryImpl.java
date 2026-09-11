package com.katappult.cloud.platform.generated.repository.impl;

import .repository.api.CommandeRepository;
import .repository.utils.CommandeQueryUtils;
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
public class CommandeRepositoryImpl implements CommandeRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QCommande qCommande = new QCommande("entity");

        BooleanExpression whereClause = CommandeQueryUtils.listQuery(qCommande, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qCommande)
                        .from(qCommande)
                        .where(whereClause);

        query = CommandeQueryUtils
            .orderSpecifier(query, qCommande, params);

        return repository.readPage(query, qCommande, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QCommande qCommande = new QCommande("entity");
        return false;
    }

    @Override
    public PageResult search(CommandeQuerySpec querySpec, PageRequest pageRequest) {
        QCommande qCommande = new QCommande("entity");

        BooleanExpression whereClause = CommandeQueryUtils.search(querySpec, qCommande);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qCommande)
                        .from(qCommande)
                        .where(whereClause);

        return repository.readPage(query, qCommande, pageRequest);
    }


    

    @Override
    public PageResult navigateLigneCommande(final Commande entity, final PageRequest pageRequest) {
         QLigneCommande qLigneCommande = new QLigneCommande("entity");

         JPAQuery query = repository
                .jpaQuery()
                .select(qLigneCommande)
                .from(qLigneCommande)
                .where(qLigneCommande.commande().eq(entity));

         return repository.readPage(query, qLigneCommande, pageRequest);
    }

    @Override
    public Commande getOneToManyLigneCommandeInverse(final LigneCommande entity) {
        QLigneCommande qLigneCommande = new QLigneCommande("entity");
        QCommande qCommande =  new QCommande("commande");

        Commande result = repository
                .jpaQuery()
                .select(qCommande)
                .from(qLigneCommande, qCommande)
                .where(
                    qLigneCommande.oid.eq(entity.getOid()),
                    qLigneCommande.commande().eq(qCommande)
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

    public UserAccount getManyToOneLegacyOwner(final Commande roleAEntity){
        QUserAccount qRoleB = new QUserAccount("entity");
        QCommande qRoleA = new QCommande("roleA");

        return repository
                .jpaQuery()
                .select(qRoleB)
                .from(qRoleA, qRoleB)
                .where(qRoleA.owner().eq(qRoleB).and(qRoleA.eq(roleAEntity)))
                .fetchOne();
    }


    @Override
    public PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params) {
        QCommande qRoleA = new QCommande("roleA");

        JPAQuery query = repository.selectFrom(qRoleA)
                .where(qRoleA.owner().eq(owner))
                .orderBy(qRoleA.persistenceInfo().createDate.desc());

        return repository.readPage(query, qRoleA, pageRequest);
    }

    @Override
    public Commande getSingleItemOfOwner(UserAccount owner) {
        QCommande qRoleA = new QCommande("entity");

        return repository.selectFrom(qRoleA)
                .where(qRoleA.owner().eq(owner))
                .fetchOne();
    }


    @Override
    public Commande findById(Long id) {
        return (Commande) repository.findByIdNotNull(id, Commande.class);
    }

    @Override
    public Optional<Commande> findByIdOptional(Long id) {
        Commande response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(Commande entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(Commande entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<Commande> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(Commande entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Commande entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Commande... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(Commande entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public Commande merge(Commande entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Commande mergeAndFlush(Commande entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Commande refresh(Commande entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(Commande entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(Commande entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<Commande> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<Commande> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
