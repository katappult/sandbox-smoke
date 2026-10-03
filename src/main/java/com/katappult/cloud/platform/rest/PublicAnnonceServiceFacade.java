package com.katappult.cloud.platform.rest;

import com.katappult.cloud.platform.rest.customModel.AnnonceSummaryDto;
import com.katappult.cloud.platform.services.custom.CustomAnnonceService;
import com.katappult.core.rest.BaseKatappultRestService;
import com.katappult.core.rest.ListRestResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pub/v1/annonce")
public class PublicAnnonceServiceFacade extends BaseKatappultRestService {

    private final CustomAnnonceService customAnnonceService;

    public PublicAnnonceServiceFacade(CustomAnnonceService customAnnonceService) {
        this.customAnnonceService = customAnnonceService;
    }

    @GetMapping
    public ResponseEntity<ListRestResponse<AnnonceSummaryDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "persistenceInfo.createDate"));
        Page<AnnonceSummaryDto> resultPage = customAnnonceService.listValidated(pageable);
        return ok(ListRestResponse.of(resultPage));
    }
}
