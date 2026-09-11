package .rest;

import com.katappult.core.model.account.UserAccount;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.katappult.core.model.persistable.Persistable;
import com.katappult.core.service.api.IPersistableService;
import com.katappult.core.rest.model.SuccessRestResponse;
import com.katappult.core.utils.common.ValidationErrorTranslator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.apache.commons.lang.StringUtils;
import com.katappult.core.utils.OptionalRestObjectFullId;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.katappult.core.utils.UIAttributes;
import jakarta.inject.Provider;
import com.katappult.core.utils.ObjectIdentifierUtils;
import com.katappult.core.rest.BaseKatappultRestService;
import com.katappult.cloud.platform.generated.model.queryspec.LigneCommandeQuerySpec;
import com.katappult.cloud.platform.generated.model.rest.*;
import com.katappult.core.rest.model.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.UserAccount.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.*;

import .services.api.ILigneCommandeService;
import .model.*;



@io.swagger.v3.oas.annotations.tags.Tag(name = "LigneCommande", description = "Manages LigneCommande and its relations. ")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("ligne_commande")
public class LigneCommandeGeneratedServiceFacade extends BaseKatappultRestService {

    private final ILigneCommandeService service;
    private final IPersistableService persistableService;
    private final Provider<UIAttributes> uiAttributesProvider;

    public LigneCommandeGeneratedServiceFacade(ILigneCommandeService service, IPersistableService persistableService,
        Provider<UIAttributes> uiAttributesProvider) {

      this.service = service;
      this.persistableService = persistableService;
      this.uiAttributesProvider = uiAttributesProvider;
    }


   @Operation(summary = "Create LigneCommande",
                  description = "Creates a new LigneCommande."
                          + "All relationships of an entity can be specified in the form either by their fullId (for automatic processing) or by their uid.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity created successfully",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class))),
       @ApiResponse(responseCode = "200", description = "Validation error — response body contains error messages",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class)))
   })
   @PostMapping
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'CREATE_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public LigneCommandeRestResponse create(@RequestBody LigneCommandeRestRequest request) {

       LigneCommandeRestResponse response = new LigneCommandeRestResponse();

       UIAttributes uiAttributes = uiAttributesProvider.get();
       uiAttributes.from(request);

       uiAttributes.additionalAttributes("produitFullId", request.getParam("produitFullId"));
