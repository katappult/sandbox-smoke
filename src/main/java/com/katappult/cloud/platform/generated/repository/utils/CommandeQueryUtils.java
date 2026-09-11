package com.katappult.cloud.platform.generated.repository.utils;

import com.katappult.cloud.platform.generated.model.*;
import com.katappult.cloud.platform.generated.model.queryspec.*;
import com.katappult.core.utils.StringUtils;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;

import java.util.*;

public class CommandeQueryUtils {

    private static final String STATUS = "status";
    private static final String REGEX = ";";

    private CommandeQueryUtils(){}

    public static BooleanExpression search(CommandeQuerySpec querySpec, QCommande entity){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();
        if (querySpec.getSearchTerm_toQuery().isPresent()) {
            
        }

        
        if(Objects.nonNull(querySpec.getDateCommandeMin())){
            whereClause = whereClause.and(entity.dateCommande.goe(querySpec.getDateCommandeMin()));
        }
        if(Objects.nonNull(querySpec.getDateCommandeMax())){
            whereClause = whereClause.and(entity.dateCommande.loe(querySpec.getDateCommandeMax()));
        }

       if (!querySpec.getSelectedStates().isEmpty()) {
           whereClause = whereClause.and(entity.lifecycleInfo().currentState.in(querySpec.getSelectedStates()));
       }

        return whereClause;
    }

    public static BooleanExpression listQuery(QCommande entity, Map<String, String> params){
        if (Objects.nonNull(params) && params.size() > 0) {
            String status = params.get(STATUS);
            if (StringUtils.isNotBlank(status) && !status.equalsIgnoreCase("ALL")) {
                String[] allStatus = status.split(REGEX);
                return listQuery(entity, Arrays.asList(allStatus));
            }
        }

        return listQuery(entity);
    }

    public static BooleanExpression listQuery(QCommande entity){
        return listQuery(entity, new ArrayList<>());
    }

    public static BooleanExpression listQuery(QCommande entity , List<String> status){
        BooleanExpression whereClause = entity.containerInfo().container.isNotNull();

               if (Objects.nonNull(status) && status.size() > 0) {
            whereClause = whereClause.and(entity.lifecycleInfo().currentState.in(status));
       }

        return whereClause;
    }

    public static JPAQuery orderSpecifier(JPAQuery query, QCommande entity, Map<String, String> params){
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
