import {Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewChecked} from '@angular/core';
import {Location, PopStateEvent} from '@angular/common';
import 'rxjs/add/operator/filter';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import {UserService} from '../../_service/auth/user.service';
import {AuthService} from '../../_service/auth/auth.service';
import {Constant} from '../../_constant/constant';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    habilitations: any[];
    isAdmin = false;
    menuChecked = false;
    userInfo = '';
    account:any;
    codepartenaire:any;
    raisonsocial:any;
    @ViewChild('menu') menu: ElementRef;

    constructor(public location: Location,
                private userService: UserService,
                private authService: AuthService,
                private router: Router) {
    }

    async ngOnInit() {
        // find all habilitations for menu generation
        // this.findAllHabilitations();
        this.userInfo = this.userService.getUserInfo();

        this.getHabilitationsForUser();

        if (this.userService.isAdmin()) {
            this.isAdmin = true;
        } else {
            this.isAdmin = false;
        }

        console.log(this.router);
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function

            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-off');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (event.url !== this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url === this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        // this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
        //      if (elemMainPanel != null) {
        //          elemMainPanel.scrollTop = 0;
        //          elemSidebar.scrollTop = 0;
        //      }
        // });
        // if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        //     let ps = new PerfectScrollbar(elemMainPanel);
        //     if (elemSidebar) {
        //         ps = new PerfectScrollbar(elemSidebar);
        //     }
        // }

        this.account = JSON.parse(sessionStorage.getItem(Constant.ACCOUNT));
        this.codepartenaire = this.account.souscription.code_partenaire;
        // tslint:disable-next-line:max-line-length
        this.raisonsocial   = this.account.souscription.raison_sociale ? this.account.souscription.raison_sociale :this.account.souscription.prenom + ' ' + this.account.souscription.nom;


    }


    ngAfterViewInit() {
        this.runOnRouteChange();
    }

    getHabilitationsForUser() {
        // find habilitaions
        this.userService.getHabilitationsForUser()
            .subscribe(
                (habilitations: any[]) => {
                    console.log(habilitations);
                    this.habilitations = habilitations;
                    const account: any = this.userService.getUserInfo();
                    account.habilitations = habilitations;

                    this.authService.account = account;
                }
            );
    }

    isMap(path) {
        let title = this.location.prepareExternalUrl(this.location.path());
        title = title.slice(1);
        if (path === title) {
            return false;
        } else {
            return true;
        }
    }

    runOnRouteChange(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
            const ps = new PerfectScrollbar(elemMainPanel);
            ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    anchorClicked(e:any) {
        const $child_menu = $('.child_menu');
        $child_menu.css('display', 'none');
        $child_menu.parent().removeClass('active');

        const $li = $('#' + e.id).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            // tslint:disable-next-line:only-arrow-functions
            $('ul:first', $li).slideUp(function() {});
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $('#sidebar-menu')
                    .find('li')
                    .removeClass('active active-sm');
                $('#sidebar-menu')
                    .find('li ul')
                    .slideUp();
            }

            $li.addClass('active');

            // tslint:disable-next-line:only-arrow-functions
            $('ul:first', $li).slideDown(function() {});
        }
    }

    getPathFromHabilitationName(name) {
        const arr = name.split(':');
        if (arr && arr.length !== 0) {
            name = '';
            for (const item of arr) {
                name += '/' + item;
            }
        }

        return name;
    }

    onShowMenu(val) {
        if (val) {
            this.menu.nativeElement.className = 'show-menu menu';
        } else {
            this.menu.nativeElement.className = 'hide-menu menu';
        }
    }
}