// ENRICH CREATE ENDPOINT
       LigneCommande created = service.create(uiAttributes);

       return response.populateFromEntity(created);
   }


   @Operation(summary = "Get LigneCommande details", description = "Returns the full data of the entity.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity found",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @GetMapping("/{uid}")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'READ_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public LigneCommandeRestResponse details(
           @Parameter(description = "Identifier (the `uid` field from a previous response)", required = true)
           @PathVariable(name = "uid") final String uid) {
       LigneCommandeRestResponse response = new LigneCommandeRestResponse();
       LigneCommande entity = getPersistable(uid, LigneCommande.class);
       return response.populateFromEntity(entity);
   }


   @Operation(summary = "Bulk delete LigneCommande",
              description = "Deletes multiple entities at once. The request body must contain a list of uuid.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity deleted successfully"),
       @ApiResponse(responseCode = "404", description = "One or more identifiers not found")
   })
   @DeleteMapping(value = "/deleteElements")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'DELETE_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN') or hasRole('ROLE_ADMIN')")
   public SuccessRestResponse deleteElements(@RequestBody DeleteRequest request) {

       List<Persistable> toDelete = new ArrayList<>();

       for (int i = 0; i < request.getIdentifiers().size(); i++) {
           String uid = request.getIdentifiers().get(i);
           Persistable object = getPersistable(uid, LigneCommande.class);
           toDelete.add(object);
       }

       persistableService.deleteWithCustomEvent(toDelete);
       return SuccessRestResponse.newOne();
   }


   @Operation(summary = "Delete an entity",
              description = "Deletes a single entity.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity deleted successfully"),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @DeleteMapping("/{uid}")
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'DELETE_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public SuccessRestResponse delete(
           @Parameter(description = "Uid of the entity", required = true)
           @PathVariable(name = "uid") final String uid) {
       LigneCommande entity = getPersistable(uid, LigneCommande.class);
       service.delete(entity);
       return SuccessRestResponse.newOne();
   }


   @Operation(summary = "Partially update entity",
              description = "Applies a JSON patch to the provided fields only. Fields not present in the body are left unchanged. "
                      + "Patchable entity raw fields, do not include relation fields.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity updated",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @PatchMapping("/{uid}")
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'UPDATE_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public LigneCommandeRestResponse patch(
           @Parameter(description = "Identifier of the entity", required = true)
           @PathVariable(name = "uid") final String uid,
           @Parameter(description = "Json containing attributes to patch", required = true)
           @RequestBody Map<String, Object> json) {
       LigneCommande entity = getPersistable(uid, LigneCommande.class);
       entity = service.patch(json, entity);
       return new LigneCommandeRestResponse().populateFromEntity(entity);
   }


   @Operation(summary = "Fully update an entity",
              description = "Replaces the entity fields with those from the request body. "
                      + "**Warning:** the relation of the entity are not processed during update. ")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity updated",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class))),
       @ApiResponse(responseCode = "400", description = "Validation error — response body contains error messages",
                    content = @Content(schema = @Schema(implementation = LigneCommandeRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @PutMapping("/{uid}")
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'UPDATE_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public LigneCommandeRestResponse update(
           @Parameter(description = "Uid identifier", required = true)
           @PathVariable(name = "uid") final String uid,
           @RequestBody LigneCommandeRestRequest request) {

       LigneCommandeRestResponse response = new LigneCommandeRestResponse();

       UIAttributes uiAttributes = uiAttributesProvider.get();
       uiAttributes.from(request);

       LigneCommande entity = getPersistable(uid, LigneCommande.class);
       uiAttributes.getTarget().setOid(entity.getOid());

       LigneCommande updated = service.update(uiAttributes);
       return response.populateFromEntity(updated);
   }


   @Operation(summary = "List of paginated entities",
              description = "Returns a paginated list of paginated entities. "
                      + "If `searchTerm` is provided, performs a full-text search (delegates to `search()`). "
                      + "Otherwise, returns the list filtered by `status` and sorted by `sort`. "
                      + "Sort syntax: `field` for ASC, `-field` for DESC.")
   @ApiResponse(responseCode = "200", description = "Paginated list of entities")
   @GetMapping(value = "/list")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'LIST_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<LigneCommandeListRestModel> list(
           @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(name = "page", defaultValue = "0") int page,
           @Parameter(description = "Lifecycle state filter. Use `all` for no filter.") @RequestParam(name = "status", defaultValue = "all") String status,
           @Parameter(description = "Full-text search term (optional). When present, activates search mode.") @RequestParam(name = "searchTerm", defaultValue = "") String searchTerm,
           @Parameter(description = "Number of items per page", example = "20") @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
           @Parameter(description = "Sort field. Prefix with `-` for DESC. Example: `-persistenceInfo.createDate`") @RequestParam(name = "sort", defaultValue = "-persistenceInfo.createDate") String sort) {

       PageRequest pageRequest = new PageRequest(page, pageSize, sort);

       Map<String, String> params = new HashMap<>();
       params.put("status", "all".equalsIgnoreCase(status) ? "" : status);
       params.put("sort", sort);

       PageResult pageResult;
       if (StringUtils.isNotBlank(searchTerm)) {
           LigneCommandeQuerySpec querySpec = new LigneCommandeQuerySpec();
           querySpec.setSearchTerm_toQuery(searchTerm);
           querySpec.setSearchPage(page);
           querySpec.setSearchPageSize(pageSize);

           pageResult = service.search(querySpec, pageRequest);
       } else {
           pageResult = service.list(pageRequest, params);
       }

       return new ListRestResponse<>(pageResult, LigneCommandeListRestModel.class);
   }


   @Operation(summary = "Fetch entities by uuid",
              description = "Returns a list of entity matching the given encoded uuid. Useful for batch fetching.")
   @ApiResponse(responseCode = "200", description = "List of matching entities")
   @GetMapping(value = "/listFromUids")
   @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'SEARCH_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<LigneCommandeListRestModel> listFromUids(
           @Parameter(description = "List of encoded identifiers (repeated parameter). Example: `?identifier=abc&identifier=def`", required = true)
           @RequestParam(name = "identifier") List<String> identifiers) {
       var list = identifiers.stream()
               .map(uid -> getPersistable(uid, LigneCommande.class))
               .toList();
       return new ListRestResponse<>(list, LigneCommandeListRestModel.class);
   }


   @Operation(summary = "Advanced search",
              description = "Paginated search using a `LigneCommandeQuerySpec` body. "
                      + "Available fields: `searchTerm` (full-text), `searchPage` (0-based), `searchPageSize`, `selectedStates` (list of lifecycle states). "
                      + "Pagination is driven by the QuerySpec itself.")
   @ApiResponse(responseCode = "200", description = "Paginated search results")
   @PostMapping(value = "/advanced_search")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'SEARCH_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<LigneCommandeListRestModel> advancedSearch(@RequestBody LigneCommandeQuerySpec querySpec) {

       PageRequest pageRequest = new PageRequest.Builder()
               .page(querySpec.getSearchPage())
               .size(querySpec.getSearchPageSize()).build();

       PageResult pageResult = service.search(querySpec, pageRequest);
       return new ListRestResponse<>(pageResult, LigneCommandeListRestModel.class);
   }


   @Operation(summary = "Search entities",
              description = "Full-text search by `searchTerm`. Filterable by lifecycle `status`. "
                      + "Use `POST /advanced_search` for more granular criteria.")
   @ApiResponse(responseCode = "200", description = "Paginated search results")
   @GetMapping(value = "/search")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'SEARCH_LIGNECOMMANDE') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<LigneCommandeListRestModel> search(
           @Parameter(description = "Full-text search term", required = true) @RequestParam(name = "searchTerm") String searchTerm,
           @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(name = "page", defaultValue = "0") int page,
           @Parameter(description = "Lifecycle state filter. Use `all` for no filter.") @RequestParam(name = "status", defaultValue = "all") String status,
           @Parameter(description = "Number of items per page", example = "10") @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
           @Parameter(description = "Sort field. Prefix with `-` for DESC.") @RequestParam(name = "sort", defaultValue = "-persistenceInfo.createDate") String sort) {

       PageRequest pageRequest = new PageRequest(page, pageSize, sort);

       LigneCommandeQuerySpec querySpec = new LigneCommandeQuerySpec();
       querySpec.setSearchTerm_toQuery(searchTerm);
       querySpec.setSearchPage(page);
       querySpec.setSearchPageSize(pageSize);

       if (StringUtils.isNotBlank(status) && !Objects.equals("all".toUpperCase(), status)) {
           querySpec.setSelectedStates(List.of(status));
       }

       PageResult pageResult = service.search(querySpec, pageRequest);
       return new ListRestResponse<>(pageResult, LigneCommandeListRestModel.class);
   }

  
  
  @ApiResponse(responseCode = "200", description = "Paginated list of entities for the user")
  @GetMapping(value = "/listItemsOfProduit")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'READ_LIGNECOMMANDE')")
  public ListRestResponse<LigneCommandeListRestModel> listItemsOfProduit(
          @Parameter(description = "Encoded identifier of the user (Produit)", required = true) @RequestParam("produitUid") String produitUid,
          @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(name = "page", defaultValue = "0") int page,
          @Parameter(description = "Lifecycle state filter") @RequestParam(name = "status", defaultValue = "") String status,
          @Parameter(description = "Number of items per page", example = "10") @RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
          @Parameter(description = "Optional sort field") @RequestParam(name = "sort", required = false) String sort) {

      PageRequest pageRequest = new PageRequest.Builder().page(page).size(pageSize).build();
      Produit produit = getPersistable(produitUid, Produit.class);
      Map params = new HashMap();
      params.put("status", status);

      PageResult pageResult = service.listItemsOfProduit(produit, pageRequest, params);
      return new ListRestResponse<>(pageResult, LigneCommandeListRestModel.class);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Entity found",
                   content = @Content(schema = @Schema(implementation = LigneCommande.class))),
      @ApiResponse(responseCode = "404", description = "No Entity found for this element")
  })
  @GetMapping(value = "/singleItemOfProduit")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'READ_LIGNECOMMANDE')")
  public LigneCommandeRestResponse singleItemOfProduit(
          @Parameter(description = "Encoded identifier of the user (Produit)", required = true) @RequestParam("produitUid") String produitUid) {
      Produit produit = getPersistable(produitUid, Produit.class);
      LigneCommande entity = service.getSingleItemOfProduit(produit);
      return new LigneCommandeRestResponse().populateFromEntity(entity);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Relation updated",
                   content = @Content(schema = @Schema(implementation = LigneCommande.class))),
      @ApiResponse(responseCode = "404", description = "Entity or its relation not found")
  })
  @PostMapping(value = "/{uid}/setManyToOneProduit")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'UPDATE_LIGNECOMMANDE')")
  public LigneCommandeRestResponse setManyToOneProduit(
          @Parameter(description = "Uid of the entity", required = true) @PathVariable(name = "uid") final String uid,
          @Parameter(description = "Uid of the relation to associate", required = true) @RequestParam(name = "produitUid") final String produitUid) {

      LigneCommande entity = getPersistable(uid, LigneCommande.class);
      Produit roleB = getPersistable(produitUid, Produit.class);
      entity.setProduit(persistableService.refresh(roleB));
      persistableService.merge(entity);

      return new LigneCommandeRestResponse().populateFromEntity(entity);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Relation removed"),
      @ApiResponse(responseCode = "404", description = "Relation not found")
  })
  @DeleteMapping(value = "/{uid}/removeManyToOneProduit")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'DELETE_LIGNECOMMANDE')")
  public SuccessRestResponse removeManyToOneProduit(
          @Parameter(description = "Uid of the entity", required = true) @PathVariable(name = "uid") final String uid) {

      LigneCommande entity = getPersistable(uid, LigneCommande.class);
      entity.setProduit(null);
      persistableService.merge(entity);

      return SuccessRestResponse.newOne();
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Success processing"),
      @ApiResponse(responseCode = "404", description = "Not found")
  })
  @GetMapping(value = "/{uid}/getManyToOneProduit")
  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_LIGNECOMMANDE', 'READ_LIGNECOMMANDE')")
  public ProduitRestResponse getManyToOneProduit(
          @Parameter(description = "Encoded comment identifier", required = true) @PathVariable(name = "uid") final String uid) {
      LigneCommande entity = getPersistable(uid, LigneCommande.class);
      Produit roleB = entity.getProduit();
      return new ProduitRestResponse().populateFromEntity(roleB);
  }
      
      
  

}
