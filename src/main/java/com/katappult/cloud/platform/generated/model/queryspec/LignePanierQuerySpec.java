package .model.queryspec;

import java.util.*;
import java.io.Serializable;
import com.katappult.core.model.BaseQuerySpec;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
@ToString
public class LignePanierQuerySpec extends BaseQuerySpec implements Serializable{

    private Integer quantiteMin = 0;
    private Integer quantiteMax = 5000;
    

}
