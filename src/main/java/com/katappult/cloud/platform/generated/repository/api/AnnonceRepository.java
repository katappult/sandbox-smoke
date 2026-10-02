package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface AnnonceRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(AnnonceQuerySpec querySpec, PageRequest pageRequest);


    PageResult searchManyToOneLegacyAuthor(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyAuthor(final Annonce roleB);

    PageResult listItemsOfAuthor(UserAccount author, PageRequest pageRequest, Map params);

    Annonce getSingleItemOfAuthor(UserAccount author);



    Annonce findById(Long id);

    Optional<Annonce> findByIdOptional(Long id);

    void save(Annonce entity);

    void saveInNewTransaction(Annonce entity);

    void save(List<Annonce> persistable);

    void saveAndFlush(Annonce entity);

    void saveWithoutEvent(Annonce entity);

    void saveWithoutEvent(Annonce... entities);

    void saveWithoutEventInNewTransaction(Annonce entity);

    Annonce merge(Annonce entity);

    Annonce mergeAndFlush(Annonce entity);

    Annonce refresh(Annonce role);

    void delete(Annonce entity);

    void deleteWithoutEvent(Annonce entity);

    void delete(List<Annonce> persistable);

    void deleteWithoutEvent(List<Annonce> persistable);
}
