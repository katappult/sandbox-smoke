package .services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface ICommandeService {

    Optional<Commande> findByIdOptional(Long id);

    Commande create(UIAttributes uiAttributes) ;

    Commande update(UIAttributes uiAttributes) ;

    void delete(Commande entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(CommandeQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(Commande entity);

    void batchUpdateFromImport(Commande transientEntity);

    Commande patch(Map<String, Object> json, Commande entity);

    
    void addLigneCommande(Commande entity, LigneCommande roleB);

    List<LigneCommande> getAllLigneCommande(Commande entity);

    void removeLigneCommande(Commande entity, LigneCommande roleB);

    void removeAllLigneCommande(Commande entity);

    PageResult navigateLigneCommande(Commande entity, PageRequest pageRequest);

    Commande getOneToManyLigneCommandeInverse(LigneCommande entity);

    PageResult searchManyToOneLegacyOwner(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyOwner(final Commande roleA);

    Commande setManyToOneLegacyOwner(Commande roleA, UserAccount roleB);

    PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params);

    Commande getSingleItemOfOwner(UserAccount owner);
}
