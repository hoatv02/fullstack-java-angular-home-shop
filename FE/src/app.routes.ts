import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { Empty } from './app/pages/empty/empty';
import pagesRoutes from './app/pages/pages.routes';
import { Access } from './app/pages/auth/access';
import { Landing } from './app/pages/landing/landing';
import { ChangePasswordSuccessComponent } from './app/pages/new-password-by-email/change-password-success/change-password-success.component';
import { NewPasswordByEMailComponent } from './app/pages/new-password-by-email/new-password-by-email.component';
import { AuthGuard } from './app/layout/service/AuthGuard.service';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }, { path: 'dashboard', component: Dashboard },
        ...pagesRoutes
        ]
    },
    // { path: 'landing', component: Landing },
    { path: 'empty', component: Empty },
    { path: 'reset-password/:token', component: NewPasswordByEMailComponent },
    { path: 'update-password-success', component: ChangePasswordSuccessComponent },
    { path: 'notfound', component: Notfound },
    { path: 'forbidden', component: Access },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
