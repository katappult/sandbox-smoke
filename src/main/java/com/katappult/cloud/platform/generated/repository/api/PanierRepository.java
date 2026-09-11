package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface PanierRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(PanierQuerySpec querySpec, PageRequest pageRequest);


    PageResult navigateLignePanier(Panier entity, PageRequest pageRequest);

    Panier getOneToManyLignePanierInverse(LignePanier entity);

    PageResult searchManyToOneLegacyOwner(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyOwner(final Panier roleB);

    PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params);

    Panier getSingleItemOfOwner(UserAccount owner);



    Panier findById(Long id);

    Optional<Panier> findByIdOptional(Long id);

    void save(Panier entity);

    void saveInNewTransaction(Panier entity);

    void save(List<Panier> persistable);

    void saveAndFlush(Panier entity);

    void saveWithoutEvent(Panier entity);

    void saveWithoutEvent(Panier... entities);

    void saveWithoutEventInNewTransaction(Panier entity);

    Panier merge(Panier entity);

    Panier mergeAndFlush(Panier entity);

    Panier refresh(Panier role);

    void delete(Panier entity);

    void deleteWithoutEvent(Panier entity);

    void delete(List<Panier> persistable);

    void deleteWithoutEvent(List<Panier> persistable);
}
