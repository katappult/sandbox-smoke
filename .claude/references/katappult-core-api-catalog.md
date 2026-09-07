# Katappult-core — Catalogue des APIs disponibles

> **RÈGLE :** Avant de créer un endpoint REST ou un service JS, consulter ce catalog.
> Si l'API existe → utiliser l'existant, ne pas réimplémenter.

---

## APIs disponibles via `katappult-core` (dépendance Maven)

### Authentification (public)
| Chemin | Méthode | Description |
|---|---|---|
| `POST /core/api/pub/v1/security/auth/login` | Public | Login (username + password) → JWT |
| `POST /core/api/pub/v1/security/auth/post2FALogin` | Public | Valider code 2FA |
| `POST /core/api/pub/v1/security/auth/resend2FAValidationCode` | Public | Renvoyer code 2FA |

### Authentification (authentifié)
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `POST /core/api/v1/security/auth/logout` | Auth | Révoquer token courant | USER+ |
| `POST /core/api/v1/security/auth/token/generate` | Auth | Générer token personnel | USER+ |
| `GET /core/api/v1/security/auth/tokens` | Auth | Lister tokens personnels | USER+ |
| `GET /core/api/v1/security/auth/sessions/active` | Auth | Sessions actives | USER+ |
| `DELETE /core/api/v1/security/auth/sessions` | Auth | Révoquer mes sessions | USER+ |

### Compte utilisateur (profil)
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `GET /core/api/v1/user-principals/personalInfos` | GET | Infos personnelles | USER+ |
| `POST /core/api/v1/user-principals/personalInfos` | POST | Mettre à jour infos | USER+ |
| `PUT /core/api/v1/user-principals/updatePassword` | PUT | Changer mot de passe | USER+ |
| `POST /core/api/v1/user-principals/updateMailAndNickName` | POST | Maj email + pseudo | USER+ |
| `PATCH /core/api/v1/user-principals/enableTwoFactorsAuthentication` | PATCH | Activer 2FA | USER+ |
| `GET /core/api/v1/user-principals/isEmailInUse` | GET | Vérifier email | USER+ |

### Administration — Utilisateurs/Comptes
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `GET /core/api/v1/principals/account/list` | GET | Lister comptes (paginé) | ADMIN |
| `GET /core/api/v1/principals/account/{uid}/roles` | GET | Rôles d'un compte | ADMIN |
| `GET /core/api/v1/principals/account/{uid}/groups` | GET | Groupes d'un compte | ADMIN |
| `PATCH /core/api/v1/principals/account/{uid}/lock` | PATCH | Verrouiller compte | ADMIN |
| `PATCH /core/api/v1/principals/account/{uid}/unlock` | PATCH | Déverrouiller | ADMIN |

### Administration — Rôles & Permissions
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `GET /core/api/v1/admin/roles` | GET | Lister tous les rôles | ADMIN |
| `POST /core/api/v1/admin/roles/{roleUid}/members/{accountUid}` | POST | Ajouter utilisateur à un rôle | ADMIN |
| `DELETE /core/api/v1/admin/roles/{roleUid}/members/{accountUid}` | DELETE | Retirer d'un rôle | ADMIN |
| `GET /core/api/v1/admin/permissions` | GET | Lister permissions | ADMIN |

### Notifications
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `GET /core/api/v1/notification/byAccount` | GET | Mes notifications (paginé, filtrable par status) | USER+ |
| `GET /core/api/v1/notification/countByStatus` | GET | Nombre par statut | USER+ |
| `PATCH /core/api/v1/notification/{uid}/status` | PATCH | Changer statut | USER+ |
| `PATCH /core/api/v1/notification/markAllReaden` | PATCH | Marquer tout lu | USER+ |
| `DELETE /core/api/v1/notification/{uid}` | DELETE | Supprimer | USER+ |
| `DELETE /core/api/v1/notification/deleteAll` | DELETE | Tout supprimer | USER+ |

### Médias (accès public)
| Chemin | Méthode | Description |
|---|---|---|
| `GET /core/api/pub/medias/{*filename}` | Public | Télécharger un fichier média (image/vidéo) par son chemin de stockage — aucune authentification requise, cache client 45 jours |

