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
public class CommandeDTO implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

    private String uid;
    private String fullId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date dateCommande;
    private BigDecimal montantTotal;
    

}
