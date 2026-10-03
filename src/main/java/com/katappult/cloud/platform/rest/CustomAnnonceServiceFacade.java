package com.katappult.cloud.platform.rest;

import com.katappult.cloud.platform.generated.model.Annonce;
import com.katappult.cloud.platform.generated.model.rest.AnnonceListRestModel;
import com.katappult.cloud.platform.generated.model.rest.AnnonceRestResponse;
import com.katappult.cloud.platform.services.api.ICustomAnnonceService;
import com.katappult.core.rest.BaseKatappultRestService;
import com.katappult.core.rest.model.ListRestResponse;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("annonce")
@PreAuthorize("hasAnyAuthority('ADMIN_ENTITY_ANNONCE','UPDATE_ANNONCE') or hasRole('ROLE_SUPERADMIN')")
@RequiredArgsConstructor
public class CustomAnnonceServiceFacade extends BaseKatappultRestService {

    private final ICustomAnnonceService customAnnonceService;

    @PostMapping("/{uid}/validate")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AnnonceRestResponse validate(@PathVariable(name = "uid") String uid) {
        Annonce annonce = getPersistable(uid, Annonce.class);
        annonce = customAnnonceService.changeState(annonce, "VALIDEE");
        return new AnnonceRestResponse().populateFromEntity(annonce);
    }

    @PostMapping("/{uid}/refuse")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AnnonceRestResponse refuse(@PathVariable(name = "uid") String uid) {
        Annonce annonce = getPersistable(uid, Annonce.class);
        annonce = customAnnonceService.changeState(annonce, "REFUSEE");
        return new AnnonceRestResponse().populateFromEntity(annonce);
    }

    @GetMapping("/mine")
    @Transactional(readOnly = true)
    public ListRestResponse<AnnonceListRestModel> mine(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "pageSize", defaultValue = "20") int pageSize,
            @RequestParam(name = "sort", defaultValue = "-persistenceInfo.createDate") String sort) {

        PageRequest pageRequest = new PageRequest(page, pageSize, sort);
        Map<String, String> params = new HashMap<>();
        PageResult pageResult = customAnnonceService.listMine(pageRequest, params);
        return new ListRestResponse<>(pageResult, AnnonceListRestModel.class);
    }
}