### Médias (bibliothèque)
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `POST /core/api/v1/medias/asset` | POST | Upload fichier | USER+ |
| `GET /core/api/v1/medias/assets` | GET | Parcourir/rechercher (tag, contentType, search) | USER+ |
| `DELETE /core/api/v1/medias/asset/{uid}` | DELETE | Supprimer un asset | ADMIN |
| `DELETE /core/api/v1/medias/assets` | DELETE | Supprimer plusieurs | ADMIN |
| `PATCH /core/api/v1/medias/asset/{uid}/rename` | PATCH | Renommer | ADMIN |

### Thumbnails (images d'une entité)
| Chemin | Méthode | Description |
|---|---|---|
| `GET /core/api/v1/thumbed/{fullId}` | GET | Lister images |
| `POST /core/api/v1/thumbed/{fullId}/item` | POST | Ajouter image (multipart) |
| `DELETE /core/api/v1/thumbed/{fullId}/item/{oid}` | DELETE | Supprimer image |
| `DELETE /core/api/v1/thumbed/{fullId}/all` | DELETE | Supprimer toutes |
| `PUT /core/api/v1/thumbed/{fullId}/reorder` | PUT | Réordonner |
| `POST /core/api/v1/thumbed/{fullId}/item/from-library` | POST | Copier depuis médiathèque |

### Contenus (fichiers attachés à une entité)
| Chemin | Méthode | Description |
|---|---|---|
| `GET /core/api/v1/contentHolder/{fullId}/getContentInfo` | GET | Info contenu |
| `GET /core/api/v1/contentHolder/{fullId}/downloadContent` | GET | Télécharger |
| `POST /core/api/v1/contentHolder/{fullId}` | POST | Créer contenu |
| `DELETE /core/api/v1/contentHolder/{fullId}/deleteContent` | DELETE | Supprimer |

### Contacts (adresses, téléphones, web)
| Chemin | Méthode | Description |
|---|---|---|
| `GET /core/api/v1/contactable/{fullId}/contacts` | GET | Lister contacts |
| `POST /core/api/v1/contactable/{fullId}/contacts/postal` | POST | Ajouter adresse postale |
| `POST /core/api/v1/contactable/{fullId}/contacts/{id}/telecom` | POST | Ajouter télécom |
| `POST /core/api/v1/contactable/{fullId}/contacts/{id}/web` | POST | Ajouter contact web |

### Préférences
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `GET /core/api/v1/preferences/user` | GET | Mes préférences | USER+ |
| `PUT /core/api/v1/preferences/user/{key}` | PUT | Mettre à jour | USER+ |
| `GET /core/api/v1/preferences/system` | GET | Préférences système | ADMIN |
| `PUT /core/api/v1/preferences/system/{key}` | PUT | Mettre à jour | ADMIN |

### Email
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `POST /core/api/v1/emailing/sendNoReply` | POST | Envoyer email (to, subject, [content/templateId]) | ADMIN |

### Lifecycle (états d'une entité)
| Chemin | Méthode | Description |
|---|---|---|
| `GET /core/api/v1/lifecycleManaged/{fullId}/state` | GET | État courant |
| `POST /core/api/v1/lifecycleManaged/{fullId}/transition` | POST | Changer d'état |

### Batch (import/export)
| Chemin | Méthode | Description | Rôle |
|---|---|---|---|
| `POST /core/api/v1/batch/load` | POST | Upload fichier import (multipart) | ADMIN |

### Enregistrement public
| Chemin | Méthode | Description |
|---|---|---|
| `POST /core/api/pub/v1/person/register` | POST | Inscription publique (compte + profil) |

### FCM / Push mobile
| Chemin | Méthode | Description |
|---|---|---|
| `POST /core/api/v1/googleToken/register` | POST | Enregistrer token FCM |

---

## Services disponibles via `KatappultCoreServicesHelper`

Injecter `KatappultCoreServicesHelper` pour accéder aux services core :

```java
@RequiredArgsConstructor
public class MyService {
    private final KatappultCoreServicesHelper services;
    
    // Exemples :
    // services.thumbService()         → IThumbService
    // services.mediaLibraryService()  → IMediaLibraryService
    // services.notificationService()  → INotificationService
    // services.emailService()         → IEmailService
    // services.persistableService()   → IPersistableService
    // services.folderService()        → IFolderService
    // services.lifecycleService()     → ILifecycleManagedService
    // services.businessRuleService()  → IBusinessRuleService
}
```
