package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface CategorieRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(CategorieQuerySpec querySpec, PageRequest pageRequest);


    List<Categorie> getAllSubCategorieOf(Categorie parent);

    Optional<Categorie> getParentCategorieOfAsOptional(Categorie child);

    Categorie getParentCategorieOf(Categorie child);

    void addSubCategorie(Categorie parent, Categorie child);

    List<Categorie> getAllRootCategorie();

    Categorie findById(Long id);

    Optional<Categorie> findByIdOptional(Long id);

    void save(Categorie entity);

    void saveInNewTransaction(Categorie entity);

    void save(List<Categorie> persistable);

    void saveAndFlush(Categorie entity);

    void saveWithoutEvent(Categorie entity);

    void saveWithoutEvent(Categorie... entities);

    void saveWithoutEventInNewTransaction(Categorie entity);

    Categorie merge(Categorie entity);

    Categorie mergeAndFlush(Categorie entity);

    Categorie refresh(Categorie role);

    void delete(Categorie entity);

    void deleteWithoutEvent(Categorie entity);

    void delete(List<Categorie> persistable);

    void deleteWithoutEvent(List<Categorie> persistable);
}
