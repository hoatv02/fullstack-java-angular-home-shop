import { Injectable, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { NotificationApiService } from '../../pages/service/NotificationApi.service';
import deCodeAccessToken from '../../shared/validators/DecodeCommon';
import { TranslationService } from './../../../assets/i18n/translation.service';
import moment from 'moment';


@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private noticeStatusSubject = new BehaviorSubject<boolean>(this.getInitialStatus());
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
  refreshNotifications() {
    this.loadNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: any[]) => {
        this.notificationSubject.next(list);
      });
  }
  private hideTimeout: any;

  countNotifications() {
    this.updateUserId();
    if (!this.userId) {
      return;
    }

    this.countNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        const currentCount = this.countNotificationSubject.value;

        if (!this.isFirstLoad && count > currentCount) {
          this.newNoticeStatusSubject.next(true);

          if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
          }

          this.hideTimeout = setTimeout(() => {
            this.closeNewNotice();
          }, 25000); // Tự động đóng sau 25 giây (khớp với animation marquee)
        }
        this.countNotificationSubject.next(count);
        this.isFirstLoad = false;
      });
  }

  closeNewNotice() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.newNoticeStatusSubject.next(false);
  }


  countNotification(): Observable<any> {
    this.updateUserId();
    return this.api.countNotification(this.userId).pipe(
      map((res: any) => {
        if (res.code !== 200) return 0;
        return res.data;
      }),
      catchError(() => of(0))
    );
  }
  loadNotifications(): Observable<any[]> {
    this.updateUserId();
    return this.api.getNotifications(this.userId).pipe(
      map((res: any) => {
        if (res.code !== 200) return [];
        return res.data.map((item: any) => ({
          id: item.recipientId,
          icon: this.getIconByType(item.type),
          color: item.isRead === 0 ? 'blue' : 'gray',
          title: item.title,
          content: item.content,
          time: this.formatTime(item.deliveredAt),
          isRead: item.isRead,
          type: item.type,
          data: item.data,
          code: item.code
        }));
      }),
      catchError(() => of([]))
    );
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
