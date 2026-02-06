import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Popover, PopoverModule } from 'primeng/popover';
import { StyleClassModule } from 'primeng/styleclass';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { ChangePasswordComponent } from '../../../pages/Admin/components/change-password/change-password.component';
import { InformationComponent } from '../../../pages/Admin/components/information/information.component';
import { SHARED_MODULES } from '../../../shared/shared.module';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../service/auth.service';
import { LayoutService } from '../service/layout.service';
import { LoadingService } from '../service/loading.service';
import { NotificationService } from '../service/notification.service';
import { AppConfigurator } from './app.configurator';
import { FileExportService } from '../../../pages/Admin/service/FileExport.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [SHARED_MODULES, CommonModule, StyleClassModule, AppConfigurator, ButtonModule, InformationComponent, ChangePasswordComponent, PopoverModule, ConfirmDialogComponent],
    template: `
        <div class="layout-topbar border flex justify-between items-center px-4 md:px-6 py-2 bg-white dark:bg-gray-900">
            <div class="layout-topbar-logo-container">
                <a class="layout-topbar-logo" routerLink="/">
                    <div class="text-primary">
                        <svg fill="none" height="32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="32">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <span class="text-navy-dark font-extrabold text-2xl tracking-tighter uppercase whitespace-nowrap">Home Shop</span>

                </a>
                <button class="layout-menu-button layout-topbar-action ml-20" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
            </div>
            <div class="flex items-center gap-2 sm:gap-2 ml-auto">
                <div class="relative">
                    <button (click)="toggle($event)" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <i class="pi pi-bell text-xl text-gray-700 dark:text-gray-200"></i>
                    </button>
                    <!-- BADGE -->
                    <span
                        *ngIf="getUnreadCount() > 0"
                        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 
             bg-red-600 text-white text-[10px] font-medium 
             rounded-full flex items-center justify-center"
                    >
                        {{ getUnreadCount() }}
                    </span>
                </div>
                <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" (click)="langPanel.toggle($event)">
                    <i class="pi pi-globe text-xl text-gray-700 dark:text-gray-200"></i>
                </button>
                <p-overlayPanel #langPanel [dismissable]="true">
                    <div class="p-0 min-w-[70px]">
                        <p *ngFor="let lang of languages" class="cursor-pointer hover:bg-gray-100 p-1 rounded m-0" (click)="onChangeTranslate(lang.code); langPanel.hide()">
                            <img [src]="lang?.flag" class="w-5 h-5 inline-block mr-2" />
                            {{ lang.label }}
                        </p>
                    </div>
                </p-overlayPanel>
                <div class="relative">
                    <button (click)="menu.toggle($event)" type="button" class="flex items-center gap-2 sm:gap-3 focus:outline-none">
                        <div class="profile-avt w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-400 flex items-center justify-center bg-gray-100 font-semibold text-sm sm:text-base">{{ firstLetter }}</div>
                        <div class="leading-tight text-left hidden sm:block">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                <strong>{{ username ? ('SYSTEM.Welcome' | translate) + username : ('SYSTEM.HelloSystem' | translate) }}</strong>
                            </div>
                        </div>
                    </button>
                    <p-overlayPanel #menu [dismissable]="true">
                        <div class="p-0 min-w-[150px]">
                            <p *ngFor="let item of items" class="cursor-pointer hover:bg-gray-100 px-1 py-2 gap2 rounded m-0 text-sm" (click)="handleItemClick(item, menu)">
                                <i [class]="item.icon" style="font-size: 12px;margin-right: 5px;"></i>
                                {{ item.label }}
                            </p>
                        </div>
                    </p-overlayPanel>
                </div>
            </div>
            <div class="layout-config-menu ">
                <div class="relative hidden ">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>
        </div>
        <div *ngIf="(noticeService.noticeStatus$ | async) || (noticeService.newNoticeStatus$ | async)" class="app-topbar-notice-blue">
            <div class="marquee-wrapper">
                <div class="marquee-content text-sm font-medium">
                    <ng-container *ngIf="noticeService.noticeStatus$ | async; else notificationContent">
                        <i class="pi pi-exclamation-triangle mr-2"></i>
                        <span *ngIf="isExpiringSoon > 0">{{ 'LICENSE_EXPIRY_START' | translate }} {{ isExpiringSoon }} {{ 'LICENSE_EXPIRY_END' | translate }}</span>
                        <span *ngIf="isExpiringSoon <= 0">{{ 'LICENSE_EXPIRED' | translate }}</span>
                    </ng-container>
                    <ng-template #notificationContent>
                        <i class="pi pi-bell mr-2"></i>
                        <span>{{ 'Common.NewNotificationMessage' | translate }}</span>
                    </ng-template>
                </div>
            </div>
            <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none" (click)="closeUnifiedNotice()" aria-label="Đóng thông báo">
                <i class="pi pi-times text-sm"></i>
            </button>
        </div>

        <app-information [informationModal]="informationModal" (close)="informationModal = false" />
        <app-change-password [changePasswordModal]="changePasswordModal" (close)="changePasswordModal = false" />
        <app-confirm-dialog
            [visible]="modalConfirmLogoutVisiable"
            [message]="'LOGOUT_CONFIRM.MESSAGE' | translate"
            [header]="'LOGOUT_CONFIRM.TITLE' | translate"
            [confirmLabel]="'Common.ConfirmDeleteYes' | translate"
            [cancelLabel]="'Common.ConfirmDeleteNo' | translate"
            (confirm)="onConfirmonConfirmLogout()"
            (cancel)="modalConfirmLogoutVisiable = false"
        />
        <app-confirm-dialog
            [visible]="(noticeService.pendingExport$ | async) || false"
            [header]="'Common.Notification' | translate"
            [confirmLabel]="'Common.Close' | translate"
            [showButtonCancel]="false"
            [formTemplate]="exportNoticeTemplate"
            (confirm)="noticeService.hidePendingExport()"
        />
        <ng-template #exportNoticeTemplate>
            <div class="flex flex-col items-center py-4 text-center">
                <div class="relative w-28 h-28 flex items-center justify-center mb-6 mt-2">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-500 animate-[spin_4s_linear_infinite] opacity-20 blur-md"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-blue-500/10 animate-pulse"></div>
                    <div class="relative z-10 w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl border border-gray-100 dark:border-gray-700">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center">
                            <i class="pi pi-file-export text-blue-600 dark:text-blue-400 text-4xl"></i>
                        </div>
                    </div>
                    <div class="absolute top-0 right-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                    <div class="absolute bottom-2 left-1 w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.5s]"></div>
                </div>
                <div class="px-6 pb-2 max-w-sm">
                    <p class="text-base font-bold text-gray-800 dark:text-gray-100 leading-snug mb-2">
                        {{ 'Common.PendingExport' | translate }}
                    </p>

                </div>
            </div>
        </ng-template>
        <p-popover #op>
            <div class="flex flex-col w-[25rem] max-h-[400px] overflow-y-auto ">
                <div class="flex items-center justify-between px-4 py-3 border-b border-surface-200 sticky top-0 bg-surface-0 z-10">
                    <span class="font-semibold text-surface-900 text-base">{{ 'Common.Notification' | translate }}</span>
                    <div class="flex items-center gap-2">
                        <button *ngIf="hasUnread()" pButton [label]="'Common.ReadAll' | translate" class="p-button-text p-button-sm !text-primary-600 hover:!text-primary-700" (click)="markAllAsRead()"></button>
                        <button pButton icon="pi pi-times" class="p-button-text p-button-sm text-surface-500 hover:text-surface-700" (click)="op.hide()"></button>
                    </div>
                </div>
                <ul class="list-none m-0 p-0 divide-y divide-surface-100">
                    <ng-container *ngIf="notifications?.length > 0; else noNotification">
                        @for (item of notifications; track item) {
                            <li
                                (click)="onNotificationClick(item)"
                                class="px-4 py-3 flex items-start gap-3 hover:bg-surface-50 cursor-pointer transition-colors duration-150"
                                [ngClass]="{ 'bg-surface-50': item.isRead === 0, 'hover:bg-surface-50': true }"
                            >
                                <div class="mt-1">
                                    <i [class]="item.icon + ' text-' + item.color + '-500 text-lg'"></i>
                                </div>
                                <div class="flex-1 flex flex-col">
                                    <div class="flex items-center gap-2">
                                        <div class="text-sm font-medium text-surface-900">
                                            {{ item.title }}
                                        </div>
                                        <span *ngIf="item.isRead === 0" class="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                                    </div>
                                    <div class="text-xs text-muted-color mt-1">
                                        {{ item.content }}
                                    </div>
                                    <div class="text-xs text-surface-500 mt-1">
                                        {{ item.time }}
                                    </div>
                                </div>
                            </li>
                        }
                    </ng-container>

                    <ng-template #noNotification>
                        <li class="px-4 py-3 text-center text-surface-500">
                            {{ 'Common.NoData' | translate }}
                        </li>
                    </ng-template>
                </ul>
            </div>
        </p-popover>
    `,
    styles: [
        `
            ::ng-deep .p-popover-content {
                padding: 2px !important;
            }
            ::ng-deep .p-popover {
                z-index: 1102 !important;
            }
        `
    ]
})
export class AppTopbar {
    @Input() userId!: string;
    @Input() roleId!: string;
    @Input() username!: string;
    items!: MenuItem[];
    isExpiringSoon = 0;
    private lastEvent: MouseEvent | null = null;
    informationModal: boolean = false;
    changePasswordModal: boolean = false;
    modalConfirmLogoutVisiable: boolean = false;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('langPanel') langPanel!: any;
    count: number = 0;
    notifications: any = [];
    closeUnifiedNotice() {
        if (this.noticeService.getNoticeStatusValue()) {
            this.noticeService.closeNotice();
        } else {
            this.noticeService.closeNewNotice();
        }
    }
    changeLanguage(lang: string) {
        localStorage.setItem('lang', lang);
    }
    get firstLetter(): string {
        return this.username ? this.username.trim().charAt(0).toUpperCase() : '';
    }
    constructor(
        public layoutService: LayoutService,
        private loadingService: LoadingService,
        private authService: AuthService,
        private router: Router,
        private t: TranslationService,
        private cdr: ChangeDetectorRef,
        public noticeService: NotificationService,
        private fileExportService: FileExportService
    ) { }
    private destroy$ = new Subject<void>();
    private langSub!: Subscription;
    @ViewChild('op') op!: Popover;
    selectedMember: any = null;
    members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
    ];

    toggle(event: any) {
        this.getNotification();
        this.op.toggle(event);
    }
    getUnreadCount() {
        return this.count;
    }
    hasUnread() {
        return this.notifications?.some((n: any) => n.isRead === 0);
    }
    markAllAsRead() {
        this.notifications = this.notifications.map((n: any) => ({
            ...n,
            isRead: 1,
            color: 'gray'
        }));
        this.readNotification();
    }

    readNotification() {

    }

    selectMember(member: any) {
        this.selectedMember = member;
        this.op.hide();
    }
    ngOnInit(): void {
        this.langSub = this.t.lang$.subscribe((lang) => {
            const primengLocale = this.t['translations'][lang]?.primeng;
            if (primengLocale) {
                this.items = [
                    {
                        label: this.t.translate('Menu.PERSONAL_INFO'),
                        icon: 'pi pi-user',
                        command: () => this.information()
                    },
                    {
                        label: this.t.translate('Menu.CHANGE_PASSWORD'),
                        icon: 'pi pi-key',
                        command: () => this.changePassword()
                    },
                    {
                        label: this.t.translate('Menu.LOGOUT'),
                        icon: 'pi pi-sign-out',
                        command: () => this.logout()
                    }
                ];
                this.getNotification();
                this.noticeService.countNotifications();
            }
        });
        this.noticeService.countNotifications$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
            this.count = count;
        });
        this.noticeService.newNoticeStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
            console.log('[AppTopbar] newNoticeStatus$ changed to:', status);
        });
        this.cdr.detectChanges();
    }



    getNotification() {

    }
    getIconByType(type: string) {
        switch (type) {
            case 'USER_ACTION':
                return 'pi pi-check-circle';
            case 'SYSTEM':
                return 'pi pi-cog';
            case 'WARNING':
                return 'pi pi-exclamation-triangle';
            default:
                return 'pi pi-info-circle';
        }
    }

    formatTime(date: string) {
        return new Date(date).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    }
    handleItemClick(item: any, panel: OverlayPanel) {
        if (item.command) {
            item.command();
        }
        panel.hide();
    }
    information() {
        this.informationModal = true;
    }
    changePassword() {
        this.changePasswordModal = true;
    }
    ngAfterViewInit() {
        window.addEventListener('resize', this.handleResize);
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.handleResize);
        this.destroy$.next();
        this.destroy$.complete();
        this.langSub?.unsubscribe();
    }

    onChangeTranslate(lang: any) {
        this.t.setLanguage(lang);
        this.cdr.markForCheck();
    }
    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        this.modalConfirmLogoutVisiable = true;
    }

    onConfirmonConfirmLogout() {
        this.loadingService.show();
        this.authService
            .logout()
            .pipe(
                finalize(() => {
                    this.loadingService.hide();
                    this.modalConfirmLogoutVisiable = false;
                })
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.code === 200) {
                        this.noticeService.success(this.t.translate('Common.Notification'), this.t.translate('Common.LogoutSuccess'));
                    }
                }
            });
    }

    onNotificationClick(item: any) {
        console.log('🚀 This is! __ item:', item?.code);
        if (item.type === 'EXPORT_DATA') {
            const downloadUrl = `${environment.APP_API_URL}/export/${item.code}/download`;
            this.fileExportService.downloadFile(downloadUrl, item.title, 'xlsx');
        }

        if (item.isRead === 0) {
            this.notifications = this.notifications.map((n: any) => (n.id === item.id ? { ...n, isRead: 1, color: 'gray' } : n));

        }
    }

    onUserMenuClick(event: MouseEvent) {
        this.lastEvent = event;
        this.menu.toggle(event);
    }

    handleResize = () => {
        this.menu.hide();
        this.langPanel.hide();
    };

    languages = [
        {
            code: 'en',
            label: 'EN',
            flag: 'assets/images/flags/en.png'
        },
        {
            code: 'vi',
            label: 'VN',
            flag: 'assets/images/flags/vn.webp'
        }
    ];
}
