package com.katappult.cloud.platform.dao.impl;

import com.katappult.cloud.platform.dao.api.ICustomAnnonceRepository;
import com.katappult.cloud.platform.generated.model.Annonce;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(readOnly = true)
public class CustomAnnonceRepositoryImpl implements ICustomAnnonceRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Annonce> findValidated(Pageable pageable) {
        String entityName = entityManager.getMetamodel().entity(Annonce.class).getName();
        String jpql = "select a from " + entityName + " a where a.lifecycleState = 'ACCEPTED'";

        TypedQuery<Annonce> query = entityManager.createQuery(jpql, Annonce.class);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<Annonce> content = query.getResultList();

        String countJpql = "select count(a) from " + entityName + " a where a.lifecycleState = 'ACCEPTED'";
        Long total = entityManager.createQuery(countJpql, Long.class).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
}
