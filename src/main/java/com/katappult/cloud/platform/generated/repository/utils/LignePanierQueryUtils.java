package com.katappult.cloud.platform.generated.repository.utils;

import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import com.katappult.core.utils.StringUtils;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;

import java.util.*;

public class LignePanierQueryUtils {

    private static final String STATUS = "status";
    private static final String REGEX = ";";

    private LignePanierQueryUtils(){}

    public static BooleanExpression search(LignePanierQuerySpec querySpec, QLignePanier entity){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();
        if (querySpec.getSearchTerm_toQuery().isPresent()) {
            
        }

        
        if(Objects.nonNull(querySpec.getQuantiteMin())){
            whereClause = whereClause.and(entity.quantite.goe(querySpec.getQuantiteMin()));
        }
        if(Objects.nonNull(querySpec.getQuantiteMax())){
            whereClause = whereClause.and(entity.quantite.loe(querySpec.getQuantiteMax()));
        }

        return whereClause;
    }

    public static BooleanExpression listQuery(QLignePanier entity, Map<String, String> params){
        if (Objects.nonNull(params) && params.size() > 0) {
            String status = params.get(STATUS);
            if (StringUtils.isNotBlank(status) && !status.equalsIgnoreCase("ALL")) {
                String[] allStatus = status.split(REGEX);
                return listQuery(entity, Arrays.asList(allStatus));
            }
        }

        return listQuery(entity);
    }

    public static BooleanExpression listQuery(QLignePanier entity){
        return listQuery(entity, new ArrayList<>());
    }

    public static BooleanExpression listQuery(QLignePanier entity , List<String> status){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();

        
        return whereClause;
    }

    public static JPAQuery orderSpecifier(JPAQuery query, QLignePanier entity, Map<String, String> params){
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
