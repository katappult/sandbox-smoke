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
import com.katappult.cloud.platform.generated.model.queryspec.PanierQuerySpec;
import com.katappult.cloud.platform.generated.model.rest.*;
import com.katappult.core.rest.model.*;
import com.katappult.cloud.platform.generated.model.*;
import com.katappult.core.model.account.UserAccount.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.*;

import .services.api.IPanierService;
import .model.*;



@io.swagger.v3.oas.annotations.tags.Tag(name = "Panier", description = "Manages Panier and its relations. ")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("panier")
public class PanierGeneratedServiceFacade extends BaseKatappultRestService {

    private final IPanierService service;
    private final IPersistableService persistableService;
    private final Provider<UIAttributes> uiAttributesProvider;

    public PanierGeneratedServiceFacade(IPanierService service, IPersistableService persistableService,
        Provider<UIAttributes> uiAttributesProvider) {

      this.service = service;
      this.persistableService = persistableService;
      this.uiAttributesProvider = uiAttributesProvider;
    }


   @Operation(summary = "Create Panier",
                  description = "Creates a new Panier."
                          + "All relationships of an entity can be specified in the form either by their fullId (for automatic processing) or by their uid.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity created successfully",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class))),
       @ApiResponse(responseCode = "200", description = "Validation error — response body contains error messages",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class)))
   })
   @PostMapping
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'CREATE_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public PanierRestResponse create(@RequestBody PanierRestRequest request) {

       PanierRestResponse response = new PanierRestResponse();

       UIAttributes uiAttributes = uiAttributesProvider.get();
       uiAttributes.from(request);

       uiAttributes.additionalAttributes("ownerFullId", request.getParam("ownerFullId"));
