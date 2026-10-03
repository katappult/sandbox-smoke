package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface ProduitRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(ProduitQuerySpec querySpec, PageRequest pageRequest);



    Produit findById(Long id);

    Optional<Produit> findByIdOptional(Long id);

    void save(Produit entity);

    void saveInNewTransaction(Produit entity);

    void save(List<Produit> persistable);

    void saveAndFlush(Produit entity);

    void saveWithoutEvent(Produit entity);

    void saveWithoutEvent(Produit... entities);

    void saveWithoutEventInNewTransaction(Produit entity);

    Produit merge(Produit entity);

    Produit mergeAndFlush(Produit entity);

    Produit refresh(Produit role);

    void delete(Produit entity);

    void deleteWithoutEvent(Produit entity);

    void delete(List<Produit> persistable);

    void deleteWithoutEvent(List<Produit> persistable);
}
