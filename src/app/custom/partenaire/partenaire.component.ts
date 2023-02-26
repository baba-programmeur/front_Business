import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../_service/auth/user.service';
import {AuthService} from '../../_service/auth/auth.service';

@Component({
    selector: 'app-partenaire',
    templateUrl: './partenaire.component.html',
    styleUrls: ['./partenaire.component.scss']
})
export class PartenaireComponent implements OnInit, AfterViewInit {

    constructor(private router: Router,
                private userService: UserService,
                private authService: AuthService) {
    }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
        console.log('..... in partenaire');
        if (this.authService.isLoggedIn()) {
            const tabHabilitations: any[] = this.userService.getUserHabilitation();
            // console.log(tabHabilitations);
            if (tabHabilitations) {
                const tabHabilitationsAccueil: any[] = tabHabilitations.filter(t => t.tag === 'accueil');
                // console.log('accueil : {} ', tabHabilitationsAccueil);
                if (tabHabilitationsAccueil && tabHabilitationsAccueil.length !== 0 && tabHabilitationsAccueil[0].habilitations) {
                    const tabScopes: any[] = tabHabilitationsAccueil[0].habilitations;
                    if (tabScopes.length !== 0) {
                        console.log('scopes : {} ', tabScopes);
                        let url: string = tabScopes[0].name;
                        console.log(url);
                        url = '/' + url.replace(':', '/');
                        console.log(url);
                        this.router.navigate([url]);
                    } else {
                        console.log('pas de profil correspondant');
                        this.router.navigate(['/accueil/anonyme']);
                    }
                } else {
                    console.log('permission accueil non trouvé');
                    this.router.navigate(['/accueil/anonyme']);
                }
            } else {
                if (this.userService.isMarchand()) {
                    this.router.navigate(['/accueil/partenaire']);
                } else {
                    if (this.userService.isAdmin() || this.userService.isSuperAdmin() || this.userService.isAdminFiliale()) {
                        this.router.navigate(['/accueil/admin']);
                    } else {
                        this.router.navigate(['/accueil/anonyme']);
                    }
                }
            }
        } else {
            this.router.navigate(['/']);
        }
    }
}
