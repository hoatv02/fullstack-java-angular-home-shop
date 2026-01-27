import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { TransactionService } from '../../../service/transactions.service';
import { ACTION } from '../../../../utils/enums/action.enum';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { NotificationService } from '../../../../layout/service/notification.service';

@Component({
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './transaction-log.component.html',
    styleUrl: './transaction-log.component.scss'
})
export class TransactionLogComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'TransactionLog.TransactionLogTitle', routerLink: '/customer' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'TransactionLog.Status.Processing': 'info', // Đang xử lý
            'TransactionLog.Status.Success': 'success', // Thành công
            'TransactionLog.Status.Rejected': 'danger', // Bị từ chối
            'TransactionLog.Status.Fail': 'danger', // Thất bại
            'TransactionLog.Status.Cancel': 'danger', // Người dùng hủy
            'TransactionLog.Status.Expired': 'danger' // Hết hạn
        }
    };

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'paymentId', header: 'TransactionLog.Table.TransactionId' },
        { field: 'cifNumber', header: 'CustomerManagement.Customer.CifCode' },
        { field: 'fullName', header: 'TransactionLog.Table.FullName' },
        { field: 'customerType', header: 'Payment.CustomerType' },
        { field: 'type', header: 'TransactionLog.Table.TypeTransaction' },
        { field: 'paymentMethodName', header: 'TransactionLog.Table.PaymentInfoType' },
        { field: 'createdAt', header: 'TransactionLog.Table.CreatedAt', type: 'date' },
        { field: 'status', header: 'CustomerManagement.Customer.Status', type: 'tag' }
    ];
    dataList = [];
    dropdownTransactionType: any[] = []
    statusList: any[] = [
        { code: 0, name: 'TransactionLog.Status.Processing' }, // Đang xử lý
        { code: 1, name: 'TransactionLog.Status.Success' }, // Thành công
        // { code: -1, name: 'TransactionLog.Status.Rejected' }, // Từ chối
        { code: 3, name: 'TransactionLog.Status.Fail' }, // Thất bại
        { code: 5, name: 'TransactionLog.Status.Cancel' }, // Hủy
        { code: 4, name: 'TransactionLog.Status.Expired' } // Hết hạn
    ];
    // mai sửa cái trạng thái này lại 0: đang xử lý, 1: thành công, -1: từ chối, -2: thất bại
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    permissions: Record<string, boolean> = {};
    permissionsSub?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private transactionService: TransactionService,
        private messageService: MessageService,
        private permissionCommon: PermissionCommonService,
        private translate: TranslationService,
        private notification: NotificationService

    ) { }
    ngOnInit(): void {
        this.getDropdownTransactionType()
        this.loadFunctionPermission();

    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('TRANSACTION_HISTORY', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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

    statusChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.status = event?.code;
        } else {
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    transactionTypeChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.typeTransaction = event?.code;
        } else {
            const { typeTransaction, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
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
    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.transactionService
            .getListData({
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
                        this.dataList = data.data.data.map((item: any, index: number) => {
                            const statusItem = this.statusList.find((s) => s.code === item?.status);
                            return {
                                ...item,
                                status: statusItem?.name ?? 'Common.StatusList.Unknown',
                                paymentMethodName: item?.paymentMethod?.name || '',
                                customerType: item?.customerType === 'BC' ? 'Payment.Individual' : 'Payment.Enterprise',
                                stt: (data.data.pageNumber - 1) * data.data.pageSize + index + 1
                            };
                        });
                        this.totalRecords = data.data.totalCount || 0;
                    }
                }
            });
    }

    getDropdownTransactionType() {
        this.transactionService
            .getDropdownTransactionType()
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
                    if (data?.code === 200) {
                        this.dropdownTransactionType = data?.data?.map((items: any) => {
                            return {
                                code: items.transactionCode,
                                name: items.transactionName
                            }
                        });
                    }
                }
            });
    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()

        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }


    exportExcel() {
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.transactionService.exportTransactionExcel({ ...formInput }).pipe(
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
    // =================== Xử lý chuyển đổi trạng thái ===================
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }

    onView(event: any) {
        const action = event?.action;
        const requestId = event?.row?.paymentId;
        if (action === ACTION.DETAIL) {
            this.router.navigate([`/transaction-log/detail/${requestId}`], { relativeTo: this.route });
        }
    }

    copyToClipboard(data: any) {
        const text = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(text);
        this.messageService.add({ severity: 'info', summary: this.translate.translate('Common.Message.CopySuccess'), life: 2000 });
        if (!data) {
            this.messageService.add({
                severity: 'info',
                summary: this.translate.translate('Common.Message.NoData'),
                life: 2000
            });
        }
    }
    currentFirstPage() {
        this.formInput.page = 0;
        this.first = 0;
    }
}
