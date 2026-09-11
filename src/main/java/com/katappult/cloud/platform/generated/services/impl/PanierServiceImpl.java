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
import .services.api.IPanierService;
import .repository.api.PanierRepository;
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
public class PanierServiceImpl implements IPanierService {

   private final PanierRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<Panier> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public Panier create(UIAttributes uiAttributes) {
        Panier entity = (Panier) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreatePanier(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreatePanier(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Panier entity) {
        applicationContext.publishEvent(new PreCreatePanier(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreatePanier(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Panier transientEntity) {
        Panier persistent = (Panier) persistableService.findById(transientEntity.getOid(), Panier.class);

        applicationContext.publishEvent(new PreUpdatePanier(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdatePanier(persistent));
    }


    @Override
    @Transactional
    public Panier update(UIAttributes uiAttributes) {
        Panier transientEntity = (Panier) uiAttributes.getTarget();
        Panier persistent = (Panier) persistableService.findById(transientEntity.getOid(), Panier.class);

        applicationContext.publishEvent(new PreUpdatePanier(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdatePanier(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Panier entity) {
        Panier persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeletePanier(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeletePanier(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(PanierQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public Panier patch(Map<String, Object> json, Panier entity) {
        Panier persistent = (Panier) persistableService.findById(entity.getOid(), Panier.class);

        applicationContext.publishEvent(new PreUpdatePanier(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdatePanier(persistent));

        return persistent;
    }

    


    @Override
    public List<LignePanier> getAllLignePanier(final Panier entity) {
        QLignePanier qLignePanier = new QLignePanier("roleB");

        return persistableRepository.selectFrom(qLignePanier)
                .where(qLignePanier.panier().eq(entity))
                .fetch();
    }


    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void addLignePanier(final Panier entity, final LignePanier roleB) {
        Panier refreshed = persistableService.refresh(entity);
        LignePanier refreshedToOne = persistableService.refresh(roleB);
        refreshed.addToLignePaniers(refreshedToOne);

        persistableService.mergeWithoutEvent(refreshed);
    }

    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void removeAllLignePanier(final Panier entity) {
        Panier refreshed = persistableService.refresh(entity);

        for(LignePanier  roleB: refreshed.getLignePaniers()){
            roleB.setPanier(null);
        }

        refreshed.getLignePaniers().clear();
        persistableService.mergeWithoutEvent(refreshed);
    }

    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void removeLignePanier(final Panier entity, final LignePanier roleB) {
        Panier refreshed = persistableService.refresh(entity);
        refreshed.getLignePaniers().remove(roleB);
        persistableService.mergeWithoutEvent(refreshed);

        LignePanier roleBRefreshed = persistableService.refresh(roleB);
        roleBRefreshed.setPanier(null);
        persistableService.mergeWithoutEvent(roleBRefreshed);
    }

    @Override
    public PageResult navigateLignePanier(final Panier entity, final PageRequest pageRequest) {
       PageResult pageResult = repository.navigateLignePanier(entity, pageRequest);
       return pageResult;
    }

    @Override
    public Panier getOneToManyLignePanierInverse(final LignePanier entity) {
        return repository.getOneToManyLignePanierInverse(entity);
    }



    @Override
    public PageResult searchManyToOneLegacyOwner(final String searchTerm, final PageRequest pageRequest) {
        return repository.searchManyToOneLegacyOwner(searchTerm, pageRequest);
    }

    @Override
    public UserAccount getManyToOneLegacyOwner(final Panier roleA){
        return repository.getManyToOneLegacyOwner(roleA);
    }

    @Override
    @Transactional
    public Panier setManyToOneLegacyOwner(Panier roleA, UserAccount roleB){
        Panier refreshed = persistableService.refresh(roleA);

        if(roleB == null){
            refreshed.setOwner(null);
        }
        else {
            refreshed.setOwner(roleB);
        }

        persistableRepository.mergeWithoutEvent(refreshed);
        return refreshed;
    }


    @Override
    public PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params) {
        return repository.listItemsOfOwner(owner, pageRequest, params);
    }

    @Override
    public Panier getSingleItemOfOwner(UserAccount owner) {
        return repository.getSingleItemOfOwner(owner);
    }

}
