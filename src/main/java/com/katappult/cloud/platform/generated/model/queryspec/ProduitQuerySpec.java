package .model.queryspec;

import java.util.*;
import java.io.Serializable;
import com.katappult.core.model.BaseQuerySpec;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
@ToString
public class ProduitQuerySpec extends BaseQuerySpec implements Serializable{

    private Integer quantiteStockMin = 0;
    private Integer quantiteStockMax = 5000;
    

}
