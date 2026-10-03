package com.katappult.cloud.platform.dao.api;

import com.katappult.cloud.platform.generated.model.Annonce;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICustomAnnonceRepository {
    Page<Annonce> findValidated(Pageable pageable);
}
