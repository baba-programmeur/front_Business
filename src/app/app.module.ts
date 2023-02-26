import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApplicationRef, DoBootstrap, LOCALE_ID, NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import {AppRoutingModule} from './app.routing';
import {NavbarModule} from './shared/navbar/navbar.module';
import {FooterModule} from './shared/footer/footer.module';
import {SidebarModule} from './sidebar/sidebar.module';

import {AppComponent} from './app.component';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {UserService} from './_service/auth/user.service';
import {AuthService} from './_service/auth/auth.service';
import {AuthGuard} from './_service/guard';
import {ServerService} from './_service/auth/server.service';
import {AuthInterceptor} from './_service/auth/auth-interceptor.service';
import {CookieService} from 'ngx-cookie-service';
import {LoginComponent} from './user/login/login.component';
import {CommunService} from './_service/autre/commun.service';
import {FileService} from './_service/autre/file.service';
import {NotificationService} from './_service/autre/notification.service';

import {GoogleChartsModule} from 'angular-google-charts';
import {ParameterService} from './_service/autre/parameter.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RegisterComponent} from './user/register/register.component';
import {ResetPasswordFinishComponent} from './user/reset-password/reset-password-finish/reset-password-finish.component';
import {ResetPasswordInitComponent} from './user/reset-password/reset-password-init/reset-password-init.component';
import {ActivateComponent} from './user/activate/activate.component';
import {UnauthorizedComponent} from './user/unauthorized/unauthorized.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgSwitcheryModule} from 'angular-switchery-ios';
import {DetailsCampagneComponent} from './custom/admin/details-campagne/details-campagne.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {ExcelReaderModule} from 'excel-reader';
import {RxStompService} from '@stomp/ng2-stompjs';
import {PartenaireWebsocketService} from './_service/webSocket/partenaire.websocket.service';
import {DetailsCampagneErrorComponent} from './custom/details-campagne/details-campagne-error/details-campagne-error.component';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakSecurityService} from './_service/auth/keycloak-security.service';
import {MatTooltipModule } from '@angular/material/tooltip';

registerLocaleData(localeFr);


const keycloakSecurityService = new KeycloakSecurityService();
const keycloakService = new KeycloakService();

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        RouterModule,
        HttpClientModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        AppRoutingModule,
        GoogleChartsModule.forRoot(),
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        DataTablesModule,
        NgSwitcheryModule,
        MatButtonModule,
        ExcelReaderModule,
        MatTooltipModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        RegisterComponent,
        ActivateComponent,
        ResetPasswordInitComponent,
        ResetPasswordFinishComponent,
        UnauthorizedComponent,
        DetailsCampagneComponent,
        DetailsCampagneErrorComponent
    ],
    providers: [
        UserService,
        AuthService,
        AuthGuard,
        ServerService,
        CookieService,
        CommunService,
        FileService,
        NotificationService,
        ParameterService,
        // FirebaseProvider,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: 'fr-FR'},
        // {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
        RxStompService,
        PartenaireWebsocketService,
        {provide: KeycloakService, useValue: keycloakService},
        {provide: KeycloakSecurityService, useValue: keycloakSecurityService},
    ],
    exports: [
    ],
    entryComponents: [
        DetailsCampagneErrorComponent,
        AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    ngDoBootstrap(appRef: ApplicationRef): void {
        keycloakSecurityService.init(keycloakService)
            .then(
                value => {
                    console.log('Keycloak seccess ...');
                    appRef.bootstrap(AppComponent);
                }
            )
            .catch(
                err => {
                    console.log('Keycloak error :', err);
                }
            );
    }
}
