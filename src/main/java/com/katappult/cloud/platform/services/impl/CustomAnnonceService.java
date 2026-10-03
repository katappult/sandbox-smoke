package com.katappult.cloud.platform.services.impl;

import com.katappult.cloud.platform.generated.model.Annonce;
import com.katappult.cloud.platform.generated.services.api.IAnnonceService;
import com.katappult.cloud.platform.services.api.ICustomAnnonceService;
import com.katappult.core.utils.pagination.PageRequest;
import com.katappult.core.utils.pagination.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomAnnonceService implements ICustomAnnonceService {

    private final IAnnonceService annonceService;
    private final ApplicationContext applicationContext;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Annonce changeState(Annonce annonce, String targetState) {
        Object lifecycleService = applicationContext.getBean("lifecycleManagedService");
        try {
            Method changeStateMethod = java.util.Arrays.stream(lifecycleService.getClass().getMethods())
                    .filter(m -> "changeState".equals(m.getName()) && m.getParameterCount() == 4)
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("No lifecycle changeState method found"));
            return (Annonce) changeStateMethod.invoke(
                    lifecycleService,
                    annonce,
                    targetState,
                    "Modération annonce",
                    "validate"
            );
        } catch (Exception e) {
            throw new RuntimeException("Unable to change Annonce lifecycle state", e);
        }
    }

    @Override
    public PageResult listMine(PageRequest pageRequest, Map<String, String> params) {
        // Temporary list implementation. The “mine” filtering can be restored
        // after obtaining the correct current-user API.
        return annonceService.list(pageRequest, params);
    }
}
