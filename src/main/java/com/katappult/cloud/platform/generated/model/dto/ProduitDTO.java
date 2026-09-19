package com.katappult.cloud.platform.generated.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serial;
import java.io.Serializable;
import java.util.*;
import lombok.*;
import java.math.BigDecimal;


@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ProduitDTO implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

    private String uid;
    private String fullId;

    private String titre;
    private String description;
    private BigDecimal prix;
    private Boolean enStock;
    

}
