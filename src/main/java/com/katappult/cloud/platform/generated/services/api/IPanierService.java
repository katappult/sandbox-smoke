package .services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface IPanierService {

    Optional<Panier> findByIdOptional(Long id);

    Panier create(UIAttributes uiAttributes) ;

    Panier update(UIAttributes uiAttributes) ;

    void delete(Panier entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(PanierQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(Panier entity);

    void batchUpdateFromImport(Panier transientEntity);

    Panier patch(Map<String, Object> json, Panier entity);

    
    void addLignePanier(Panier entity, LignePanier roleB);

    List<LignePanier> getAllLignePanier(Panier entity);

    void removeLignePanier(Panier entity, LignePanier roleB);

    void removeAllLignePanier(Panier entity);

    PageResult navigateLignePanier(Panier entity, PageRequest pageRequest);

    Panier getOneToManyLignePanierInverse(LignePanier entity);

    PageResult searchManyToOneLegacyOwner(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyOwner(final Panier roleA);

    Panier setManyToOneLegacyOwner(Panier roleA, UserAccount roleB);

    PageResult listItemsOfOwner(UserAccount owner, PageRequest pageRequest, Map params);

    Panier getSingleItemOfOwner(UserAccount owner);
}
