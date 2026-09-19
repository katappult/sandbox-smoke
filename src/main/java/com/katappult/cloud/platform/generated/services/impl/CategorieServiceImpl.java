package com.katappult.cloud.platform.generated.services.impl;

import com.katappult.core.utils.EntityPatchUtils;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.katappult.core.utils.exceptions.BusinessRuleException;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.service.api.IPersistableService;
import com.katappult.core.dao.api.IPersistableRepository;
import com.katappult.core.utils.UIAttributes;
import org.apache.commons.lang.StringUtils;
import com.katappult.core.model.typed.ITypeManaged;
import com.katappult.core.service.api.typed.ITypeManagedService;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.services.api.ICategorieService;
import com.katappult.cloud.platform.generated.repository.api.CategorieRepository;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.event.*;
import java.util.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


import java.util.Optional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@AllArgsConstructor
@Service
@Slf4j
public class CategorieServiceImpl implements ICategorieService {

   private final CategorieRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<Categorie> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public Categorie create(UIAttributes uiAttributes) {
        Categorie entity = (Categorie) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateCategorie(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateCategorie(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Categorie entity) {
        applicationContext.publishEvent(new PreCreateCategorie(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateCategorie(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Categorie transientEntity) {
        Categorie persistent = (Categorie) persistableService.findById(transientEntity.getOid(), Categorie.class);

        applicationContext.publishEvent(new PreUpdateCategorie(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCategorie(persistent));
    }


    @Override
    @Transactional
    public Categorie update(UIAttributes uiAttributes) {
        Categorie transientEntity = (Categorie) uiAttributes.getTarget();
        Categorie persistent = (Categorie) persistableService.findById(transientEntity.getOid(), Categorie.class);

        applicationContext.publishEvent(new PreUpdateCategorie(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCategorie(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Categorie entity) {
        Categorie persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteCategorie(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteCategorie(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(CategorieQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public Categorie patch(Map<String, Object> json, Categorie entity) {
        Categorie persistent = (Categorie) persistableService.findById(entity.getOid(), Categorie.class);

        applicationContext.publishEvent(new PreUpdateCategorie(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCategorie(persistent));

        return persistent;
    }

    
    @Override
    public List<Categorie> getAllRootCategorie() {
        return repository.getAllRootCategorie();
    }

    @Override
    public List<Categorie> getAllSubCategorieOf(Categorie parent) {
        return repository.getAllSubCategorieOf(parent);
    }

    @Override
    public Optional<Categorie> getParentCategorieOfAsOptional(Categorie child) {
        return repository.getParentCategorieOfAsOptional(child);
    }

    @Override
    public Categorie getParentCategorieOf(Categorie child) {
        return repository.getParentCategorieOf(child);
    }

    @Override
    @Transactional
    public void addSubCategorie(Categorie parent, Categorie child) {
        repository.addSubCategorie(parent, child);
    }


}
