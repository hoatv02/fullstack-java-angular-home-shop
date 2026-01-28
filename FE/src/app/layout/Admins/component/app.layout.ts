import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, filter, of, Subscription, take } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LayoutService } from '../service/layout.service';
import { NotificationService } from '../service/notification.service';
import { AppFooter } from './app.footer';
import { AppSidebar } from './app.sidebar';
import { OperatorService } from '../../../pages/Admin/service/operator.service';
import { AppTopbar } from './app.topbar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
     <app-topbar *ngIf="(userInfo$ | async) as userInfo" 
            [username]="userInfo.username" 
            [roleId]="userInfo.roleId" 
            [userId]="userInfo.userId"></app-topbar>
        <app-sidebar  *ngIf="(userInfo$ | async) as userInfo" 
            [userInfo]="userInfo"></app-sidebar>
        <div [class]="((noticeService.noticeStatus$ | async) || (noticeService.newNoticeStatus$ | async)) ? 'layout-main-container-notice' : 'layout-main-container'">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout {
    overlayMenuOpenSubscription: Subscription;
    userInfo$ = new BehaviorSubject<any>({ roleId: '', userId: '', username: '' });
    menuOutsideClickListener: any;
    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    private operatorService = inject(OperatorService);
    userId: string = '';
    roleId: string = '';
    private routerSubscription: Subscription;
    username: string = '';
    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        public noticeService: NotificationService,
        private authService: AuthService,
        private cdf: ChangeDetectorRef
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }
            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.hideMenu());

    }
    ngOnInit(): void {
        this.getDataUserInfo();

    }
    getDataUserInfo() {
        const dataLocalStorage = this.authService.deCodeAccessToken();
        const id = dataLocalStorage?.['x-user-id'];
        if (!id) return;
        this.operatorService
            .getOperatorById({ requestId: id })
            .pipe(
                take(1),
                catchError(() => of(null)))
            .subscribe((data: any) => {
                if (data?.data) {
                    this.userInfo$.next({
                        roleId: data?.data?.roleId || '',
                        userId: data?.data?.requestId || '',
                        username: (data?.data?.firstName || '') + ' ' + (data?.data?.lastName || '')
                    });
                }
                this.cdf.detectChanges()
            });
    }
    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;
        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }
        this.routerSubscription?.unsubscribe();
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
