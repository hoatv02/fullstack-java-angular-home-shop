import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../../../../layout/Admins/service/loading.service';
import { SHARED_MODULES } from '../../../../../../shared/shared.module';
import { TransactionService } from '../../../../service/transactions.service';

@Component({
    selector: 'app-transaction-log-detail',
    imports: [SHARED_MODULES],
    providers: [TransactionService],
    templateUrl: './transaction-log-detail.component.html',
    styleUrl: './transaction-log-detail.component.scss'
})
export class TransactionLogDetailComponent implements OnInit {
    paymentId: string | null = '';
    paymentInfoData: any;
    breadcrumbList = [
        { label: 'TransactionLog.TransactionLogTitle', routerLink: '/transaction-log' },
        { label: 'TransactionLog.Detail', routerLink: '/' }
    ];
    timelineItems: any[] = [];

    constructor(
        private transactionService: TransactionService,
        private loadingService: LoadingService,
        private route: ActivatedRoute,
        public router: Router
    ) {
        this.paymentId = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        if (this.paymentId) {
            this.getDetail(this.paymentId);
        }
    }


    getDetail(id: string) {
        this.loadingService.show();
        this.transactionService
            .getDetailPayment(id)
            .pipe(
                catchError((error) => {
                    return of(null);
                }),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.data) {
                        this.paymentInfoData = data?.data;
                        this.getStepTransaction(this.paymentId);
                    }
                }
            });
    }
    stepTransactionData: any[] = [];
    getStepTransaction(id: any) {
        this.loadingService.show();
        this.transactionService
            .getStepTransaction(id)
            .pipe(
                catchError((error) => {
                    return of(null);
                }),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
            .subscribe({
                next: (res: any) => {
                    if (res?.data) {
                        this.stepTransactionData = res.data;
                        this.initTimeline(this.stepTransactionData);
                    }
                }
            });
    }
    initTimeline(logs: any[] = []) {
        const stepsConfig = [
            {
                label: 'TransactionLog.Timeline.Steps.AuthRequest',
                action: 'AUTH_REQUEST',
            },
            {
                label: 'TransactionLog.Timeline.Steps.ValidatePin',
                action: 'VALIDATE_PIN',
            },
            {
                label: 'TransactionLog.Timeline.Steps.ValidateSmartOtp',
                action: 'VALIDATE_SMART_OTP',
            },
            {
                label: 'TransactionLog.Timeline.Steps.UpdateTransactionStatus',
                action: 'UPDATE_TRANSACTION_STATUS',
            }
        ];

        this.timelineItems = [];

        stepsConfig.forEach((config) => {
            const matchingLogs = logs.filter(l => l.action === config.action);
            if (matchingLogs.length > 0) {
                matchingLogs.sort((a, b) => (a.logTime > b.logTime ? 1 : -1));
                matchingLogs.forEach(log => {
                    this.timelineItems.push(this.createTimelineItem(config, log));
                });
            } else {
                this.timelineItems.push(this.createTimelineItem(config, null));
            }
        });
        if (this.timelineItems.length > 0) {
            this.timelineItems.forEach(item => item.isFinal = false);
            this.timelineItems[this.timelineItems.length - 1].isFinal = true;
        }
    }

    createTimelineItem(config: any, log: any) {
        let status = null;
        let statusDesc: string | null = 'TransactionLog.Status.Processing';

        if (log) {
            if (log.transactionStatus === 'SUCCESS') {
                status = 1;
                statusDesc = 'TransactionLog.Status.Success';
            } else if (log.transactionStatus === 'FAILED') {
                status = -1;
                statusDesc = 'TransactionLog.Status.Fail';
            } else {
                status = 0;
            }
        } else {
            status = null;
            statusDesc = null;
        }

        const isCompleted = status === 1;
        const isCurrent = status === 0;
        const hasData = !!log;

        let icon = 'pi pi-check';
        let iconBg = 'bg-slate-300';
        let iconClass = 'text-slate-500';

        if (isCompleted) {
            icon = 'pi pi-check';
            iconBg = 'bg-emerald-500';
            iconClass = '';
        } else if (status === -1) {
            icon = 'pi pi-times';
            iconBg = 'bg-red-500';
            iconClass = '';
        } else if (isCurrent) {
            icon = 'pi pi-spin pi-spinner';
            iconBg = 'bg-blue-500';
            iconClass = '';
        }

        return {
            label: config.label,
            icon: icon,
            iconBg: iconBg,
            iconClass: iconClass,
            status: status,
            subLabel: log?.logTime,
            isDetailed: hasData,
            isFinal: false,
            details: hasData ? [
                ...(log.userId ? [{ label: 'TransactionLog.Timeline.Details.Performer', value: log.fullName || log.userId, isTitle: true }] : []),
                ...(status === -1 ? [{ label: 'TransactionLog.Timeline.Details.Reason', value: log.reason ? `"${log.reason}"` : '--', isItalic: true }] : []),
                { label: 'TransactionLog.Timeline.Details.Time', value: log.logTime, isDate: true },
                {
                    label: 'TransactionLog.Timeline.Details.Status',
                    value: statusDesc,
                    isStatus: true,
                    statusValue: status
                },
                { label: 'TransactionLog.Timeline.Details.IpAddress', value: log.ipAddress || '--' }
            ] : []
        };
    }

    goBack() {
        this.router.navigate(['/transaction-log']);
    }
}
