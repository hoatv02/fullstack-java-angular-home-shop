import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/Admins/component/app.layout';
import { AuthGuard } from './app/layout/Admins/service/AuthGuard.service';
import { Access } from './app/pages/Admin/auth/access';
import { Dashboard } from './app/pages/Admin/dashboard/dashboard';
import { Empty } from './app/pages/Admin/empty/empty';
import { ChangePasswordSuccessComponent } from './app/pages/Admin/new-password-by-email/change-password-success/change-password-success.component';
import { NewPasswordByEMailComponent } from './app/pages/Admin/new-password-by-email/new-password-by-email.component';
import { Notfound } from './app/pages/Admin/notfound/notfound';
import pagesRoutes from './app/pages/Admin/pages.routes';
import { AppClientLayout } from './app/layout/Clients/app.layout';
import { HomeComponent } from './app/pages/Clients/home/home.component';
import { IntroduceComponent } from './app/pages/Clients/introduce/introduce.component';
import { ProductsComponent } from './app/pages/Clients/products/products.component';
import { ProductDetailComponent } from './app/pages/Clients/product-detail/product-detail.component';
import { CartComponent } from './app/pages/Clients/cart/cart.component';
import { CheckoutComponent } from './app/pages/Clients/checkout/checkout.component';
import { RegisterComponent } from './app/pages/Clients/register/register.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppClientLayout,
        children: [
            { path: '', component: HomeComponent },
            { path: 'introduce', component: IntroduceComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'products/:id', component: ProductDetailComponent },
            { path: 'cart', component: CartComponent },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            ...pagesRoutes
        ]
    },
    { path: 'empty', component: Empty },
    { path: 'reset-password/:token', component: NewPasswordByEMailComponent },
    { path: 'update-password-success', component: ChangePasswordSuccessComponent },
    { path: 'notfound', component: Notfound },
    { path: 'forbidden', component: Access },
    { path: 'auth', loadChildren: () => import('./app/pages/Admin/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
