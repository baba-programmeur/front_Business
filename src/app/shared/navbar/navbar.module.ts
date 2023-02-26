import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import {ImagePreloadDirective} from '../../_directive/image-preload.directive';
import {MenuFilterDirective} from '../../_directive/menu-filter.directive';
import {PermissionDirective} from '../../_directive/permission.directive';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
    ],
    declarations: [
        NavbarComponent,
        ImagePreloadDirective,
        PermissionDirective,
        MenuFilterDirective
    ],
    exports: [
        NavbarComponent,
        ImagePreloadDirective,
        PermissionDirective,
        MenuFilterDirective
    ],
    entryComponents: [
    ]
})

export class NavbarModule {}
