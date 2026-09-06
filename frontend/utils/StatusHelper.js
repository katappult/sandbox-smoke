import React from 'react';

export const StatusHelper = {
	getDisplay,
	getDisplayForStatus,
	getAction,
	uiDisplay
}

function getAction(action){
	return  getDisplay()
}

function getDisplay(status, t) {
	const tr = (key, fallback) => t ? t(key) : fallback;
	if(status === 'NEW') return tr('status.NEW_action', 'Nouveau')
	if(status === 'DRAFT') return tr('status.DRAFT_action', 'Brouillon')
	if(status === 'ARCHIVED') return tr('status.ARCHIVED_action', 'Archiver')
	if(status === 'CONFIRMED') return tr('status.CONFIRMED_action', 'Confirmer')
	if(status === 'TO_DELIVER') return tr('status.TO_DELIVER_action', 'A Livrer')
	if(status === 'DELIVERED') return tr('status.DELIVERED_action', 'Livrer')
	if(status === 'CANCELED_BY_USER') return tr('status.CANCELED_action', 'Annuler')
	if(status === 'CANCELED_BY_USR') return tr('status.CANCELED_action', 'Annuler')
	if(status === 'CANCELED_BY_ADM') return tr('status.CANCELED_action', 'Annuler')
	if(status === 'DELIVERING') return tr('status.DELIVERING_action', 'En cours de livraison')
	if(status === 'PUBLISHED') return tr('status.PUBLISHED_action', 'Publier')
	if(status === 'PENDING') return tr('status.PENDING_action', 'En attente')
	if(status === 'PAYED') return tr('status.PAYED_action', 'Payer')
	if(status === 'CANCELLED') return tr('status.CANCELED_action', 'Annuler')
	if(status === 'OUT_OF_STOCK') return tr('status.OUT_OF_STOCK_action', 'En rupture de stock')
	if(status === 'SUSPENDED') return tr('status.SUSPENDED_action', 'Suspendu')
	if(status === 'DISCONTINUED') return tr('status.DISCONTINUED_action', 'Indisponible')
	if(status === 'RETIRED') return tr('status.RETIRED_action', 'Retirer')
	if(status === 'AVALAIBLE') return tr('status.AVAILABLE_action', 'Disponible')
	if(status === 'AVAILABLE') return tr('status.AVAILABLE_action', 'Disponible')
	if(status === 'IN_VALIDATION') return tr('status.IN_VALIDATION_action', 'Valider')
	if(status === 'LOCKED_MEMBER') return tr('status.LOCKED_MEMBER_action', 'Bloquer')
	if(status === 'DRAFT_STATE') return tr('status.DRAFT_action', 'Brouillon')
	if(status === 'REQUEST_IN_PROGRESS') return tr('status.REQUEST_IN_PROGRESS_action', 'En cours')
	if(status === 'RETIRED_MEMBER') return tr('status.RETIRED_action', 'Retirer')
	if(status === 'OBSELETE_STATE') return tr('status.OBSOLETE_action', 'Obsolete')
	if(status === 'PRE_RELEASE_STATE') return tr('status.PRE_RELEASE_action', 'En attente de validation')
	if(status === 'IN_WORK') return tr('status.IN_WORK_action', 'Reserver')
	if(status === 'RELEASED_STATE') return tr('status.RELEASED_action', 'Valider')
	if(status === 'VALID_MEMBER') return tr('status.VALID_MEMBER_action', 'Membre')
	if(status === 'PROMOTE') return tr('status.PROMOTE_action', 'PROMOUVOIR LE STATUT')
	if(status === 'SET_STATE') return tr('status.SET_STATE_action', 'CHANGER LE STATUT')
	if(status === 'ADMIN_SET_STATE') return tr('status.SET_STATE_action', 'CHANGER LE STATUT')
	if(status === 'REVISE') return tr('status.REVISE_action', 'REVISER')
	if(status === 'ACCEPTED') return tr('status.ACCEPTED_action', 'ACCEPTER')
	if(status === 'REFUSED') return tr('status.REFUSED_action', 'REFUSER')
	if(status === 'CLOSED') return tr('status.CLOSED_action', 'FERMER')
	return status
}

