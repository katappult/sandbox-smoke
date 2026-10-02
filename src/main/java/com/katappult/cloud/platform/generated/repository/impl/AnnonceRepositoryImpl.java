package com.katappult.cloud.platform.generated.repository.impl;

import com.katappult.cloud.platform.generated.repository.api.AnnonceRepository;
import com.katappult.cloud.platform.generated.repository.utils.AnnonceQueryUtils;
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
public class AnnonceRepositoryImpl implements AnnonceRepository {

    private final IPersistableRepository repository;

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        QAnnonce qAnnonce = new QAnnonce("entity");

        BooleanExpression whereClause = AnnonceQueryUtils.listQuery(qAnnonce, params);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qAnnonce)
                        .from(qAnnonce)
                        .where(whereClause);

        query = AnnonceQueryUtils
            .orderSpecifier(query, qAnnonce, params);

        return repository.readPage(query, qAnnonce, pageRequest);
    }

    @Override
    public boolean existWithName(String name) {
        QAnnonce qAnnonce = new QAnnonce("entity");
        return false;
    }

    @Override
    public PageResult search(AnnonceQuerySpec querySpec, PageRequest pageRequest) {
        QAnnonce qAnnonce = new QAnnonce("entity");

        BooleanExpression whereClause = AnnonceQueryUtils.search(querySpec, qAnnonce);
        JPAQuery query = repository
                        .jpaQuery()
                        .select(qAnnonce)
                        .from(qAnnonce)
                        .where(whereClause);

        return repository.readPage(query, qAnnonce, pageRequest);
    }


    


    @Override
    public PageResult searchManyToOneLegacyAuthor(final String searchTerm, final PageRequest pageRequest) {

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

    public UserAccount getManyToOneLegacyAuthor(final Annonce roleAEntity){
        QUserAccount qRoleB = new QUserAccount("entity");
        QAnnonce qRoleA = new QAnnonce("roleA");

        return repository
                .jpaQuery()
                .select(qRoleB)
                .from(qRoleA, qRoleB)
                .where(qRoleA.author().eq(qRoleB).and(qRoleA.eq(roleAEntity)))
                .fetchOne();
    }


    @Override
    public PageResult listItemsOfAuthor(UserAccount author, PageRequest pageRequest, Map params) {
        QAnnonce qRoleA = new QAnnonce("roleA");

        JPAQuery query = repository.selectFrom(qRoleA)
                .where(qRoleA.author().eq(author))
                .orderBy(qRoleA.persistenceInfo().createDate.desc());

        return repository.readPage(query, qRoleA, pageRequest);
    }

    @Override
    public Annonce getSingleItemOfAuthor(UserAccount author) {
        QAnnonce qRoleA = new QAnnonce("entity");

        return repository.selectFrom(qRoleA)
                .where(qRoleA.author().eq(author))
                .fetchOne();
    }


    @Override
    public Annonce findById(Long id) {
        return (Annonce) repository.findByIdNotNull(id, Annonce.class);
    }

    @Override
    public Optional<Annonce> findByIdOptional(Long id) {
        Annonce response = findById(id);
        return Optional.ofNullable(response);
    }

    @Override
    @Transactional
    public void save(Annonce entity) {
        repository.save(entity);
    }

    @Override
    @Transactional
    public void saveInNewTransaction(Annonce entity) {
        repository.saveInNewTransaction(entity);
    }

    @Override
    @Transactional
    public void save(List<Annonce> persistables) {
        repository.save(persistables);
    }

    @Override
    @Transactional
    public void saveAndFlush(Annonce entity) {
        repository.saveAndFlush(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Annonce entity) {
        repository.saveWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void saveWithoutEvent(Annonce... entities) {
        repository.saveWithoutEvent(entities);
    }

    @Override
    @Transactional
    public void saveWithoutEventInNewTransaction(Annonce entity) {
        repository.saveWithoutEventInNewTransaction(entity);
    }

    @Override
    @Transactional
    public Annonce merge(Annonce entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Annonce mergeAndFlush(Annonce entity) {
        return repository.merge(entity);
    }

    @Override
    @Transactional
    public Annonce refresh(Annonce entity) {
        return repository.refresh(entity);
    }

    @Override
    @Transactional
    public void delete(Annonce entity) {
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(Annonce entity) {
        repository.deleteWithoutEvent(entity);
    }

    @Override
    @Transactional
    public void delete(List<Annonce> persistables) {
        repository.deleteWithoutEvent(persistables);
    }

    @Override
    @Transactional
    public void deleteWithoutEvent(List<Annonce> persistables) {
        repository.deleteWithoutEvent(persistables);
    }
}
