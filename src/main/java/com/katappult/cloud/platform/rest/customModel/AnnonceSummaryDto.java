package com.katappult.cloud.platform.rest.customModel;

import java.math.BigDecimal;

public record AnnonceSummaryDto(
    String uid,
    String titre,
    String description,
    BigDecimal prix,
    Boolean actif,
    String authorUid,
    String produitUid,
    String lifecycleState
) {}
