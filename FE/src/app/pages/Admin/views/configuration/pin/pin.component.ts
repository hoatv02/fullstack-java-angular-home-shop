import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { ConfigOtpService } from '../../../service/config-otp.service';
import { CustomerService } from '../../../service/customer.service';
import { TransactionService } from '../../../service/transactions.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';

@Component({
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    selector: 'app-pin',
    templateUrl: './pin.component.html',
    styleUrl: './pin.component.scss'
})
export class PinComponent {
    displayConfirmation = false;
    first = 0;
    totalRecords = 0;
    pinData: any;

    storage = [
        { code: 0, name: 'ConfigPin.Storage.Device' },
        { code: 1, name: 'ConfigPin.Storage.Server' }
    ];

    statusList = [
        { code: 1, name: 'Common.StatusActive' },
        { code: 0, name: 'Common.StatusInactive' }
    ];

    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusActive': 'success',
            'Common.StatusInactive': 'danger'
        }
    };

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },

        { field: 'name', header: 'ConfigPin.Columns.Name' },
        { field: 'storageTypeName', header: 'ConfigPin.Columns.StorageType' },
        { field: 'effectiveFrom', header: 'ConfigPin.Columns.FromDate', type: 'date' },
        { field: 'effectiveTo', header: 'ConfigPin.Columns.ToDate', type: 'date' },
        { field: 'status', header: 'ConfigPin.Columns.Status', type: 'tag' }
    ];

    breadcrumbList = [{ label: 'ConfigPin.List.Title', routerLink: '/customer' }];

    formInput: FormInputModel = new FormInputModel();
    dataList: any[] = [];

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
        private configOtpService: ConfigOtpService,
        private translate: TranslationService,
        private noticeService: NotificationService,
        public permissionCommon: PermissionCommonService
    ) { }

    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('PIN_CONFIG', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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

    storageTypeChange(event: any) {
        this.formInput.page = 1;
        this.first = 0;
        if (event) {
            this.formInput.storageType = event?.code;
        } else {
            const { storageType, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }

    formToDateChange(event: any) {
        if (event?.length === 2) {
            const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.from = fromDate;
            this.formInput.to = toDate;
        } else {
            this.formInput.from = null;
            this.formInput.to = null;
        }
        this.getData();
    }

    editTransactionType(event?: any) {
        const action = event?.action;
        const requestId = event?.row?.requestId || event?.requestId;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/configuration-pin/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/configuration-pin/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/configuration-pin/create'], { relativeTo: this.route });
        }
    }

    getData() {
        this.loadingService.show();
        const { page, size, textSearch, ...formInput } = this.formInput;
        this.configOtpService
            .getListDataPinOtpConfig({ ...formInput })
            .pipe(
                catchError((error) => {
                    return of([]);
                }),
                finalize(() => this.loadingService.hide())
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.data) {
                        this.dataList = data?.data?.data?.map((item: any, index: number) => ({
                            ...item,
                            status: item.status === 1 ? 'Common.StatusActive' : 'Common.StatusInactive',
                            storageTypeName: item.storageType === 1 ? 'ConfigPin.Storage.Server' : 'ConfigPin.Storage.Device',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                        }));
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }

    handleSearchKeyword(keyword: any) {
        this.formInput.userId = keyword.trim() || '';
        this.getData();
    }

    onConfirmDeletefirmPin(event: any) {
        this.displayConfirmation = true;
        this.pinData = { ...event?.row };
    }

    deleteConfigPin() {
        this.loadingService.show();
        this.configOtpService
            .deleteConfigPin(this.pinData.requestId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingService.hide())
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

    exportExcel() { }

    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }

    onView(event: any) {
        const requestId = event?.row?.requestId;
        this.router.navigate([`/configuration-pin/detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }
}
