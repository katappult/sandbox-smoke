package com.katappult.cloud.platform.generated.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serial;
import java.io.Serializable;
import java.util.*;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class CategorieDTO implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

    private String uid;
    private String fullId;

    private String titre;
    

}
