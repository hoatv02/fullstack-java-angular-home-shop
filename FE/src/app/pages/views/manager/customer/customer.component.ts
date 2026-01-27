import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { AuthService } from '../../../../layout/service/auth.service';
import { LoadingService } from '../../../../layout/service/loading.service';
import { NotificationService } from '../../../../layout/service/notification.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';

@Component({
    selector: 'app-customer',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './customer.component.html',
})
export class CustomerComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'Breadcrumbs.CustomerManagement.Customer', routerLink: '/customer' }];
    statusList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: -4, name: 'Common.StatusList.Lock' }
    ];

    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusList.StatusActive': 'success',
            'Common.StatusList.Lock': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'fullName', header: 'CustomerManagement.Customer.FullName' },
        { field: 'cifNumber', header: 'CustomerManagement.Customer.CifCode' },
        { field: 'phoneNumber', header: 'CustomerManagement.Customer.PhoneNumber' },
        { field: 'email', header: 'CustomerManagement.Customer.Email' },
        { field: 'status', header: 'CustomerManagement.Customer.Status', type: 'tag' }
    ];
    dataList = [];
    otpConfirmVisiable: boolean = false;
    otpValue: string = '';
    customerData: any;

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
        public permissionCommon: PermissionCommonService,
        private authService: AuthService,
        private translate: TranslationService,
        private notification: NotificationService

    ) { }
    tabs: { title: string; value: number; component?: any; content?: string }[] = [];
    selectTabs = '0';
    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('CUSTOMER', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.permissions = result;
            });
    }
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first + 1;
        this.formInput.size = event.rows;
        if (this.selectTabs === '0') {
            this.getData(1);
            this.formInput.userType = 1;
        }
    }

    handleLazyLoadTC(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first + 1;
        this.formInput.size = event.rows;
        if (this.selectTabs === '1') {
            this.getData(2);
            this.formInput.userType = 2;
        }
    }

    statusCNChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.status = event?.code;
            this.getData(1);
        } else {
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            this.getData(1);
        }
    }

    statusDNChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.status = event?.code;
            this.getData(2);
        } else {
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            this.getData(2);
        }
    }
    tabIndexChange(event: any) {
        this.selectTabs = event;
        this.formInput.textSearch = '';
        this.formInput.status = '';
    }
    getData(type: number) {
        this.loadingService.show();
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.customerService
            .getListDataCustomer({
                ...formInput,
                userType: type
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
                            status: item.status === 1 ? 'Common.StatusList.StatusActive' : 'Common.StatusList.Lock',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                        }));
                        this.totalRecords = data?.data?.totalCount || data?.data?.totalElements || 0;
                    }
                }
            });
    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()
        this.formInput.textSearch = keyword.trim() || '';
        if (this.selectTabs === '0') {
            this.getData(1);
        } else {
            this.getData(2);
        }
    }
    confirmationLock: boolean = false;
    reasonValue: string = '';
    onLockCustomer(event: any, type: number) {
        this.otpValue = '';
        this.reasonValue = '';
        this.customerData = { ...event, type: type };
        this.confirmationLock = true;
    }
    stepBySendOtp() {
        this.sendOtpCustomer();
    }
    sendOtpCustomer() {
        const tokenDecode = this.authService.deCodeAccessToken();
        const userId = tokenDecode?.['x-user-id'];
        this.loadingService.show();
        this.customerService
            .senOtpCustomer(userId)
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
                        this.customerData = { ...this.customerData, ...data?.data };
                        this.otpConfirmVisiable = true;
                        this.confirmationLock = false;
                    }
                }
            });
    }
    submitLockCustomer() {
        const tokenDecode = this.authService.deCodeAccessToken();
        const username = tokenDecode?.['x-user-name'];
        this.loadingService.show();
        this.customerService
            .updateCustomerStatusLock({
                userId: this.customerData.id,
                status: this.customerData.status === 'Common.StatusList.Lock' ? 'ACTIVE' : 'LOCK',
                otp: this.otpValue,
                sessionId: this.customerData?.sessionId,
                reason: this.reasonValue || '',
                changedByUser: username || ''
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
                    if (data?.code === 200) {
                        this.otpConfirmVisiable = false;
                        this.getData(this.customerData?.type);
                    }
                }
            });
    }
    exportExcel() {
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.customerService.exportCustomerExcel({ ...formInput }).pipe(
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
        const requestId = event?.row?.id;
        this.router.navigate([`/customer/${requestId}`], {
            queryParams: {
                username: event?.row?.cifNumber + ' - ' + event?.row?.fullName,
                externalId: event?.row?.externalId
            }
        });
    }
    currentFirstPage() {
        this.formInput.page = 1;
        this.first = 0;
    }
}
