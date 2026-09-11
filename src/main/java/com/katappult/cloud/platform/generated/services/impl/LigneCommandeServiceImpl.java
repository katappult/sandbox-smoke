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
import .services.api.ILigneCommandeService;
import .repository.api.LigneCommandeRepository;
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
public class LigneCommandeServiceImpl implements ILigneCommandeService {

   private final LigneCommandeRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<LigneCommande> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public LigneCommande create(UIAttributes uiAttributes) {
        LigneCommande entity = (LigneCommande) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateLigneCommande(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateLigneCommande(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final LigneCommande entity) {
        applicationContext.publishEvent(new PreCreateLigneCommande(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateLigneCommande(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final LigneCommande transientEntity) {
        LigneCommande persistent = (LigneCommande) persistableService.findById(transientEntity.getOid(), LigneCommande.class);

        applicationContext.publishEvent(new PreUpdateLigneCommande(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLigneCommande(persistent));
    }


    @Override
    @Transactional
    public LigneCommande update(UIAttributes uiAttributes) {
        LigneCommande transientEntity = (LigneCommande) uiAttributes.getTarget();
        LigneCommande persistent = (LigneCommande) persistableService.findById(transientEntity.getOid(), LigneCommande.class);

        applicationContext.publishEvent(new PreUpdateLigneCommande(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLigneCommande(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(LigneCommande entity) {
        LigneCommande persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteLigneCommande(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteLigneCommande(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(LigneCommandeQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public LigneCommande patch(Map<String, Object> json, LigneCommande entity) {
        LigneCommande persistent = (LigneCommande) persistableService.findById(entity.getOid(), LigneCommande.class);

        applicationContext.publishEvent(new PreUpdateLigneCommande(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateLigneCommande(persistent));

        return persistent;
    }

    


    @Override
    public PageResult searchManyToOneLegacyProduit(final String searchTerm, final PageRequest pageRequest) {
        return repository.searchManyToOneLegacyProduit(searchTerm, pageRequest);
    }

    @Override
    public UserAccount getManyToOneLegacyProduit(final LigneCommande roleA){
        return repository.getManyToOneLegacyProduit(roleA);
    }

    @Override
    @Transactional
    public LigneCommande setManyToOneLegacyProduit(LigneCommande roleA, Produit roleB){
        LigneCommande refreshed = persistableService.refresh(roleA);

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
    public LigneCommande getSingleItemOfProduit(Produit produit) {
        return repository.getSingleItemOfProduit(produit);
    }

}
