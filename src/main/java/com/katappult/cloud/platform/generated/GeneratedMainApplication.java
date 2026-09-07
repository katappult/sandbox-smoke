package com.katappult.cloud.platform.generated;

import com.katappult.core.MainKatappultApplication;
import com.katappult.core.conf.KatappultCoreRootConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Import;


@SpringBootApplication
@Import({
        KatappultCoreRootConfiguration.class,
        StorageConfiguration.class,
})
public class GeneratedMainApplication extends MainKatappultApplication {

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     */
    public static void main(String[] args) {

        setDefaultSystemSettings();

        new SpringApplicationBuilder(GeneratedMainApplication.class)
                .logStartupInfo(false)
                .run(args);
    }
}
