package .services.impl;

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
import .model.*;
import .services.api.ILignePanierService;
import .repository.api.LignePanierRepository;
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
public class LignePanierServiceImpl implements ILignePanierService {

   private final LignePanierRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<LignePanier> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public LignePanier create(UIAttributes uiAttributes) {
        LignePanier entity = (LignePanier) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateLignePanier(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateLignePanier(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final LignePanier entity) {
        applicationContext.publishEvent(new PreCreateLignePanier(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateLignePanier(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final LignePanier transientEntity) {
        LignePanier persistent = (LignePanier) persistableService.findById(transientEntity.getOid(), LignePanier.class);

        applicationContext.publishEvent(new PreUpdateLignePanier(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLignePanier(persistent));
    }


    @Override
    @Transactional
    public LignePanier update(UIAttributes uiAttributes) {
        LignePanier transientEntity = (LignePanier) uiAttributes.getTarget();
        LignePanier persistent = (LignePanier) persistableService.findById(transientEntity.getOid(), LignePanier.class);

        applicationContext.publishEvent(new PreUpdateLignePanier(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLignePanier(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(LignePanier entity) {
        LignePanier persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteLignePanier(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteLignePanier(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(LignePanierQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public LignePanier patch(Map<String, Object> json, LignePanier entity) {
        LignePanier persistent = (LignePanier) persistableService.findById(entity.getOid(), LignePanier.class);

        applicationContext.publishEvent(new PreUpdateLignePanier(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLignePanier(persistent));

        return persistent;
    }

    


    @Override
    public PageResult searchManyToOneLegacyProduit(final String searchTerm, final PageRequest pageRequest) {
        return repository.searchManyToOneLegacyProduit(searchTerm, pageRequest);
    }

    @Override
    public UserAccount getManyToOneLegacyProduit(final LignePanier roleA){
        return repository.getManyToOneLegacyProduit(roleA);
    }

    @Override
    @Transactional
    public LignePanier setManyToOneLegacyProduit(LignePanier roleA, Produit roleB){
        LignePanier refreshed = persistableService.refresh(roleA);

        if(roleB == null){
            refreshed.setProduit(null);
        }
        else {
            refreshed.setProduit(roleB);
        }

        persistableRepository.mergeWithoutEvent(refreshed);
        return refreshed;
    }


    @Override
    public PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params) {
        return repository.listItemsOfProduit(produit, pageRequest, params);
    }

    @Override
    public LignePanier getSingleItemOfProduit(Produit produit) {
        return repository.getSingleItemOfProduit(produit);
    }

}
