package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface LignePanierRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(LignePanierQuerySpec querySpec, PageRequest pageRequest);


    PageResult searchManyToOneLegacyProduit(final String searchTerm, PageRequest pageRequest);

    Produit getManyToOneLegacyProduit(final LignePanier roleB);

    PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params);

    LignePanier getSingleItemOfProduit(Produit produit);



    LignePanier findById(Long id);

    Optional<LignePanier> findByIdOptional(Long id);

    void save(LignePanier entity);

    void saveInNewTransaction(LignePanier entity);

    void save(List<LignePanier> persistable);

    void saveAndFlush(LignePanier entity);

    void saveWithoutEvent(LignePanier entity);

    void saveWithoutEvent(LignePanier... entities);

    void saveWithoutEventInNewTransaction(LignePanier entity);

    LignePanier merge(LignePanier entity);

    LignePanier mergeAndFlush(LignePanier entity);

    LignePanier refresh(LignePanier role);

    void delete(LignePanier entity);

    void deleteWithoutEvent(LignePanier entity);

    void delete(List<LignePanier> persistable);

    void deleteWithoutEvent(List<LignePanier> persistable);
}
