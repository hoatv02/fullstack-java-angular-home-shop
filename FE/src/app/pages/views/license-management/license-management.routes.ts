import { Routes } from '@angular/router';
import { LicenseManagementComponent } from './license-management.component';
import { RequestLogCharactersFromCustomComponent } from './request-log-characters-from-custom/request-log-characters-from-custom.component';

export default [
    {
        path: 'license-management',
        component: LicenseManagementComponent,
    },
    {
        path: 'request-log-from-custom',
        component: RequestLogCharactersFromCustomComponent,
    },

] as Routes;