function getDisplayForStatus(status, t) {
	const tr = (key, fallback) => t ? t(key) : fallback;
	if(!status) return ""
	if(status.toUpperCase() === 'NEW') return tr('status.NEW', 'Nouveau')
	if(status.toUpperCase() === 'DRAFT') return tr('status.DRAFT', 'Brouillon')
	if(status.toUpperCase() === 'ARCHIVED') return tr('status.ARCHIVED', 'Archivé')
	if(status.toUpperCase() === 'CONFIRMED') return tr('status.CONFIRMED', 'Confirmé')
	if(status.toUpperCase() === 'TO_DELIVER') return tr('status.TO_DELIVER', 'À livrer')
	if(status.toUpperCase() === 'DELIVERED') return tr('status.DELIVERED', 'Livré')
	if(status.toUpperCase() === 'CANCELED_BY_USER') return tr('status.CANCELED', 'Annulé')
	if(status.toUpperCase() === 'CANCELED_BY_USR') return tr('status.CANCELED', 'Annulé')
	if(status.toUpperCase() === 'CANCELED_BY_ADM') return tr('status.CANCELED', 'Annulé')
	if(status.toUpperCase() === 'DELIVERING') return tr('status.DELIVERING', 'En livraison')
	if(status.toUpperCase() === 'PUBLISHED') return tr('status.PUBLISHED', 'Publié')
	if(status.toUpperCase() === 'PENDING') return tr('status.PENDING', 'En attente')
	if(status.toUpperCase() === 'PAYED') return tr('status.PAYED', 'Payé')
	if(status.toUpperCase() === 'CANCELLED') return tr('status.CANCELED', 'Annulé')
	if(status.toUpperCase() === 'OUT_OF_STOCK') return tr('status.OUT_OF_STOCK', 'Rupture de stock')
	if(status.toUpperCase() === 'SUSPENDED') return tr('status.SUSPENDED', 'Suspendu')
	if(status.toUpperCase() === 'DISCONTINUED') return tr('status.DISCONTINUED', 'Indisponible')
	if(status.toUpperCase() === 'RETIRED') return tr('status.RETIRED', 'Retiré')
	if(status.toUpperCase() === 'AVALAIBLE') return tr('status.AVAILABLE', 'Disponible')
	if(status.toUpperCase() === 'AVAILABLE') return tr('status.AVAILABLE', 'Disponible')
	if(status.toUpperCase() === 'IN_VALIDATION') return tr('status.IN_VALIDATION', 'Validation en cours')
	if(status.toUpperCase() === 'LOCKED_MEMBER') return tr('status.LOCKED_MEMBER', 'Bloqué')
	if(status.toUpperCase() === 'DRAFT_STATE') return tr('status.DRAFT', 'Brouillon')
	if(status.toUpperCase() === 'REQUEST_IN_PROGRESS') return tr('status.REQUEST_IN_PROGRESS', 'En cours')
	if(status.toUpperCase() === 'RETIRED_MEMBER') return tr('status.RETIRED', 'Retiré')
	if(status.toUpperCase() === 'OBSELETE_STATE') return tr('status.OBSOLETE', 'Obsolete')
	if(status.toUpperCase() === 'PRE_RELEASE_STATE') return tr('status.PRE_RELEASE', 'En attente de validation')
	if(status.toUpperCase() === 'IN_WORK') return tr('status.IN_WORK', 'Copie de travail')
	if(status.toUpperCase() === 'RELEASED_STATE') return tr('status.RELEASED', 'Validé')
	if(status.toUpperCase() === 'VALID_MEMBER') return tr('status.VALID_MEMBER', 'Membre')
	if(status.toUpperCase() === 'VALID') return tr('status.VALID', 'Validé')
	if(status.toUpperCase() === 'ACCEPTED') return tr('status.ACCEPTED', 'Accepté')
	if(status.toUpperCase() === 'REFUSED') return tr('status.REFUSED', 'Refusé')
	if(status.toUpperCase() === 'CLOSED') return tr('status.CLOSED', 'Fermé')
	return status
}

function uiDisplay(status, t){
	if(!status) return <></>
	const statusWithoutBlank = status.replace(/\s/g,'').toLowerCase();
	return <div className={'status-display ' + 'status-display-' + statusWithoutBlank}>
		<i className={'fa fa-lg fa-tag'}></i>
		<span>{getDisplayForStatus(status, t)}</span>
	</div>
}
