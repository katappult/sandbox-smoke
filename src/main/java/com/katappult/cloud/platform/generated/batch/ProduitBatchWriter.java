package com.katappult.cloud.platform.generated.batch;

import com.katappult.core.service.helpers.KatappultCoreServicesHelper;
import com.katappult.core.utils.ObjectIdentifierUtils;
import com.katappult.core.batch.bean.*;
import com.katappult.core.model.typed.*;
import com.katappult.core.service.api.typed.ITypeManagedService;
import org.springframework.batch.infrastructure.item.Chunk;

import com.katappult.cloud.platform.generated.model.Produit;
import com.katappult.cloud.platform.generated.services.api.IProduitService;
import org.springframework.batch.infrastructure.item.ItemWriter;
import org.springframework.context.annotation.Scope;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@Scope("step")
public class ProduitBatchWriter implements ItemWriter<AbstractLineBean> {

    private static final String ADD_ELEMENT_TOKEN = "ADD_";
    private static final String UPDATE_ELEMENT_TOKEN = "UPDATE_";
    private static final String FULL_ID = "fullId";

    private final KatappultCoreServicesHelper services;
    private final IProduitService service;
    private final ITypeManagedService typeManagedService;

    public ProduitBatchWriter(KatappultCoreServicesHelper services, IProduitService service, ITypeManagedService typeManagedService) {
        this.services = services;
        this.service = service;
        this.typeManagedService = typeManagedService;
    }

    @Override
    public void write(Chunk<? extends AbstractLineBean> chunk) throws Exception {

        chunk.getItems().forEach(lineChunk -> {
          ImportLineBean line = (ImportLineBean) lineChunk;
          String command = line.getCommand();

          if(command.startsWith(ADD_ELEMENT_TOKEN)){
              Produit entity = (Produit) line.getRootEntity();
              if(entity instanceof ITypeManaged typeManaged){
                    TypeManaged annotation = AnnotationUtils.findAnnotation(entity.getClass(), TypeManaged.class);
                    typeManagedService.setType(typeManaged, Objects.requireNonNull(annotation).rootType());
              }

              service.batchCreateFromImport(entity);
          }

          if(command.startsWith(UPDATE_ELEMENT_TOKEN)){
              Produit transientEntity = (Produit) line.getRootEntity();
              String fullId  = ObjectIdentifierUtils.decode((String) line.getExternalEntity(FULL_ID));
              Long id = ObjectIdentifierUtils.getId(fullId);
              transientEntity.setOid(id);

              service.batchUpdateFromImport(transientEntity);
          }
        });
    }
}
