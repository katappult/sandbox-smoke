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
import com.katappult.cloud.platform.generated.services.api.IProduitService;
import com.katappult.cloud.platform.generated.repository.api.ProduitRepository;
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
public class ProduitServiceImpl implements IProduitService {

   private final ProduitRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<Produit> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public Produit create(UIAttributes uiAttributes) {
        Produit entity = (Produit) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateProduit(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateProduit(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Produit entity) {
        applicationContext.publishEvent(new PreCreateProduit(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateProduit(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Produit transientEntity) {
        Produit persistent = (Produit) persistableService.findById(transientEntity.getOid(), Produit.class);

        applicationContext.publishEvent(new PreUpdateProduit(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateProduit(persistent));
    }


    @Override
    @Transactional
    public Produit update(UIAttributes uiAttributes) {
        Produit transientEntity = (Produit) uiAttributes.getTarget();
        Produit persistent = (Produit) persistableService.findById(transientEntity.getOid(), Produit.class);

        applicationContext.publishEvent(new PreUpdateProduit(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateProduit(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Produit entity) {
        Produit persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteProduit(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteProduit(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(ProduitQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public Produit patch(Map<String, Object> json, Produit entity) {
        Produit persistent = (Produit) persistableService.findById(entity.getOid(), Produit.class);

        applicationContext.publishEvent(new PreUpdateProduit(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateProduit(persistent));

        return persistent;
    }

    
}
