import { Injectable, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { NotificationApiService } from '../../../pages/Admin/service/NotificationApi.service';
import deCodeAccessToken from '../../../shared/validators/DecodeCommon';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import moment from 'moment';


@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private noticeStatusSubject = new BehaviorSubject<any>(null);
  private notificationSubject = new BehaviorSubject<any[]>([]);
  private countNotificationSubject = new BehaviorSubject<number>(0);
  private pendingExportSubject = new BehaviorSubject<boolean>(false);
  private newNoticeStatusSubject = new BehaviorSubject<boolean>(false);
  public countNotifications$ = this.countNotificationSubject.asObservable();
  public pendingExport$ = this.pendingExportSubject.asObservable();
  public notifications$ = this.notificationSubject.asObservable();
  public noticeStatus$ = this.noticeStatusSubject.asObservable();
  public newNoticeStatus$ = this.newNoticeStatusSubject.asObservable();
  userId: string = '';
  private isFirstLoad: boolean = true;

  constructor(
    private messageService: MessageService,
    private t: TranslationService,
    private api: NotificationApiService
  ) {
    this.updateUserId();
    window.addEventListener('storage', this.handleStorageEvent);
  }

  private updateUserId() {
    const decoded = deCodeAccessToken();
    this.userId = decoded?.['x-user-id'] || '';
  }

  // =============================
  // Message helpers
  // =============================
  info(summaryKey: string, detailKey: string) {
    this.addMessage('info', summaryKey, detailKey);
  }

  warn(summaryKey: string, detailKey: string) {
    this.addMessage('warn', summaryKey, detailKey);
  }

  error(summaryKey: string, detailKey: string) {
    this.addMessage('error', summaryKey, detailKey);
  }

  success(summaryKey: string, detailKey: string, life: number = 2000) {
    this.addMessage('success', summaryKey, detailKey, life);
  }

  clear() {
    this.messageService.clear();
  }

  private addMessage(severity: string, summaryKey: string, detailKey: string, life?: number) {
    this.messageService.add({
      severity,
      summary: this.t.translate(summaryKey),
      detail: this.t.translate(detailKey),
      ...(life ? { life } : {})
    });
  }

  showPendingExport() {
    this.pendingExportSubject.next(true);
  }

  hidePendingExport() {
    this.pendingExportSubject.next(false);
    this.countNotifications();
  }

  // =============================
  // License notice
  // =============================
  private getInitialStatus(): boolean {
    return localStorage.getItem('notification-license') !== 'false';
  }

  checkExpiry(product: { expiryDate: string }) {
    if (!product?.expiryDate) {
      this.noticeStatusSubject.next(false);
      return 0;
    }

    const today = moment().startOf('day');
    const expiry = moment(product.expiryDate, 'YYYY-MM-DD').startOf('day');

    const diffDays = expiry.diff(today, 'days');

    const shouldShow = diffDays <= 30 && this.getInitialStatus();
    this.noticeStatusSubject.next(shouldShow);

    return diffDays;
  }

  closeNotice() {
    this.noticeStatusSubject.next(false);
    localStorage.setItem('notification-license', 'false');
  }

  setNoticeStatus(show: boolean) {
    localStorage.setItem('notification-license', show ? 'true' : 'false');
    this.noticeStatusSubject.next(show);
  }

  getNoticeStatusValue(): boolean {
    return this.noticeStatusSubject.value;
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === 'notification-license') {
      this.noticeStatusSubject.next(event.newValue !== 'false');
    }
  };

  // =============================
  // Notifications
  // =============================

  private hideTimeout: any;

  countNotifications() {
    this.updateUserId();
    if (!this.userId) {
      return;
    }


  }

  closeNewNotice() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.newNoticeStatusSubject.next(false);
  }





  markAllAsRead() {
    const updated = this.notificationSubject.value.map(n => ({
      ...n,
      isRead: 1,
      color: 'gray'
    }));
    this.notificationSubject.next(updated);
  }

  // =============================
  // Utilities
  // =============================
  private getIconByType(type: string) {
    switch (type) {
      case 'USER_ACTION': return 'pi pi-check-circle';
      case 'SYSTEM': return 'pi pi-cog';
      case 'WARNING': return 'pi pi-exclamation-triangle';
      case 'EXPORT_DATA': return 'pi pi-download';
      default: return 'pi pi-info-circle';
    }
  }

  private formatTime(date: string) {
    return new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageEvent);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
