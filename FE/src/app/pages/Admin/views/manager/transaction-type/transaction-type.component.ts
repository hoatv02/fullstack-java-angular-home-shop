import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { TransactionTypeService } from '../../../service/transaction-type.service';

@Component({
    selector: 'app-transaction-type',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './transaction-type.component.html',
})
export class TransactionTypeComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'TransactionType.Title', routerLink: '/customer' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusList.Active': 'success',
            'Common.StatusList.Fail': 'danger'
        },
        customerTypeName: {
            'TransactionType.Individual': 'status-secondary',
            'TransactionType.Business': 'info'
        },
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'transactionCode', header: 'TransactionType.Table.Code' },
        { field: 'transactionName', header: 'TransactionType.Table.Name' },
        { field: 'effectiveFrom', header: 'OtpConfig.FromDate', type: 'date' },
        // { field: 'effectiveTo', header: 'OtpConfig.ToDate', type: 'date' },
        { field: 'customerTypeName', header: 'STATISTICS.customer.GROUP', type: 'tag' },
        { field: 'status', header: 'Common.Status', type: 'tag' }
    ];
    dataList = [];
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
        private transactionTypeService: TransactionTypeService,
        private noticeService: NotificationService,
        public permissionCommon: PermissionCommonService
    ) { }
    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('TRANSACTION_TYPE', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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
        this.formInput.pageNumber = event.first;
        this.formInput.pageSize = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }
    statusChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.customerType = event?.code;
        } else {
            const { customerType, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    formDateChange(event: any) {
        this.currentFirstPage()

        if (event) {
            const fromDate = moment(event).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.fromDate = fromDate;
            if (this.formInput.toDate && this.formInput.fromDate) {
                this.getData();
            }
        } else {
            const { fromDate, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            if (!this.formInput.toDate) {
                this.getData();
            }
        }
    }
    toDateChange(event: any) {
        this.currentFirstPage()

        if (event) {
            const toDate = moment(event).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.toDate = toDate;
            if (this.formInput.toDate && this.formInput.fromDate) {
                this.getData();
            }
        } else {
            const { toDate, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            if (!this.formInput.fromDate) {
                this.getData();
            }
        }
    }
    editTransactionType(event?: any) {
        const action = event?.action;
        const requestId = event?.row?.requestId || event?.requestId;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/transaction-type/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/transaction-type/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/transaction-type/create'], { relativeTo: this.route });
        }
    }
    getData() {
        this.loadingService.show();
        const { page, size, ...formInput } = this.formInput;
        this.transactionTypeService
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
                        this.dataList = data?.data?.data?.map((item: any, index: number) => ({
                            ...item,
                            status: item?.status ? 'Common.StatusList.Active' : 'Common.StatusList.Inactive',
                            customerTypeName: item.customerType === '1' ? 'TransactionType.Individual' : 'TransactionType.Business',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                        }));
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()
        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }

    exportExcel() { }

    transactionTypeData: any;
    onConfirmDelete(event: any) {
        this.displayConfirmation = true;
        this.transactionTypeData = { ...event?.row };
    }

    deleteTransactionType() {
        this.loadingService.show();
        this.transactionTypeService
            .deleteTransactionType(this.transactionTypeData.requestId)
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
                        this.displayConfirmation = false;
                        this.getData();
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
        const requestId = event?.row?.requestId;
        this.router.navigate([`/transaction-type/detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }

    currentFirstPage() {
        this.formInput.pageNumber = 0;
        this.first = 0;
    }
}
