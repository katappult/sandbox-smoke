package com.katappult.cloud.platform.services.api;

import com.katappult.cloud.platform.generated.model.Annonce;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;

import java.util.Map;

public interface ICustomAnnonceService {

    Annonce changeState(Annonce annonce, String targetState);

    PageResult listMine(PageRequest pageRequest, Map<String, String> params);
}
