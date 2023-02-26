import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LbdModule} from '../../lbd/lbd.module';
import {NguiMapModule} from '@ngui/map';

import {AdminLayoutRoutes} from './admin-layout-routing.module';

import {HomeComponent} from '../../home/home.component';
import {UserComponent} from '../../user/user.component';
import {TablesComponent} from '../../tables/tables.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {AnalytiqueComponent} from '../../analytique/analytique.component';
import {
    MatAutocompleteModule,
    MatBadgeModule, MatDialogModule,
    MatInputModule,
    MatSelectModule, MatStepperModule,
    MatTableModule
} from '@angular/material';
import {LogoutComponent} from '../../user/logout/logout.component';
import {DetailsCampagneComponent} from '../../custom/details-campagne/details-campagne.component';
import {AddCampagneComponent} from '../../custom/add-campagne/add-campagne.component';
import {MatFileUploadModule} from 'angular-material-fileupload';
import {AddDetailCampagneComponent} from '../../custom/details-campagne/add-detail-campagne/add-detail-campagne.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {ChangePasswordComponent} from '../../user/profil/change-password/change-password.component';
import {ProfilEditComponent} from '../../user/profil/profil-edit/profil-edit.component';
import {ProfilDetailComponent} from '../../user/profil/profil-detail/profil-detail.component';
import {ImageUploaderComponent} from '../../custom/image-uploader/image-uploader.component';
import {ProfilComponent} from '../../user/profil/profil.component';
import {ImagePreloadDirective} from '../../_directive/image-preload.directive';
import {MatButtonModule} from '@angular/material/button';
import {PartenaireComponent} from '../../custom/partenaire/partenaire.component';
import {PartenaireDashboardComponent} from '../../custom/partenaire/partenaire-dashboard/partenaire-dashboard.component';
import {PartenaireAnalytiqueComponent} from '../../custom/partenaire/partenaire-analytique/partenaire-analytique.component';
import {AdminComponent} from '../../custom/admin/admin.component';
import {AdminDashboardComponent} from '../../custom/admin/admin-dashboard/admin-dashboard.component';
import {AdminAnalytiqueComponent} from '../../custom/admin/admin-analytique/admin-analytique.component';
import {ShowListComponent} from '../../custom/global/show-list/show-list.component';
import {ShowDetailComponent} from '../../custom/global/show-detail/show-detail.component';
import {EditEntityComponent} from '../../custom/global/edit-entity/edit-entity.component';
import {CampagneComponent} from '../../custom/campagne/campagne.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgSwitcheryModule} from 'angular-switchery-ios';
import {ConfirmDeleteComponent} from '../../custom/global/confirm-delete/confirm-delete.component';
import {PaysComponent} from '../../custom/pays/pays.component';
import {CanalReceptionComponent} from '../../custom/canal-reception/canal-reception.component';
import {TypeCanalReceptionComponent} from '../../custom/type-canal-reception/type-canal-reception.component';
import {NotificationComponent} from '../../custom/notification/notification.component';
import {DetailsCampagneListComponent} from '../../custom/details-campagne/details-campagne-list/details-campagne-list.component';
import {SouscriptionComponent} from '../../custom/souscription/souscription.component';
import {ProfilFraisComponent} from '../../custom/profil-frais/profil-frais.component';
import {FiltreComponent} from '../../custom/global/filtre/filtre.component';
import {ProfilFraisEditComponent} from '../../custom/profil-frais/profil-frais-edit/profil-frais-edit.component';
import {UsersComponent} from '../../user/profil/users/users.component';
import {SouscriptionDialogComponent} from '../../custom/partenaire/souscription-dialog/souscription-dialog.component';
import {FinancierDashboardComponent} from '../../custom/admin/financier-dashboard/financier-dashboard.component';
import {ConfirmMouvementComponent} from '../../custom/global/confirm-mouvement/confirm-mouvement.component';
import {CancelMouvementComponent} from '../../custom/admin/financier-dashboard/cancel-mouvement/cancel-mouvement.component';
import {CorrectMouvementComponent} from '../../custom/admin/financier-dashboard/correct-mouvement/correct-mouvement.component';
import {PaiementIndividuelComponent} from '../../custom/paiement-individuel/paiement-individuel.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {CanalEndpointComponent} from '../../custom/canal-reception/canal-endpoint/canal-endpoint.component';
import {DetailsCampagneApercuComponent} from '../../custom/details-campagne/details-campagne-apercu/details-campagne-apercu.component';
import {ConfirmComponent} from '../../custom/global/confirm/confirm.component';
import {ExcelReaderModule} from 'excel-reader';
import {AuthorisationComponent} from '../../custom/authorisation/authorisation.component';
import {AuthorisationUserComponent} from '../../custom/global/authorisation-user/authorisation-user.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NavbarModule} from '../../shared/navbar/navbar.module';
import {MatNativeDateModule} from '@angular/material/core';
import {FormulaireComponent} from '../../custom/formulaire/formulaire.component';
import {FormulaireItemComponent} from '../../custom/formulaire/formulaire-item/formulaire-item.component';
import {FormulaireItemViewComponent} from '../../custom/formulaire/formulaire-item/formulaire-item-view/formulaire-item-view.component';
import {ParametreComponent} from '../../user/profil/parametre/parametre.component';
import {ParametrageComponent} from '../../custom/parametrage/parametrage.component';
import {UpdateMailListComponent} from '../../user/profil/parametre/update-mail-list/update-mail-list.component';
import {MouvementComponent} from '../../custom/mouvement/mouvement.component';
import {PartenaireMouvementComponent} from '../../custom/partenaire/partenaire-mouvement/partenaire-mouvement.component';
import {MatTabsModule} from '@angular/material/tabs';
import {RolesOfUserComponent} from '../../user/profil/users/roles-of-user/roles-of-user.component';
import {HabilitationsOfRoleComponent} from '../../user/profil/users/habilitations-of-role/habilitations-of-role.component';
import {NotFoundComponent} from '../../not-found/not-found.component';
import {SouscriptionAddComponent} from '../../custom/souscription/souscription-add/souscription-add.component';
import {FormulaireAddComponent} from '../../custom/formulaire/formulaire-add/formulaire-add.component';
import {HabilitationsComponent} from '../../user/profil/users/habilitations/habilitations.component';
import {RolesComponent} from '../../user/profil/users/roles/roles.component';
import {RoleAddComponent} from '../../user/profil/users/role-add/role-add.component';
import {UserAddComponent} from '../../user/profil/users/user-add/user-add.component';
import {OptionsAddComponent} from '../../custom/formulaire/options-add/options-add.component';
import {PaysAddComponent} from '../../custom/pays/pays-add/pays-add.component';
import {MatIconModule} from '@angular/material/icon';
import {FormulaireDataComponent} from '../../custom/formulaire/formulaire-data/formulaire-data.component';
import {FormulaireDataItemComponent} from '../../custom/formulaire/formulaire-data-item/formulaire-data-item.component';
import {SouscriptionActiveComponent} from '../../custom/partenaire/souscription-active/souscription-active.component';
import {UsersListComponent} from '../../user/profil/users/users-list/users-list.component';
import {CampagnePartenaireComponent} from '../../custom/campagne-partenaire/campagne-partenaire.component';
import {ConfigurationComponent} from '../../custom/configuration/configuration.component';
import {AnonymeDashboardComponent} from '../../custom/anonyme/anonyme-dashboard/anonyme-dashboard.component';
import {DataTablesModule} from 'angular-datatables';
// tslint:disable-next-line:max-line-length
import {TypeCanalReceptionAddComponent} from '../../custom/type-canal-reception/type-canal-reception-add/type-canal-reception-add.component';
import {ConfigurationEndpointComponent} from '../../custom/configuration/configuration-endpoint/configuration-endpoint.component';
import {EntiteComponent} from '../../custom/entite/entite.component';
import {CampagneValidationComponent} from '../../custom/campagne-validation/campagne-validation.component';
import {ProfilFraisValeurComponent} from '../../custom/profil-frais/profil-frais-valeur/profil-frais-valeur.component';
import {FilialeComponent} from '../../custom/filiale/filiale.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {EntitePaysComponent} from '../../custom/entite/entite-pays/entite-pays.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LogComponent} from '../../custom/log/log.component';
import {LogShowComponent} from '../../custom/log/log-show/log-show.component';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {DashboardposComponent} from '../dashboardpos/dashboardpos.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MonbuttonComponent} from '../monbutton/monbutton.component';
import {MontantrightPipe} from '../montantright.pipe';
import {SafeHtmlPipe} from '../safe-html.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        LbdModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatTableModule,
        MatIconModule,
        MatDatepickerModule,
        // MatPaginatorModule,
        MatBadgeModule,
        MatDialogModule,
        MatStepperModule,
        MatFileUploadModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'}),
        GoogleChartsModule,
        MatButtonModule,
        NgxPaginationModule,
        MatDatepickerModule,
        NgSwitcheryModule,
        MatButtonModule,
        MatDividerModule,
        MatGridListModule,
        MatTabsModule,
        // NgJsonEditorModule,
        ExcelReaderModule,
        MatCheckboxModule,
        NavbarModule,
        NgxPaginationModule,
        DataTablesModule,
        MatTooltipModule,
        MatListModule,
        MatRadioModule,
        NgxChartsModule
    ],
    declarations: [
        HomeComponent,
        UserComponent,
        TablesComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        UpgradeComponent,
        AnalytiqueComponent,
        LogComponent,
        LogoutComponent,
        DetailsCampagneComponent,
        LogShowComponent,
        AddCampagneComponent,
        PaiementIndividuelComponent,
        AddDetailCampagneComponent,
        ChangePasswordComponent,
        ProfilComponent,
        ProfilEditComponent,
        ProfilDetailComponent,
        ImageUploaderComponent,
        // ImagePreloadDirective,
        PartenaireComponent,
        PartenaireDashboardComponent,
        PartenaireAnalytiqueComponent,
        AdminComponent,
        AdminDashboardComponent,
        AdminAnalytiqueComponent,
        ShowListComponent,
        ShowDetailComponent,
        EditEntityComponent,
        CampagneComponent,
        CampagnePartenaireComponent,
        CampagneValidationComponent,
        ConfirmDeleteComponent,
        ProfilFraisValeurComponent,
        AuthorisationUserComponent,
        DetailsCampagneListComponent,
        SouscriptionComponent,
        EntiteComponent,
        FilialeComponent,
        PaysComponent,
        AuthorisationComponent,
        ConfigurationComponent,
        CanalReceptionComponent,
        TypeCanalReceptionComponent,
        TypeCanalReceptionAddComponent,
        NotificationComponent,
        ProfilFraisComponent,
        FiltreComponent,
        ProfilFraisEditComponent,
        UsersComponent,
        ParametreComponent,
        SouscriptionDialogComponent,
        SouscriptionActiveComponent,
        UsersListComponent,
        FinancierDashboardComponent,
        AnonymeDashboardComponent,
        ConfirmMouvementComponent,
        CancelMouvementComponent,
        CorrectMouvementComponent,
        CanalEndpointComponent,
        EntitePaysComponent,
        ConfigurationEndpointComponent,
        DetailsCampagneApercuComponent,
        ConfirmComponent,
        FormulaireComponent,
        FormulaireItemComponent,
        FormulaireItemViewComponent,
        ParametrageComponent,
        UpdateMailListComponent,
        MouvementComponent,
        PartenaireMouvementComponent,
        RolesOfUserComponent,
        HabilitationsOfRoleComponent,
        NotFoundComponent,
        SouscriptionAddComponent,
        FormulaireAddComponent,
        HabilitationsComponent,
        RolesComponent,
        RoleAddComponent,
        UserAddComponent,
        OptionsAddComponent,
        PaysAddComponent,
        FormulaireDataComponent,
        FormulaireDataItemComponent,
        DashboardposComponent,
        MonbuttonComponent,
        MontantrightPipe,
        SafeHtmlPipe
    ],
    // exports: [
    //     ImagePreloadDirective
    // ],
    entryComponents: [
        AddCampagneComponent,
        PaiementIndividuelComponent,
        AddDetailCampagneComponent,
        ImageUploaderComponent,
        EditEntityComponent,
        ShowDetailComponent,
        ConfirmDeleteComponent,
        ProfilFraisValeurComponent,
        AuthorisationUserComponent,
        ProfilFraisEditComponent,
        CanalReceptionComponent,
        SouscriptionDialogComponent,
        SouscriptionActiveComponent,
        UsersListComponent,
        ConfirmMouvementComponent,
        CancelMouvementComponent,
        CorrectMouvementComponent,
        CanalEndpointComponent,
        EntitePaysComponent,
        ConfigurationEndpointComponent,
        ConfirmComponent,
        FormulaireItemComponent,
        UpdateMailListComponent,
        PartenaireMouvementComponent,
        RolesOfUserComponent,
        HabilitationsOfRoleComponent,
        OptionsAddComponent,
        PaysAddComponent,
        DetailsCampagneComponent,
        MonbuttonComponent,

    ],
    exports: [
    ],
    providers: []
})
export class AdminLayoutModule {
}
