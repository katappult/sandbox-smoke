import React, {useEffect, useState} from 'react';
import {PanierService} from "_services/_generated/Panier.services";
import {DataTable, WaitingPane, EmptyPane} from "_components/_common";
import {coreUri} from '_helpers/CoreUri';
import { commons } from '_helpers/commons.js';

const ROOT_ADMIN_URL = '/admin?tab=home&view=panier';

function PanierInverseOneToMany(props)  {

    const[loading, setLoading] = useState(true);
    const[item, setItem] = useState();

    useEffect(()=>{
        loadItem();
    },[])

    const loadItem = (pageIndex) => {
        setLoading(true)
        PanierService.getOneToManyLignePanierInverse(props.entityId).then(response => {
            setItem(response.data)
            setLoading(false)
        });
    }

    const doForwardDetails = (e, id) => {
        if(e) e.preventDefault();
        let tabName = commons.getValueFromUrl('tab');
        const url = coreUri.backOfficeViewURL(tabName, 'panier', ["rootId=" +  id]);
        props.history.push(url);
    }

    const itemsDatatableRowItemName = (v, i) => {
        const valueToDisplay = v.not_defined_value ? v.not_defined_value : '> Infos';
        return <td className={'td-left table-info-link'}>
            <a href='#/details' onClick={(e) => doForwardDetails(e,v.id)}>
                {valueToDisplay}
            </a>
        </td>
    }

    const itemsDatatableRowItemAction = (v, i) => {
        return <td className={'td-right'}>
            <div className={'btn-toolbar-right'}>
                <button onClick={(e) => doForwardDetails(e, v.id)}>
                    <i className={'fa fa-lg fa-info'}></i>
                </button>
            </div>
        </td>
    }

    const itemsDatatableConfig = {
        columnsConfig: [
            {name:'attr1', displayComponent: (v, i) => itemsDatatableRowItemName(v,i), dataField: 'attributes', headerClass: 'td-left'},
            // ITEMS_DATATABLE_COLS
            {dataField: 'attributes', displayComponent: (v, i) => itemsDatatableRowItemAction(v, i)}
        ]
    }

     if(loading || !item){
        return <WaitingPane />
    }

    const attributes = item.attributes;
    if(!attributes || Object.keys(attributes).length < 1){
        return <EmptyPane />
    }

    return <DataTable items={JSON.stringify([item])}
                      tableConfig={itemsDatatableConfig}
                      displayTotalElements={true}
                      paginate={true}/>
}

export default PanierInverseOneToMany;
