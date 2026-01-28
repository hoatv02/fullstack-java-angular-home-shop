import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { DeviceService } from '../../../service/device.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
@Component({
    selector: 'app-device-manager',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './device-manager.component.html',
})
export class DeviceManagerComponent {
    displayConfirmation: boolean = false;
    confirmationLock: boolean = false;
    first: number = 0;
    reasonValue: string = '';
    Devices: any = {};
    statusList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: 0, name: 'Common.StatusList.StatusInactive' },
        { code: -1, name: 'Common.StatusList.UNREGISTERED' },
        { code: 2, name: 'Common.StatusList.SUSPEND' },
        { code: 3, name: 'Common.StatusList.OtherDevice' },
        { code: -2, name: 'Common.StatusList.DEREGISTERED' },
        { code: -4, name: 'Common.StatusList.Lock' }
    ];
    breadcrumbList = [{ label: 'Common.DeviceList', routerLink: '/device' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusList.StatusActive': 'success', // Đang hoạt động
            'Common.StatusList.StatusInactive': 'danger', // Ngừng hoạt động (không tiêu cực)
            'Common.StatusList.UNREGISTERED': 'info', // Chưa đăng ký
            'Common.StatusList.SUSPEND': 'status-orange', // Tạm ngưng
            'Common.StatusList.DEREGISTERED': 'danger', // Đã hủy đăng ký
            'Common.StatusList.OtherDevice': 'status-secondary', //Thiết bị khác
            'Common.StatusList.Lock': 'danger' // Bị khóa
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'id', header: 'CustomerManagement.CustomerDetail.DeviceId' },
        { field: 'deviceId', header: 'CustomerManagement.CustomerDetail.ApplicationId' },
        { field: 'cif', header: 'CustomerManagement.Customer.CifCode' },
        { field: 'fullName', header: 'CustomerManagement.CustomerDetail.FullName' },
        { field: 'deviceName', header: 'CustomerManagement.CustomerDetail.DeviceName' },
        { field: 'os', header: 'CustomerManagement.CustomerDetail.Os' },
        { field: 'osVersion', header: 'Version' },
        { field: 'createAt', header: 'CustomerManagement.CreateDate', type: 'date' },
        { field: 'status', header: 'CustomerManagement.CustomerDetail.Status', type: 'tag' }
    ];
    dataList: any = [];
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    skipNextLazyLoad = false;
    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private authService: AuthService,
        public permissionCommon: PermissionCommonService,
        private notification: NotificationService,
        private deviceService: DeviceService


    ) { }

    otpConfirmVisiable: boolean = false;
    onViewDeviceVisiable: boolean = false;
    otpValue: string = '';
    dataKeysDeviceDetail: { key: string; value: any }[] = [];
    permissions: Record<string, boolean> = {};
    permissionsSub?: Subscription;
    private destroy$ = new Subject<void>();
    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('DEVICE', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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
        this.formInput.page = event.first + 1;
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
    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.customerService
            .getListDataCustomerDevice({
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
                        this.dataList = data?.data?.data?.map((item: any, index: number) => {
                            const statusItem = this.statusList.find((s) => s.code === item.status);
                            return {
                                ...item,
                                status: statusItem ? statusItem.name : 'Common.StatusList.Unknown',
                                stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                            };
                        });
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }

    onLockDevice(event: any) {
        this.otpValue = '';
        this.reasonValue = '';
        this.Devices = { ...event };
        this.confirmationLock = true;
    }
    stepBySendOtp() {
        this.sendOtpDevice();
    }
    sendOtpDevice() {
        const tokenDecode = this.authService.deCodeAccessToken();
        const userId = tokenDecode?.['x-user-id'];
        this.loadingService.show();
        this.customerService
            .senOtpDevice(userId)
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
                        this.otpConfirmVisiable = true;
                        this.Devices = { ...this.Devices, ...data?.data };
                        this.confirmationLock = false;
                    }
                }
            });
    }
    submitLockDevice() {
        const tokenDecode = this.authService.deCodeAccessToken();
        const username = tokenDecode?.['x-user-name'];

        this.loadingService.show();
        this.customerService
            .updateCustomerDeviceStatusLock({
                deviceInfo: {
                    deviceId: this.Devices.deviceId
                },
                userId: this.Devices.userId,
                status: this.Devices.status === 'Common.StatusList.StatusInactive' ? 'ACTIVE' : this.Devices.status === 'Common.StatusList.StatusActive' ? 'LOCK' : this.Devices.status === 'Common.StatusList.Lock' ? 'ACTIVE' : '',
                otp: this.otpValue,
                sessionId: this.Devices?.sessionId,
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
                        this.confirmationLock = false;
                        this.otpConfirmVisiable = false;
                        this.getData();
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
        this.deviceService.exportDeviceExcel({ ...formInput }).pipe(
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
        this.router.navigate([`/device/${requestId}`]);
    }
    currentFirstPage() {
        this.formInput.page = 1;
        this.first = 0;
    }
}
