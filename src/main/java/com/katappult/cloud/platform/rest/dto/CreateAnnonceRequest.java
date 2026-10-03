package com.katappult.cloud.platform.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateAnnonceRequest(
    @NotBlank String titre,
    String description,
    @NotNull BigDecimal prix,
    @NotNull Boolean actif,
    @NotBlank String produitUid
) {}
