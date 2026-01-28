import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppFooter } from './app.footer';
import { AppConfigurator } from '../Admins/component/app.configurator';

@Component({
    selector: 'app-client-layout',
    standalone: true,
    imports: [RouterModule, AppTopbar, AppFooter, AppConfigurator],
    template: `
        <div class="layout-wrapper">
            <app-configurator />
            <app-topbar />
            <div class="my-2">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
                <app-footer />
            </div>
        </div>
    `
})
export class AppClientLayout { }
