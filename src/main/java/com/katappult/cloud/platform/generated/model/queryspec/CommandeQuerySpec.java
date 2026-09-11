package .model.queryspec;

import java.util.*;
import java.io.Serializable;
import com.katappult.core.model.BaseQuerySpec;
import lombok.*;


@NoArgsConstructor
@Getter
@Setter
@ToString
public class CommandeQuerySpec extends BaseQuerySpec implements Serializable{

    private Date dateCommandeMin;
    private Date dateCommandeMax;
    

}
