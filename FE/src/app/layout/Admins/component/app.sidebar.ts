import { ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { AppMenu } from './app.menu';
import { NotificationService } from '../service/notification.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, AsyncPipe],
    template: ` <div [class]="((noticeService.noticeStatus$ | async) || (noticeService.newNoticeStatus$ | async)) ?  'layout-sidebar-notice border':'layout-sidebar border'">
        <app-menu [username]='userInfo?.username' [roleId]='userInfo?.roleId' [userId]='userInfo?.userId'></app-menu>
    </div>`
})
export class AppSidebar {
    @Input() userInfo!: any;
    constructor(public el: ElementRef,
        public noticeService: NotificationService

    ) {
    }
}
