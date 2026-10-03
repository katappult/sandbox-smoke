package com.katappult.cloud.platform.rest.dto;

import java.math.BigDecimal;

public record AnnonceDto(
    String uid,
    String titre,
    String description,
    BigDecimal prix,
    Boolean actif,
    String authorUid,
    String produitUid,
    String lifecycleState
) {}
