import { createEntityService } from "@/services/utils/service.factory";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.
export const CommandeService = createEntityService("commande");

// FUNCTIONS
