package com.katappult.cloud.platform.generated.handler;

import com.katappult.core.rest.utils.AbstractRestExceptionHandler;
import com.katappult.core.service.api.ErrorCodeService;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
@Order(1)
public class RestExceptionHandler extends AbstractRestExceptionHandler {

    public RestExceptionHandler(ErrorCodeService errorCodeService) {
        super(errorCodeService);
    }
}