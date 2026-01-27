import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { ACTION } from '../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { ConfigOtpService } from '../../../service/config-otp.service';
import { CustomerService } from '../../../service/customer.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { TransactionService } from '../../../service/transactions.service';

@Component({
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    selector: 'app-email-gateway',
    templateUrl: './email-gateway.component.html',
})
export class EmailGatewayComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private transactionService: TransactionService,
        private configOtpService: ConfigOtpService,
        private translate: TranslationService, // ✅ Inject TranslateServ,
        public permissionCommon: PermissionCommonService
    ) { }

    // =================== Dữ liệu ===================
    typeConfigList: any[] = [
        { code: 1, name: 'EmailGateway.Type.TOTP' },
        { code: 2, name: 'EmailGateway.Type.OCRA' },
        { code: 3, name: 'EmailGateway.Type.SMS' }
    ];

    GetwayList: any[] = [{ code: 1, name: 'EmailGateway.GatewayType.SMTP' }];

    otpData: any;
    formInput: FormInputModel = new FormInputModel();

    breadcrumbList = [{ label: 'EmailGateway.BreadcrumbTitle', routerLink: '/customer' }];

    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusActive': 'success',
            'Common.StatusInactive': 'danger'
        }
    };

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },

        { field: 'name', header: 'EmailGateway.Column.Name' },
        { field: 'user', header: 'EmailGateway.Column.User' },
        { field: 'from', header: 'EmailGateway.Column.From' },
        { field: 'typeName', header: 'EmailGateway.Column.Type' },
        { field: 'host', header: 'EmailGateway.Column.Host' },
        { field: 'port', header: 'EmailGateway.Column.Port' },
        { field: 'effectiveFrom', header: 'EmailGateway.Column.FromDate', type: 'date' },
        { field: 'effectiveTo', header: 'EmailGateway.Column.ToDate', type: 'date' },
        { field: 'status', header: 'EmailGateway.Column.Status', type: 'tag' }
    ];

    dataList = [];

    statusList: any[] = [
        { code: 1, name: 'Common.Success' },
        { code: 0, name: 'Common.Failure' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    permissions: Record<string, boolean> = {};
    permissionsSub?: Subscription;
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('EMAIL_GATEWAY', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.permissions = result;
            });
    }

    ngOnDestroy() {
        // quan trọng: hủy subscription để tránh memory leak
        this.permissionsSub?.unsubscribe();
    }

    // =================== Các hàm xử lý ===================
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.pageNumber = event.first;
        this.formInput.pageSize = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }

    typeConfigChange(event: any) {
        this.formInput.page = 1;
        this.first = 0;
        if (event) {
            this.formInput.type = event?.code;
        } else {
            const { type, ...formInput } = this.formInput;
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
            this.router.navigate([`/configuration-email-gateway/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/configuration-email-gateway/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/configuration-email-gateway/create'], { relativeTo: this.route });
        }
    }

    getData() {
        this.loadingService.show();
        const { page, size, textSearch, ...formInput } = this.formInput;
        this.configOtpService
            .getListDataEmailConfig({
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
                            status: item.status === 1 ? 'Common.StatusActive' : 'Common.StatusInactive',
                            typeName: item.type === '1' ? 'EmailGateway.GatewayType.SMTP' : '',
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

    exportExcel() { }

    emailData: any;
    onConfirmDeletefirm(event: any) {
        this.displayConfirmation = true;
        this.emailData = { ...event?.row };
    }

    deleteConfigEmail() {
        this.loadingService.show();
        this.configOtpService
            .deleteConfigEmail(this.emailData.requestId)
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

    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }

    onView(event: any) {
        const requestId = event?.row?.requestId;
        this.router.navigate([`/configuration-email-gateway/detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }
}
