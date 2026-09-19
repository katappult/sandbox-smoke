package com.katappult.cloud.platform.generated.services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface ICategorieService {

    Optional<Categorie> findByIdOptional(Long id);

    Categorie create(UIAttributes uiAttributes) ;

    Categorie update(UIAttributes uiAttributes) ;

    void delete(Categorie entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(CategorieQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(Categorie entity);

    void batchUpdateFromImport(Categorie transientEntity);

    Categorie patch(Map<String, Object> json, Categorie entity);

    
    List<Categorie> getAllSubCategorieOf(Categorie parent);

    Optional<Categorie> getParentCategorieOfAsOptional(Categorie child);

    Categorie getParentCategorieOf(Categorie child);

    void addSubCategorie(Categorie parent, Categorie child);

    List<Categorie> getAllRootCategorie();

}
