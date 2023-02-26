 import { SouscriptionComponent } from './../../custom/souscription/souscription.component';
import { DetailsCampagneListComponent } from './../../custom/details-campagne/details-campagne-list/details-campagne-list.component';
import { Routes} from '@angular/router';
import {AuthGuard} from '../../_service/guard';
import {LogoutComponent} from '../../user/logout/logout.component';
import {ProfilDetailComponent} from '../../user/profil/profil-detail/profil-detail.component';
import {ProfilEditComponent} from '../../user/profil/profil-edit/profil-edit.component';
import {ChangePasswordComponent} from '../../user/profil/change-password/change-password.component';
import {PartenaireComponent} from '../../custom/partenaire/partenaire.component';
import {PartenaireDashboardComponent} from '../../custom/partenaire/partenaire-dashboard/partenaire-dashboard.component';
import {PartenaireAnalytiqueComponent} from '../../custom/partenaire/partenaire-analytique/partenaire-analytique.component';
import {AdminDashboardComponent} from '../../custom/admin/admin-dashboard/admin-dashboard.component';
import {AdminAnalytiqueComponent} from '../../custom/admin/admin-analytique/admin-analytique.component';
import {CampagneComponent} from '../../custom/campagne/campagne.component';
import {PaysComponent} from '../../custom/pays/pays.component';
import {AuthorisationComponent} from '../../custom/authorisation/authorisation.component';
import {TypeCanalReceptionComponent} from '../../custom/type-canal-reception/type-canal-reception.component';
import {NotificationComponent} from '../../custom/notification/notification.component';
import {ProfilFraisComponent} from '../../custom/profil-frais/profil-frais.component';
import {UsersComponent} from '../../user/profil/users/users.component';
import {FinancierDashboardComponent} from '../../custom/admin/financier-dashboard/financier-dashboard.component';
import {FormulaireComponent} from '../../custom/formulaire/formulaire.component';
import {ParametreComponent} from '../../user/profil/parametre/parametre.component';
import {ParametrageComponent} from '../../custom/parametrage/parametrage.component';
import {MouvementComponent} from '../../custom/mouvement/mouvement.component';
import {AddCampagneComponent} from '../../custom/add-campagne/add-campagne.component';
import {NotFoundComponent} from '../../not-found/not-found.component';
import {SouscriptionAddComponent} from '../../custom/souscription/souscription-add/souscription-add.component';
import {FormulaireItemComponent} from '../../custom/formulaire/formulaire-item/formulaire-item.component';
import {FormulaireAddComponent} from '../../custom/formulaire/formulaire-add/formulaire-add.component';
import {UserAddComponent} from '../../user/profil/users/user-add/user-add.component';
import {RoleAddComponent} from '../../user/profil/users/role-add/role-add.component';
import {RolesComponent} from '../../user/profil/users/roles/roles.component';
import {HabilitationsComponent} from '../../user/profil/users/habilitations/habilitations.component';
import {PaysAddComponent} from '../../custom/pays/pays-add/pays-add.component';
import {CanalReceptionComponent} from '../../custom/canal-reception/canal-reception.component';
import {CampagnePartenaireComponent} from '../../custom/campagne-partenaire/campagne-partenaire.component';
import {ConfigurationComponent} from '../../custom/configuration/configuration.component';
import {AnonymeDashboardComponent} from '../../custom/anonyme/anonyme-dashboard/anonyme-dashboard.component';
import {EntiteComponent} from '../../custom/entite/entite.component';
import {CampagneValidationComponent} from '../../custom/campagne-validation/campagne-validation.component';
 import {FilialeComponent} from '../../custom/filiale/filiale.component';
 import {LogComponent} from '../../custom/log/log.component';
 import {DashboardposComponent} from '../dashboardpos/dashboardpos.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    { path: 'partenaire', canActivate: [AuthGuard], component: PartenaireComponent, children: [
        { path: 'dashboard', component: PartenaireDashboardComponent, canActivate: [AuthGuard] },
        { path: 'analytique', component: PartenaireAnalytiqueComponent, canActivate: [AuthGuard] },
    ]},

    { path: 'financier', canActivate: [AuthGuard], children: [
        { path: 'dashboard', component: FinancierDashboardComponent, canActivate: [AuthGuard] },
    ]},

    { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'analytique', component: AdminAnalytiqueComponent, canActivate: [AuthGuard] },

    {path: 'accueil', canActivate: [AuthGuard], component: PartenaireComponent, children: [
            {path: 'admin', component: AdminDashboardComponent},
            {path: 'partenaire', component: DashboardposComponent},
            {path: 'financier', component: PartenaireDashboardComponent},
            {path: 'auditeur', component: PartenaireDashboardComponent},
            {path: 'anonyme', component: AnonymeDashboardComponent},
    ]},
    { path: 'campagnes', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: CampagneComponent},
            {path: 'get-own', component: CampagnePartenaireComponent},
            {path: 'collecte/add', component: AddCampagneComponent},
            {path: 'paiement/add', component: AddCampagneComponent},
            {path: 'validation', component: CampagneValidationComponent}
        ]
    },
    { path: 'souscriptions', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: SouscriptionComponent, canActivate: [AuthGuard]},
            {path: 'add', component: SouscriptionAddComponent},
        ]
    },
     { path: 'mouvements', canActivate: [AuthGuard], children: [
             {path: 'get-all', component: FinancierDashboardComponent}
         ]
     },
    { path: 'logs', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: LogComponent}
        ]
    },
    { path: 'configurations', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: ConfigurationComponent},
            {path: 'parametrages/get-all', component: ParametrageComponent},
            {path: 'ligne/parametrages/get-all', component: ParametreComponent}
        ]
    },
    { path: 'type-canaux', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: TypeCanalReceptionComponent}
        ]
    },
    { path: 'filiales', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: FilialeComponent},
        ]
    },
    { path: 'canals', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: CanalReceptionComponent},
        ]
    },
    { path: 'formulaires', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: FormulaireComponent},
            {path: 'add', component: FormulaireAddComponent},
            {path: 'champs', component: FormulaireItemComponent},
        ]
    },
     { path: 'entites', canActivate: [AuthGuard], children: [
             {path: 'get-all', component: EntiteComponent}
         ]
     },
    { path: 'utilisateurs', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: UsersComponent},
            {path: 'add', component: UserAddComponent},
        ]
    },
    { path: 'roles', canActivate: [AuthGuard], children: [
            {path: 'add', component: RoleAddComponent},
            {path: 'get-all', component: RolesComponent},
            { path: 'habilitations', canActivate: [AuthGuard], children: [
                    {path: 'get-all', component: HabilitationsComponent}
                ]
            }
        ]
    },
    { path: 'pays', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: PaysComponent},
            {path: 'add', component: PaysAddComponent},
        ]
    },
    { path: 'profil-frais', canActivate: [AuthGuard], children: [
            {path: 'get-all', component: ProfilFraisComponent}
        ]
    },
    { path: 'details-campagne', component: DetailsCampagneListComponent, canActivate: [AuthGuard] },
    { path: 'souscriptions', component: SouscriptionComponent, canActivate: [AuthGuard] },
    { path: 'mouvements', component: MouvementComponent, canActivate: [AuthGuard] },
    { path: 'type-canaux', component: TypeCanalReceptionComponent, canActivate: [AuthGuard] },
    { path: 'pays', component: PaysComponent, canActivate: [AuthGuard] },
    { path: 'authorisations', component: AuthorisationComponent, canActivate: [AuthGuard] },
    { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
    { path: 'profils-frais', component: ProfilFraisComponent, canActivate: [AuthGuard] },
    { path: 'formulaires', component: FormulaireComponent, canActivate: [AuthGuard] },
    { path: 'parametrages', component: ParametrageComponent, canActivate: [AuthGuard] },

    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
    { path: 'profil', canActivate: [AuthGuard],
        children: [
            { path: 'detail', component: ProfilDetailComponent, canActivate: [AuthGuard]},
            { path: 'edit', component: ProfilEditComponent, canActivate: [AuthGuard]},
            { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
            { path: 'parametre', component: ParametreComponent, canActivate: [AuthGuard] },
            { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
        ]
    },
    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}
];
