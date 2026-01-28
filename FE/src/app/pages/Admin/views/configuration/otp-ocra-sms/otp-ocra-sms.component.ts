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
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { ConfigOtpService } from '../../../service/config-otp.service';
import { CustomerService } from '../../../service/customer.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { TransactionService } from '../../../service/transactions.service';

@Component({
    selector: 'app-otp-ocra-sms',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './otp-ocra-sms.component.html',
})
export class OtpOcraSmsComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;
    typeConfigList: any[] = [
        {
            code: 1,
            name: 'TOTP'
        },
        {
            code: 2,
            name: 'OCRA OTP'
        },
        {
            code: 3,
            name: 'SMS OTP'
        }
    ];
    confirmationDeleteOtp: boolean = false;
    otpData: any;
    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'OtpConfig.Breadcrumb', routerLink: '/customer' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusList.Active': 'success',
            'Common.StatusList.Inactive': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'name', header: 'OtpConfig.Name' },
        { field: 'typeName', header: 'OtpConfig.Type' },
        { field: 'effectiveFrom', header: 'OtpConfig.FromDate', type: 'date' },
        // { field: 'effectiveTo', header: 'OtpConfig.ToDate', type: 'date' },
        { field: 'createdDate', header: 'OtpConfig.CreatedDate', type: 'date' },
        { field: 'status', header: 'OtpConfig.Status.Title', type: 'tag' }
    ];
    dataList = [];
    statusList: any[] = [
        {
            code: 1,
            name: 'Common.StatusList.Active'
        },
        {
            code: 0,
            name: 'Common.StatusList.Inactive'
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
            .subscribePermissions('OTP_CONFIG', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.permissions = result;
            });
    }

    ngOnDestroy() {
        // quan trọng: hủy subscription để tránh memory leak
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
    typeConfigChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.type = event?.code;
        } else {
            const { type, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    formToDateChange(event: any) {
        this.currentFirstPage()
        if (event?.length === 2) {
            const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.from = fromDate;
            this.formInput.to = toDate;
            this.getData();
        } else if (event?.length === 0) {
            this.formInput.from = null;
            this.formInput.to = null;
            this.getData();
        }
    }
    editConfigOtp(event?: any) {
        const action = event?.action;
        const requestId = event?.row?.requestId || event?.requestId;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/configuration-otp/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/configuration-otp/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/configuration-otp/create'], { relativeTo: this.route });
        }
    }
    getData() {
        this.loadingService.show();
        const { page, size, textSearch, ...formInput } = this.formInput;
        this.configOtpService
            .getListDataOtpConfig({
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
                            status: item.status === 1 ? 'Common.StatusList.Active' : 'Common.StatusList.Inactive',
                            typeName: item.type === 1 ? 'OtpConfig.TypeList.TOTP' : item.type === 2 ? 'OtpConfig.TypeList.OCRA' : 'OtpConfig.TypeList.SMS',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                        }));

                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()
        this.formInput.userId = keyword.trim() || '';
        this.getData();
    }

    onConfirmDeletefirmDeleteOtp(event: any) {
        this.confirmationDeleteOtp = true;
        this.otpData = { ...event?.row };
    }
    exportExcel() { }

    deleteConfigOtp() {
        this.loadingService.show();
        this.configOtpService
            .deleteConfigOtp(this.otpData.requestId)
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
                        this.confirmationDeleteOtp = false;
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
        this.router.navigate([`/configuration-otp/detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }

    currentFirstPage() {
        this.formInput.pageNumber = 1;
        this.first = 0;
    }
}
