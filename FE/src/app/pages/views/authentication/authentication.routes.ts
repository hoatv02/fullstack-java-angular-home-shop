import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';

export default [
    { path: 'authentication', data: { breadcrumb: 'Authentication' }, component: AuthenticationComponent },
] as Routes;



