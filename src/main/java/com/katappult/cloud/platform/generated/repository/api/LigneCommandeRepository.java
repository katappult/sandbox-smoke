package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface LigneCommandeRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(LigneCommandeQuerySpec querySpec, PageRequest pageRequest);


    PageResult searchManyToOneLegacyProduit(final String searchTerm, PageRequest pageRequest);

    Produit getManyToOneLegacyProduit(final LigneCommande roleB);

    PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params);

    LigneCommande getSingleItemOfProduit(Produit produit);



    LigneCommande findById(Long id);

    Optional<LigneCommande> findByIdOptional(Long id);

    void save(LigneCommande entity);

    void saveInNewTransaction(LigneCommande entity);

    void save(List<LigneCommande> persistable);

    void saveAndFlush(LigneCommande entity);

    void saveWithoutEvent(LigneCommande entity);

    void saveWithoutEvent(LigneCommande... entities);

    void saveWithoutEventInNewTransaction(LigneCommande entity);

    LigneCommande merge(LigneCommande entity);

    LigneCommande mergeAndFlush(LigneCommande entity);

    LigneCommande refresh(LigneCommande role);

    void delete(LigneCommande entity);

    void deleteWithoutEvent(LigneCommande entity);

    void delete(List<LigneCommande> persistable);

    void deleteWithoutEvent(List<LigneCommande> persistable);
}
