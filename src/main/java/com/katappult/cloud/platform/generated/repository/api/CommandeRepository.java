package com.katappult.cloud.platform.generated.repository.api;

import com.katappult.core.model.account.*;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;


public interface CommandeRepository {

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    boolean existWithName(String name);

    PageResult search(CommandeQuerySpec querySpec, PageRequest pageRequest);


    PageResult navigateLigneCommande(Commande entity, PageRequest pageRequest);

    Commande getOneToManyLigneCommandeInverse(LigneCommande entity);

    PageResult searchManyToOneLegacyOwner(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyOwner(final Commande roleB);

    PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params);

    Commande getSingleItemOfOwner(UserAccount owner);



    Commande findById(Long id);

    Optional<Commande> findByIdOptional(Long id);

    void save(Commande entity);

    void saveInNewTransaction(Commande entity);

    void save(List<Commande> persistable);

    void saveAndFlush(Commande entity);

    void saveWithoutEvent(Commande entity);

    void saveWithoutEvent(Commande... entities);

    void saveWithoutEventInNewTransaction(Commande entity);

    Commande merge(Commande entity);

    Commande mergeAndFlush(Commande entity);

    Commande refresh(Commande role);

    void delete(Commande entity);

    void deleteWithoutEvent(Commande entity);

    void delete(List<Commande> persistable);

    void deleteWithoutEvent(List<Commande> persistable);
}
