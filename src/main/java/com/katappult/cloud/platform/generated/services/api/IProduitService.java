package com.katappult.cloud.platform.generated.services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface IProduitService {

    Optional<Produit> findByIdOptional(Long id);

    Produit create(UIAttributes uiAttributes) ;

    Produit update(UIAttributes uiAttributes) ;

    void delete(Produit entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(ProduitQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(Produit entity);

    void batchUpdateFromImport(Produit transientEntity);

    Produit patch(Map<String, Object> json, Produit entity);

    
}
