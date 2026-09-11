package .services.api;

import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import com.katappult.core.utils.UIAttributes;
import java.util.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import java.util.*;


public interface ILigneCommandeService {

    Optional<LigneCommande> findByIdOptional(Long id);

    LigneCommande create(UIAttributes uiAttributes) ;

    LigneCommande update(UIAttributes uiAttributes) ;

    void delete(LigneCommande entity);

    PageResult list(PageRequest pageRequest, Map<String, String> params);

    PageResult search(LigneCommandeQuerySpec querySpec, PageRequest pageRequest);

    void batchCreateFromImport(LigneCommande entity);

    void batchUpdateFromImport(LigneCommande transientEntity);

    LigneCommande patch(Map<String, Object> json, LigneCommande entity);

    
    PageResult searchManyToOneLegacyProduit(final String searchTerm, PageRequest pageRequest);

    UserAccount getManyToOneLegacyProduit(final LigneCommande roleA);

    LigneCommande setManyToOneLegacyProduit(LigneCommande roleA, Produit roleB);

    PageResult listItemsOfProduit(Produit produit, PageRequest pageRequest, Map params);

    LigneCommande getSingleItemOfProduit(Produit produit);
}
