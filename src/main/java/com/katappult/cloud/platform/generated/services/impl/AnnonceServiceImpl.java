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
import com.katappult.cloud.platform.generated.services.api.IAnnonceService;
import com.katappult.cloud.platform.generated.repository.api.AnnonceRepository;
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
public class AnnonceServiceImpl implements IAnnonceService {

   private final AnnonceRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<Annonce> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public Annonce create(UIAttributes uiAttributes) {
        Annonce entity = (Annonce) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateAnnonce(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateAnnonce(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Annonce entity) {
        applicationContext.publishEvent(new PreCreateAnnonce(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateAnnonce(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Annonce transientEntity) {
        Annonce persistent = (Annonce) persistableService.findById(transientEntity.getOid(), Annonce.class);

        applicationContext.publishEvent(new PreUpdateAnnonce(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateAnnonce(persistent));
    }


    @Override
    @Transactional
    public Annonce update(UIAttributes uiAttributes) {
        Annonce transientEntity = (Annonce) uiAttributes.getTarget();
        Annonce persistent = (Annonce) persistableService.findById(transientEntity.getOid(), Annonce.class);

        applicationContext.publishEvent(new PreUpdateAnnonce(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateAnnonce(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Annonce entity) {
        Annonce persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteAnnonce(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteAnnonce(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(AnnonceQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public Annonce patch(Map<String, Object> json, Annonce entity) {
        Annonce persistent = (Annonce) persistableService.findById(entity.getOid(), Annonce.class);

        applicationContext.publishEvent(new PreUpdateAnnonce(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateAnnonce(persistent));

        return persistent;
    }

    


    @Override
    public PageResult searchManyToOneLegacyCreator(final String searchTerm, final PageRequest pageRequest) {
        return repository.searchManyToOneLegacyCreator(searchTerm, pageRequest);
    }

    @Override
    public UserAccount getManyToOneLegacyCreator(final Annonce roleA){
        return repository.getManyToOneLegacyCreator(roleA);
    }

    @Override
    @Transactional
    public Annonce setManyToOneLegacyCreator(Annonce roleA, UserAccount roleB){
        Annonce refreshed = persistableService.refresh(roleA);

        if(roleB == null){
            refreshed.setCreator(null);
        }
        else {
            refreshed.setCreator(roleB);
        }

        persistableRepository.mergeWithoutEvent(refreshed);
        return refreshed;
    }


    @Override
    public PageResult listItemsOfCreator(UserAccount creator, PageRequest pageRequest, Map params) {
        return repository.listItemsOfCreator(creator, pageRequest, params);
    }

    @Override
    public Annonce getSingleItemOfCreator(UserAccount creator) {
        return repository.getSingleItemOfCreator(creator);
    }

}
