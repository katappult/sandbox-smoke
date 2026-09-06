package com.katappult.cloud.platform.generated;

import com.katappult.core.service.api.thumbed.IThumbStorageProvider;
import com.katappult.core.service.impl.DiskThumbStorageProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfiguration {

    @Bean
    public IThumbStorageProvider thumbStorageProvider() {
        return new DiskThumbStorageProvider();
    }

}
