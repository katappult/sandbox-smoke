package .model.dto;

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
public class LigneCommandeDTO implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

    private String uid;
    private String fullId;

    private Integer quantite;
    private BigDecimal prixUnitaire;
    

}
