package com.katappult.cloud.platform.rest;

import com.katappult.cloud.platform.rest.dto.AnnonceDto;
import com.katappult.cloud.platform.rest.dto.CreateAnnonceRequest;
import com.katappult.cloud.platform.services.custom.CustomAnnonceService;
import com.katappult.core.rest.BaseKatappultRestService;
import com.katappult.core.rest.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/annonce")
@RequiredArgsConstructor
public class CustomAnnonceServiceFacade extends BaseKatappultRestService {

    private final CustomAnnonceService customAnnonceService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ROLE_USER')")
    @Operation(summary = "Créer une annonce (auteur = compte connecté)")
    @ApiResponse(responseCode = "200", description = "Annonce créée")
    @ApiResponse(responseCode = "401", description = "Non authentifié")
    @ApiResponse(responseCode = "403", description = "Rôle insuffisant ou compte inactif")
    public ResponseEntity<RestResponse<AnnonceDto>> create(@Valid @RequestBody CreateAnnonceRequest request) {
        return ok(customAnnonceService.createAnnonce(request));
    }

    @PostMapping("/{uid}/valider")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @Operation(summary = "Valider une annonce")
    public ResponseEntity<RestResponse<AnnonceDto>> valider(@PathVariable String uid) {
        return ok(customAnnonceService.valider(uid));
    }

    @PostMapping("/{uid}/refuser")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_SUPERADMIN')")
    @Operation(summary = "Refuser une annonce")
    public ResponseEntity<RestResponse<AnnonceDto>> refuser(@PathVariable String uid) {
        return ok(customAnnonceService.refuser(uid));
    }
}
