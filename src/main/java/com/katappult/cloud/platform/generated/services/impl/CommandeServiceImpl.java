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
import .services.api.ICommandeService;
import .repository.api.CommandeRepository;
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
public class CommandeServiceImpl implements ICommandeService {

   private final CommandeRepository repository;
   private final IPersistableService persistableService;
   private final IPersistableRepository persistableRepository;
   private final ApplicationContext applicationContext;
   private final ITypeManagedService typeManagedService;


    public Optional<Commande> findByIdOptional(Long id){
        return repository.findByIdOptional(id);
    }

    @Override
    @Transactional
    public Commande create(UIAttributes uiAttributes) {
        Commande entity = (Commande) uiAttributes.getTarget();

        String businessType = uiAttributes.getBusinessType().orElse(null);
        if(StringUtils.isNotBlank(businessType) && entity instanceof ITypeManaged typeManaged){
            typeManagedService.setType(typeManaged, businessType);
        }

        applicationContext.publishEvent(new PreCreateCommande(entity, uiAttributes));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateCommande(entity, uiAttributes));

        return entity;
    }

    @Override
    @Transactional
    public void batchCreateFromImport(final Commande entity) {
        applicationContext.publishEvent(new PreCreateCommande(entity));
        persistableService.saveWithoutEvent(entity);
        applicationContext.publishEvent(new PostCreateCommande(entity));
    }

    @Override
    @Transactional
    public void batchUpdateFromImport(final Commande transientEntity) {
        Commande persistent = (Commande) persistableService.findById(transientEntity.getOid(), Commande.class);

        applicationContext.publishEvent(new PreUpdateCommande(persistent));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCommande(persistent));
    }


    @Override
    @Transactional
    public Commande update(UIAttributes uiAttributes) {
        Commande transientEntity = (Commande) uiAttributes.getTarget();
        Commande persistent = (Commande) persistableService.findById(transientEntity.getOid(), Commande.class);

        applicationContext.publishEvent(new PreUpdateCommande(persistent, uiAttributes));
        persistent.updateFrom(transientEntity);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCommande(persistent, uiAttributes));

        return persistent;
    }

    @Override
    @Transactional
    public void delete(Commande entity) {
        Commande persistent  = persistableService.refresh(entity);
        applicationContext.publishEvent(new PreDeleteCommande(persistent));
        persistableService.deleteWithoutEvent(persistent);
        applicationContext.publishEvent(new PostDeleteCommande(persistent));
    }

    @Override
    public PageResult list(PageRequest pageRequest, Map<String, String> params) {
        return repository.list(pageRequest, params);
    }

    @Override
    public PageResult search(CommandeQuerySpec querySpec, PageRequest pageRequest) {
        return repository.search(querySpec, pageRequest);
    }

    @Transactional
    public Commande patch(Map<String, Object> json, Commande entity) {
        Commande persistent = (Commande) persistableService.findById(entity.getOid(), Commande.class);

        applicationContext.publishEvent(new PreUpdateCommande(persistent));
        EntityPatchUtils.applyPatch(entity, json);
        persistableService.mergeWithoutEvent(persistent);
        applicationContext.publishEvent(new PostUpdateCommande(persistent));

        return persistent;
    }

    


    @Override
    public List<LigneCommande> getAllLigneCommande(final Commande entity) {
        QLigneCommande qLigneCommande = new QLigneCommande("roleB");

        return persistableRepository.selectFrom(qLigneCommande)
                .where(qLigneCommande.commande().eq(entity))
                .fetch();
    }


    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void addLigneCommande(final Commande entity, final LigneCommande roleB) {
        Commande refreshed = persistableService.refresh(entity);
        LigneCommande refreshedToOne = persistableService.refresh(roleB);
        refreshed.addToLigneCommandes(refreshedToOne);

        persistableService.mergeWithoutEvent(refreshed);
    }

    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void removeAllLigneCommande(final Commande entity) {
        Commande refreshed = persistableService.refresh(entity);

        for(LigneCommande  roleB: refreshed.getLigneCommandes()){
            roleB.setCommande(null);
        }

        refreshed.getLigneCommandes().clear();
        persistableService.mergeWithoutEvent(refreshed);
    }

    @Override
    @Transactional(propagation =  Propagation.REQUIRED)
    public void removeLigneCommande(final Commande entity, final LigneCommande roleB) {
        Commande refreshed = persistableService.refresh(entity);
        refreshed.getLigneCommandes().remove(roleB);
        persistableService.mergeWithoutEvent(refreshed);

        LigneCommande roleBRefreshed = persistableService.refresh(roleB);
        roleBRefreshed.setCommande(null);
        persistableService.mergeWithoutEvent(roleBRefreshed);
    }

    @Override
    public PageResult navigateLigneCommande(final Commande entity, final PageRequest pageRequest) {
       PageResult pageResult = repository.navigateLigneCommande(entity, pageRequest);
       return pageResult;
    }

    @Override
    public Commande getOneToManyLigneCommandeInverse(final LigneCommande entity) {
        return repository.getOneToManyLigneCommandeInverse(entity);
    }



    @Override
    public PageResult searchManyToOneLegacyOwner(final String searchTerm, final PageRequest pageRequest) {
        return repository.searchManyToOneLegacyOwner(searchTerm, pageRequest);
    }

    @Override
    public UserAccount getManyToOneLegacyOwner(final Commande roleA){
        return repository.getManyToOneLegacyOwner(roleA);
    }

    @Override
    @Transactional
    public Commande setManyToOneLegacyOwner(Commande roleA, UserAccount roleB){
        Commande refreshed = persistableService.refresh(roleA);

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
    public Commande getSingleItemOfOwner(UserAccount owner) {
        return repository.getSingleItemOfOwner(owner);
    }

}