// ENRICH CREATE ENDPOINT
       Panier created = service.create(uiAttributes);

       return response.populateFromEntity(created);
   }


   @Operation(summary = "Get Panier details", description = "Returns the full data of the entity.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity found",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @GetMapping("/{uid}")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public PanierRestResponse details(
           @Parameter(description = "Identifier (the `uid` field from a previous response)", required = true)
           @PathVariable(name = "uid") final String uid) {
       PanierRestResponse response = new PanierRestResponse();
       Panier entity = getPersistable(uid, Panier.class);
       return response.populateFromEntity(entity);
   }


   @Operation(summary = "Bulk delete Panier",
              description = "Deletes multiple entities at once. The request body must contain a list of uuid.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity deleted successfully"),
       @ApiResponse(responseCode = "404", description = "One or more identifiers not found")
   })
   @DeleteMapping(value = "/deleteElements")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'DELETE_PANIER') or hasRole('ROLE_SUPERADMIN') or hasRole('ROLE_ADMIN')")
   public SuccessRestResponse deleteElements(@RequestBody DeleteRequest request) {

       List<Persistable> toDelete = new ArrayList<>();

       for (int i = 0; i < request.getIdentifiers().size(); i++) {
           String uid = request.getIdentifiers().get(i);
           Persistable object = getPersistable(uid, Panier.class);
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
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'DELETE_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public SuccessRestResponse delete(
           @Parameter(description = "Uid of the entity", required = true)
           @PathVariable(name = "uid") final String uid) {
       Panier entity = getPersistable(uid, Panier.class);
       service.delete(entity);
       return SuccessRestResponse.newOne();
   }


   @Operation(summary = "Partially update entity",
              description = "Applies a JSON patch to the provided fields only. Fields not present in the body are left unchanged. "
                      + "Patchable entity raw fields, do not include relation fields.")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity updated",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @PatchMapping("/{uid}")
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'UPDATE_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public PanierRestResponse patch(
           @Parameter(description = "Identifier of the entity", required = true)
           @PathVariable(name = "uid") final String uid,
           @Parameter(description = "Json containing attributes to patch", required = true)
           @RequestBody Map<String, Object> json) {
       Panier entity = getPersistable(uid, Panier.class);
       entity = service.patch(json, entity);
       return new PanierRestResponse().populateFromEntity(entity);
   }


   @Operation(summary = "Fully update an entity",
              description = "Replaces the entity fields with those from the request body. "
                      + "**Warning:** the relation of the entity are not processed during update. ")
   @ApiResponses({
       @ApiResponse(responseCode = "200", description = "Entity updated",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class))),
       @ApiResponse(responseCode = "400", description = "Validation error — response body contains error messages",
                    content = @Content(schema = @Schema(implementation = PanierRestResponse.class))),
       @ApiResponse(responseCode = "404", description = "Entity not found")
   })
   @PutMapping("/{uid}")
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'UPDATE_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public PanierRestResponse update(
           @Parameter(description = "Uid identifier", required = true)
           @PathVariable(name = "uid") final String uid,
           @RequestBody PanierRestRequest request) {

       PanierRestResponse response = new PanierRestResponse();

       UIAttributes uiAttributes = uiAttributesProvider.get();
       uiAttributes.from(request);

       Panier entity = getPersistable(uid, Panier.class);
       uiAttributes.getTarget().setOid(entity.getOid());

       Panier updated = service.update(uiAttributes);
       return response.populateFromEntity(updated);
   }


   @Operation(summary = "List of paginated entities",
              description = "Returns a paginated list of paginated entities. "
                      + "If `searchTerm` is provided, performs a full-text search (delegates to `search()`). "
                      + "Otherwise, returns the list filtered by `status` and sorted by `sort`. "
                      + "Sort syntax: `field` for ASC, `-field` for DESC.")
   @ApiResponse(responseCode = "200", description = "Paginated list of entities")
   @GetMapping(value = "/list")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'LIST_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<PanierListRestModel> list(
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
           PanierQuerySpec querySpec = new PanierQuerySpec();
           querySpec.setSearchTerm_toQuery(searchTerm);
           querySpec.setSearchPage(page);
           querySpec.setSearchPageSize(pageSize);

           pageResult = service.search(querySpec, pageRequest);
       } else {
           pageResult = service.list(pageRequest, params);
       }

       return new ListRestResponse<>(pageResult, PanierListRestModel.class);
   }


   @Operation(summary = "Fetch entities by uuid",
              description = "Returns a list of entity matching the given encoded uuid. Useful for batch fetching.")
   @ApiResponse(responseCode = "200", description = "List of matching entities")
   @GetMapping(value = "/listFromUids")
   @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'SEARCH_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<PanierListRestModel> listFromUids(
           @Parameter(description = "List of encoded identifiers (repeated parameter). Example: `?identifier=abc&identifier=def`", required = true)
           @RequestParam(name = "identifier") List<String> identifiers) {
       var list = identifiers.stream()
               .map(uid -> getPersistable(uid, Panier.class))
               .toList();
       return new ListRestResponse<>(list, PanierListRestModel.class);
   }


   @Operation(summary = "Advanced search",
              description = "Paginated search using a `PanierQuerySpec` body. "
                      + "Available fields: `searchTerm` (full-text), `searchPage` (0-based), `searchPageSize`, `selectedStates` (list of lifecycle states). "
                      + "Pagination is driven by the QuerySpec itself.")
   @ApiResponse(responseCode = "200", description = "Paginated search results")
   @PostMapping(value = "/advanced_search")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'SEARCH_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<PanierListRestModel> advancedSearch(@RequestBody PanierQuerySpec querySpec) {

       PageRequest pageRequest = new PageRequest.Builder()
               .page(querySpec.getSearchPage())
               .size(querySpec.getSearchPageSize()).build();

       PageResult pageResult = service.search(querySpec, pageRequest);
       return new ListRestResponse<>(pageResult, PanierListRestModel.class);
   }


   @Operation(summary = "Search entities",
              description = "Full-text search by `searchTerm`. Filterable by lifecycle `status`. "
                      + "Use `POST /advanced_search` for more granular criteria.")
   @ApiResponse(responseCode = "200", description = "Paginated search results")
   @GetMapping(value = "/search")
   @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'SEARCH_PANIER') or hasRole('ROLE_SUPERADMIN')")
   public ListRestResponse<PanierListRestModel> search(
           @Parameter(description = "Full-text search term", required = true) @RequestParam(name = "searchTerm") String searchTerm,
           @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(name = "page", defaultValue = "0") int page,
           @Parameter(description = "Lifecycle state filter. Use `all` for no filter.") @RequestParam(name = "status", defaultValue = "all") String status,
           @Parameter(description = "Number of items per page", example = "10") @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
           @Parameter(description = "Sort field. Prefix with `-` for DESC.") @RequestParam(name = "sort", defaultValue = "-persistenceInfo.createDate") String sort) {

       PageRequest pageRequest = new PageRequest(page, pageSize, sort);

       PanierQuerySpec querySpec = new PanierQuerySpec();
       querySpec.setSearchTerm_toQuery(searchTerm);
       querySpec.setSearchPage(page);
       querySpec.setSearchPageSize(pageSize);

       if (StringUtils.isNotBlank(status) && !Objects.equals("all".toUpperCase(), status)) {
           querySpec.setSelectedStates(List.of(status));
       }

       PageResult pageResult = service.search(querySpec, pageRequest);
       return new ListRestResponse<>(pageResult, PanierListRestModel.class);
   }

  

  @PostMapping(value = "/{uid}/oneToManyLignePanier/{lignePanierUid}")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'UPDATE_PANIER')")
  public LignePanierRestResponse addOneToManyLignePanier(@PathVariable(name = "uid") final String uid,
                                                         @PathVariable(name = "lignePanierUid") final String lignePanierUid)  {

    LignePanierRestResponse response = new LignePanierRestResponse();

    Panier entity = getPersistable(uid, Panier.class);
    LignePanier roleB = getPersistable(lignePanierUid, LignePanier.class);

    service.addLignePanier(entity, roleB);
    return response.populateFromEntity(roleB);
  }

  @DeleteMapping(value = "/{uid}/oneToManyLignePanier/{lignePanierUid}")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'DELETE_PANIER')")
  public SuccessRestResponse removeOneToManyLignePanier(@PathVariable(name = "uid") final String uid,
                                                        @PathVariable(name = "lignePanierUid") final String lignePanierUid)  {

    Panier entity = getPersistable(uid, Panier.class);
    LignePanier roleB = getPersistable(lignePanierUid, LignePanier.class);

    service.removeLignePanier(entity, roleB);
    return SuccessRestResponse.newOne();
  }

  @GetMapping(value = "/{uid}/oneToManyLignePanier")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public ListRestResponse<LignePanierListRestModel> getAllOneToManyLignePanier(@PathVariable(name = "uid") final String uid)  {

    Panier entity = getPersistable(uid, Panier.class);
    List<LignePanier> roleBs = service.getAllLignePanier(entity);
    return new ListRestResponse<>(roleBs, LignePanierListRestModel.class);
  }

  @GetMapping(value = "/{uid}/oneToManyLignePanierNavigate")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public ListRestResponse<LignePanierListRestModel> navigateOneToManyLignePanier(@PathVariable(name = "uid") final String uid,
                                                  @RequestParam("page") int page,
                                                  @RequestParam("pageSize") int pageSize)  {

    Panier entity = getPersistable(uid, Panier.class);

    PageRequest pageRequest = new PageRequest(page, pageSize);
    PageResult pageResult = service.navigateLignePanier(entity, pageRequest);
    return new ListRestResponse<>(pageResult, LignePanierListRestModel.class);
  }

  @GetMapping(value = "/oneToManyLignePanierInverse")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public PanierRestResponse oneToManyLignePanierInverse(@RequestParam(name = "lignePanierUid") final String lignePanierUid)  {

      PanierRestResponse response = new PanierRestResponse();

      LignePanier entity = getPersistable(lignePanierUid, LignePanier.class);
      Panier roleA = service.getOneToManyLignePanierInverse(entity);
      return response.populateFromEntity(roleA);
  }

  
  @ApiResponse(responseCode = "200", description = "Paginated list of entities for the user")
  @GetMapping(value = "/listItemsOfOwner")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public ListRestResponse<PanierListRestModel> listItemsOfOwner(
          @Parameter(description = "Encoded identifier of the user (UserAccount)", required = true) @RequestParam("ownerUid") String ownerUid,
          @Parameter(description = "Page number (0-based)", example = "0") @RequestParam(name = "page", defaultValue = "0") int page,
          @Parameter(description = "Lifecycle state filter") @RequestParam(name = "status", defaultValue = "") String status,
          @Parameter(description = "Number of items per page", example = "10") @RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
          @Parameter(description = "Optional sort field") @RequestParam(name = "sort", required = false) String sort) {

      PageRequest pageRequest = new PageRequest.Builder().page(page).size(pageSize).build();
      UserAccount owner = getPersistable(ownerUid, UserAccount.class);
      Map params = new HashMap();
      params.put("status", status);

      PageResult pageResult = service.listItemsOfOwner(owner, pageRequest, params);
      return new ListRestResponse<>(pageResult, PanierListRestModel.class);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Entity found",
                   content = @Content(schema = @Schema(implementation = Panier.class))),
      @ApiResponse(responseCode = "404", description = "No Entity found for this element")
  })
  @GetMapping(value = "/singleItemOfOwner")
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public PanierRestResponse singleItemOfOwner(
          @Parameter(description = "Encoded identifier of the user (UserAccount)", required = true) @RequestParam("ownerUid") String ownerUid) {
      UserAccount owner = getPersistable(ownerUid, UserAccount.class);
      Panier entity = service.getSingleItemOfOwner(owner);
      return new PanierRestResponse().populateFromEntity(entity);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Relation updated",
                   content = @Content(schema = @Schema(implementation = Panier.class))),
      @ApiResponse(responseCode = "404", description = "Entity or its relation not found")
  })
  @PostMapping(value = "/{uid}/setManyToOneOwner")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'UPDATE_PANIER')")
  public PanierRestResponse setManyToOneOwner(
          @Parameter(description = "Uid of the entity", required = true) @PathVariable(name = "uid") final String uid,
          @Parameter(description = "Uid of the relation to associate", required = true) @RequestParam(name = "ownerUid") final String ownerUid) {

      Panier entity = getPersistable(uid, Panier.class);
      UserAccount roleB = getPersistable(ownerUid, UserAccount.class);
      entity.setOwner(persistableService.refresh(roleB));
      persistableService.merge(entity);

      return new PanierRestResponse().populateFromEntity(entity);
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Relation removed"),
      @ApiResponse(responseCode = "404", description = "Relation not found")
  })
  @DeleteMapping(value = "/{uid}/removeManyToOneOwner")
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'DELETE_PANIER')")
  public SuccessRestResponse removeManyToOneOwner(
          @Parameter(description = "Uid of the entity", required = true) @PathVariable(name = "uid") final String uid) {

      Panier entity = getPersistable(uid, Panier.class);
      entity.setOwner(null);
      persistableService.merge(entity);

      return SuccessRestResponse.newOne();
  }


  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Success processing"),
      @ApiResponse(responseCode = "404", description = "Not found")
  })
  @GetMapping(value = "/{uid}/getManyToOneOwner")
  @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
  @PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_PANIER', 'READ_PANIER')")
  public UserAccountRestResponse getManyToOneOwner(
          @Parameter(description = "Encoded comment identifier", required = true) @PathVariable(name = "uid") final String uid) {
      Panier entity = getPersistable(uid, Panier.class);
      UserAccount roleB = entity.getOwner();
      return new UserAccountRestResponse().populateFromEntity(roleB);
  }
      
      
  

}
