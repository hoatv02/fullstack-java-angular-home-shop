// src/app/app.component.ts
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { LoadingComponent } from './app/layout/Admins/component/app.loading';
import { ChangePasswordComponent } from './app/pages/Admin/components/change-password/change-password.component';
import { TranslationService } from './assets/i18n/translation.service';
import { AuthService } from './app/layout/Admins/service/auth.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { NotificationService } from './app/layout/Admins/service/notification.service';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LoadingComponent, RouterOutlet, ToastModule, ChangePasswordComponent],
    template: `
        <app-loading></app-loading>
        <router-outlet></router-outlet>
        <p-toast />
        <app-change-password [headerTitle]="'ChangePassword.FirstLoginTitle'" [changePasswordModal]="changePasswordModal" (close)="changePasswordModal = false" [closable]="false" [showButtonCancel]="false" />
    `
})
export class AppComponent {
    constructor(
        private primengConfig: PrimeNG,
        private translate: TranslationService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) { }
    private langSub!: Subscription;
    changePasswordModal: boolean = false;

    ngOnInit() {
        this.langSub = this.translate.lang$.subscribe((lang) => {
            const primengLocale = this.translate['translations'][lang]?.primeng;
            if (primengLocale) {
                const newLocale = { ...primengLocale };
                this.primengConfig.setTranslation(newLocale);
            }
        });
        this.authService.isLoggedIn$.subscribe((loggedIn) => {
            if (!loggedIn && this.changePasswordModal) {
                this.changePasswordModal = false;
            }
        });
        this.authService.changePasswordRequired$.subscribe((required) => {
            this.changePasswordModal = required;
        });

        const authData = JSON.parse(localStorage.getItem('AUTH_DATA') || '{}');
        if (authData?.isChangeFirstPassword) {
            this.changePasswordModal = true;
        }

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (this.authService.isAuthenticated()) {
                this.notificationService.countNotifications();
            }
        });

        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.langSub?.unsubscribe();
    }
}
