import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { CustomerService } from '../../../service/customer.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { TransactionService } from '../../../service/transactions.service';
import { TableComponent } from '../../../components/table/table.component';

@Component({
    selector: 'app-statistical-transaction',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './statistical-transaction.component.html',
})
export class StatisticalTransactionComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;

    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'STATISTICS.TRANSACTION.transaction_statistic', routerLink: '/statistical-transaction' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'STATISTICS.TRANSACTION.success': 'success',
            'STATISTICS.TRANSACTION.failed': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'createdAt', header: 'STATISTICS.TRANSACTION.time', type: 'formatDate', formatDate: 'dd/MM/yyyy' },
        { field: 'success', header: 'STATISTICS.TRANSACTION.success_transaction', styleClass: 'text-center' },
        { field: 'failed', header: 'STATISTICS.TRANSACTION.failed_transaction', styleClass: 'text-center' },
        { field: 'expired', header: 'STATISTICS.TRANSACTION.expired_transaction', styleClass: 'text-center' },
        { field: 'cancel', header: 'STATISTICS.TRANSACTION.cancelled_transaction', styleClass: 'text-center' },
        { field: 'total', header: 'STATISTICS.TRANSACTION.total_transaction', styleClass: 'text-center' },

    ];

    customerTypeList: any[] = [
        {
            code: 1,
            name: 'TransactionType.Individual'
        },
        {
            code: 2,
            name: 'TransactionType.Business'
        }
    ];
    applicationList: any[] = [
        {
            code: 1,
            name: 'Website'
        },
        {
            code: 2,
            name: 'App'
        }
    ];
    dataList = [];
    transactionList: any[] = [];
    statusList: any[] = [
        { code: 1, name: 'STATISTICS.TRANSACTION.success' },
        { code: 0, name: 'STATISTICS.TRANSACTION.failed' }
    ];
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;

    permissionsSub?: Subscription;
    permissions: Record<string, boolean> = {};
    private destroy$ = new Subject<void>();

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private transactionService: TransactionService,
        public permissionCommon: PermissionCommonService,
        private translate: TranslationService,
        private notification: NotificationService

    ) { }
    ngOnInit(): void {
        this.getDropdownTransaction();
        this.loadFunctionPermission();
    }

    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('TRANSACTION_STATISTIC', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.permissions = result;
            });
    }
    ngOnDestroy() {
        this.permissionsSub?.unsubscribe();
    }

    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first;
        this.formInput.size = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }

    currentFirstPage() {
        this.formInput.page = 0;
        this.first = 0;
    }
    transactionTypeChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.transactionType = event?.transactionCode;
        } else {
            const { transactionType, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    customerTypeChange(event: any) {
        this.currentFirstPage()

        if (event) {
            this.formInput.userType = event?.code;
        } else {
            const { userType, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    deviceChangeChange(event: any) {
        this.currentFirstPage()

        if (event) {
            this.formInput.type = event?.code;
            this.getData();
        } else {
            const { type, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            this.getData();
        }
    }
    formToDateChange(event: any) {
        this.currentFirstPage()

        if (event?.length === 2) {
            const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.fromDate = fromDate;
            this.formInput.toDate = toDate;
            this.getData();
        } else if (event?.length === 0) {
            this.formInput.fromDate = null;
            this.formInput.toDate = null;
            this.getData();
        }
    }

    exportExcel() {
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.transactionService.exportStatisticalTransactionExcel({ ...formInput }).pipe(
            catchError((error) => {
                return of([]);
            }),
            finalize(() => {
                this.loadingService.hide();
            })
        )
            .subscribe({
                next: (data: any) => {
                    if (data?.data?.status === "PENDING") {
                        this.notification.showPendingExport();
                    }
                }
            });
    }

    getDropdownTransaction() {
        this.transactionService
            .getDropdownTransaction()
            .pipe(
                catchError((error) => {
                    return of([]);
                }),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.data) {
                        this.transactionList = data?.data?.map((items: any) => {
                            return {
                                ...items,
                                code: items?.transactionCode,
                                name: items?.transactionName
                            };
                        });
                    }
                }
            });
    }
    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.transactionService
            .getListStatisticalData({
                ...formInput
            })
            .pipe(
                catchError((error) => {
                    return of([]);
                }),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.data) {
                        this.dataList = data?.data?.data?.map((item: any, index: number) => ({
                            ...item,
                            userType: item.userType === 1 ? 'STATISTICS.TRANSACTION.company_user' : 'STATISTICS.TRANSACTION.personal_user',
                            status: item.status === 1 ? 'STATISTICS.TRANSACTION.success' : 'STATISTICS.TRANSACTION.failed',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1,
                        }));
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });

        //  { field: 'success', header: 'STATISTICS.TRANSACTION.success_transaction', styleClass: 'text-center' },
        // { field: 'failed', header: 'STATISTICS.TRANSACTION.failed_transaction', styleClass: 'text-center' },
        // { field: 'expired', header: 'STATISTICS.TRANSACTION.expired_transaction', styleClass: 'text-center' },
        // { field: 'cancel', header: 'STATISTICS.TRANSACTION.cancelled_transaction', styleClass: 'text-center' },
        // { field: 'total', header: 'STATISTICS.TRANSACTION.total_transaction', styleClass: 'text-center' },

    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()

        this.formInput.userId = keyword.trim() || '';
        this.getData();
    }

    // =================== Xử lý chuyển đổi trạng thái ===================
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }
    onView(event: any) {
        const requestId = event?.data?.id;
        this.router.navigate([`/customer-detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }
}
