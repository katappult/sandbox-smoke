package .services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface ILignePanierService {

    Optional<LignePanier> findByIdOptional(Long id);

    LignePanier create(UIAttributes uiAttributes) ;

    LignePanier update(UIAttributes uiAttributes) ;

    void delete(LignePanier entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(LignePanierQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(LignePanier entity);

    void batchUpdateFromImport(LignePanier transientEntity);

    LignePanier patch(Map<String, Object> json, LignePanier entity);

    
    PageResult searchManyToOneLegacyProduit(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyProduit(final LignePanier roleA);

    LignePanier setManyToOneLegacyProduit(LignePanier roleA, Produit roleB);

    PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params);

    LignePanier getSingleItemOfProduit(Produit produit);
}
