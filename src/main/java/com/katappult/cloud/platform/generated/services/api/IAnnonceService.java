package com.katappult.cloud.platform.generated.services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface IAnnonceService {

    Optional<Annonce> findByIdOptional(Long id);

    Annonce create(UIAttributes uiAttributes) ;

    Annonce update(UIAttributes uiAttributes) ;

    void delete(Annonce entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(AnnonceQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(Annonce entity);

    void batchUpdateFromImport(Annonce transientEntity);

    Annonce patch(Map<String, Object> json, Annonce entity);

    
    PageResult searchManyToOneLegacyAuthor(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyAuthor(final Annonce roleA);

    Annonce setManyToOneLegacyAuthor(Annonce roleA, UserAccount roleB);

    PageResult listItemsOfAuthor(UserAccount author, PageRequest pageRequest, Map params);

    Annonce getSingleItemOfAuthor(UserAccount author);
}
