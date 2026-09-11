package com.katappult.cloud.platform.generated.repository.utils;

import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import com.katappult.core.utils.StringUtils;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;

import java.util.*;

public class ProduitQueryUtils {

    private static final String STATUS = "status";
    private static final String REGEX = ";";

    private ProduitQueryUtils(){}

    public static BooleanExpression search(ProduitQuerySpec querySpec, QProduit entity){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();
        if (querySpec.getSearchTerm_toQuery().isPresent()) {
            whereClause = whereClause.and(
		entity.libelle.likeIgnoreCase("%" + querySpec.getSearchTerm_toQuery().get() + "%")
);

        }

        
        if(Objects.nonNull(querySpec.getQuantiteStockMin())){
            whereClause = whereClause.and(entity.quantiteStock.goe(querySpec.getQuantiteStockMin()));
        }
        if(Objects.nonNull(querySpec.getQuantiteStockMax())){
            whereClause = whereClause.and(entity.quantiteStock.loe(querySpec.getQuantiteStockMax()));
        }

        return whereClause;
    }

    public static BooleanExpression listQuery(QProduit entity, Map<String, String> params){
        if (Objects.nonNull(params) && params.size() > 0) {
            String status = params.get(STATUS);
            if (StringUtils.isNotBlank(status) && !status.equalsIgnoreCase("ALL")) {
                String[] allStatus = status.split(REGEX);
                return listQuery(entity, Arrays.asList(allStatus));
            }
        }

        return listQuery(entity);
    }

    public static BooleanExpression listQuery(QProduit entity){
        return listQuery(entity, new ArrayList<>());
    }

    public static BooleanExpression listQuery(QProduit entity , List<String> status){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();

        
        return whereClause;
    }

    public static JPAQuery orderSpecifier(JPAQuery query, QProduit entity, Map<String, String> params){
        String sort = params.get("sort");
        String order = "ORDER_BY_CREATE_DATE_ASC";
        if(StringUtils.isNotBlank(sort)){
            String[] orders = sort.split(";");
            order = orders[0];
        }

        if(order.equals("ORDER_BY_CREATE_DATE_ASC")){
            query = (JPAQuery) query.orderBy(entity.persistenceInfo().createDate.asc());
        }

        if(order.equals("ORDER_BY_CREATE_DATE_DESC")){
            query = (JPAQuery) query.orderBy(entity.persistenceInfo().createDate.desc());
        }

        return query;
    }

}
