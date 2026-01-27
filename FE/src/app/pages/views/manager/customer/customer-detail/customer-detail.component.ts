import { Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../../layout/service/auth.service';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../../components/table/table.component';
import { FileExportService } from '../../../../service/FileExport.service';
import { CustomerService } from '../../../../service/customer.service';
import { DeviceService } from '../../../../service/device.service';

@Component({
    selector: 'app-customer-detail',
    imports: [SHARED_MODULES, TableComponent,],
    providers: [ConfirmationService, MessageService, CustomerService, DeviceService],
    standalone: true,
    templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent {
    private fileExportService = inject(FileExportService);

    displayConfirmation: boolean = false;
    confirmationLock: boolean = false;
    otpConfirmVisiable: boolean = false;
    first: number = 0;
    selectTabs: string = '0';
    otpValue: string | any = ''
    reasonValue: string = ''

    xmlContent: any
    Devices: any = {};
    breadcrumbList = [
        { label: 'Breadcrumbs.CustomerManagement.Customer', routerLink: '/customer' },
        { label: 'Breadcrumbs.CustomerManagement.CustomerDetail', routerLink: '/customer-detail' }
    ];
    statusList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: 0, name: 'Common.StatusList.StatusInactive' },
        { code: -1, name: 'Common.StatusList.UNREGISTERED' },
        { code: 2, name: 'Common.StatusList.SUSPEND' },
        { code: 3, name: 'Common.StatusList.OtherDevice' },
        { code: -2, name: 'Common.StatusList.DEREGISTERED' },
        { code: -4, name: 'Common.StatusList.Lock' },
    ]
    statusUserList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: 0, name: 'Common.StatusList.StatusInactive' },
        { code: -4, name: 'Common.StatusList.Lock' },

    ]
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Common.StatusList.StatusActive': 'success',      // Đang hoạt động
            'Common.StatusList.StatusInactive': 'danger',  // Ngừng hoạt động (không tiêu cực)
            'Common.StatusList.UNREGISTERED': 'info',    // Chưa đăng ký
            'Common.StatusList.SUSPEND': 'status-orange',           // Tạm ngưng
            'Common.StatusList.DEREGISTERED': 'danger',       // Đã hủy đăng ký
            'Common.StatusList.OtherDevice': 'status-secondary',       //Thiết bị khác
            'Common.StatusList.Lock': 'danger',               // Bị khóa
        },
        result: {
            'Common.StatusList.Success': 'success',
            'Common.StatusList.Fail': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        {
            field: 'deviceId', header: 'CustomerManagement.CustomerDetail.DeviceId',
            type: 'link',
            routerLink: (row: any) => ['/device', row.id]
        },
        { field: 'brandName', header: 'DeviceDetail.BrandName' },
        { field: 'osVersionName', header: 'CustomerManagement.CustomerDetail.Os' },
        { field: 'model', header: 'Model' },
        { field: 'deviceName', header: 'CustomerManagement.CustomerDetail.DeviceName' },
        { field: 'createdAt', header: 'CustomerManagement.CreateDate', type: 'date' },
        { field: 'status', header: 'CustomerManagement.CustomerDetail.Status', type: 'tag' }
    ];
    dataList = [];

    historyColumns = [
        { field: 'stt', header: 'STT', type: 'stt', width: '70px' },
        { field: 'requestTime', header: 'CustomerManagement.DeviceLog.RequestTime', type: 'date', width: '200px' },
        { field: 'actionName', header: 'CustomerManagement.DeviceLog.ActionName' },
        { field: 'reason', header: 'CustomerManagement.DeviceLog.Reason' },
        { field: 'userName', header: 'CustomerManagement.DeviceLog.Implementer' },
        { field: 'result', header: 'CustomerManagement.DeviceLog.Result', type: 'tag' },
    ];
    historyList = [];
    historyTotalRecords: number = 0;
    formInputHistory: FormInputModel = new FormInputModel();
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    idUser: string | null = '';
    urlDevice: string = '';
    username: any;
    externalId: any;
    user: any = {};

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private authService: AuthService,
        private deviceService: DeviceService,
    ) {
        this.idUser = this.route.snapshot.paramMap.get('id');
        this.urlDevice = this.router.url;
        this.username = this.route.snapshot.queryParamMap.get('username');
        this.externalId = this.route.snapshot.queryParamMap.get('externalId');
    }

    ngOnInit(): void {
        this.getDataUserDetail(this.externalId ?? '');
    }
    onKeyPress(event: KeyboardEvent) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    }
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first + 1;
        this.formInput.size = event.rows;
        if (this.selectTabs === '1' && !this.route.firstChild) {
            this.getDataDetail(this.idUser ?? '');
        }
    }
    CustomerStatusList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: 0, name: 'Common.StatusList.StatusInactive' }
    ]
    getDataUserDetail(id: string) {
        this.loadingService.show();
        this.customerService
            .getDataDetailCustomerDevice(id)
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
                        const statusObj = this.statusUserList.find(
                            s => s.code === data.data.status
                        );
                        this.user = {
                            ...data.data,
                            status: statusObj?.name ?? 'Common.StatusList.Unknown'
                        };
                    }
                },
            });
    }

    downloadFilePem() {
        this.loadingService.show();
        this.customerService
            .downloadFilePem(this.idUser)
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
                    const response = data as any;
                    if (response?.data) {
                        this.fileExportService.downloadPublicKeyPem(
                            response?.data?.publicKeyBase64,
                            `USER_PUBLIC_KEY.pem`
                        );
                    }
                },
            });
    }



    getDataDetail(id: string) {
        this.loadingService.show();
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.customerService
            .getDetailDeviceCustomer({
                ...formInput,
                userId: id,
                page: this.formInput.page || 1,
                size: this.formInput.size || 10
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
                            const statusItem = this.statusList.find(s => s.code === item.status);
                            return {
                                ...item,
                                osVersionName: item?.os + ' ' + item?.osVersion,
                                status: statusItem ? statusItem.name : 'Common.StatusList.Unknown',
                                stt: ((data?.data?.pageNumber || data?.data?.page) - 1) * (data?.data?.pageSize || data?.data?.size) + index + 1,

                            };
                        });
                        this.totalRecords = data?.data?.totalCount || data?.data?.totalElements || 0;
                    }
                },
            });
    }

    onLockDevice(event: any) {
        this.otpValue = ""
        this.reasonValue = ""
        this.Devices = { ...event };
        this.confirmationLock = true

    }
    stepBySendOtp() {
        this.sendOtpDevice()
    }
    sendOtpDevice() {
        const tokenDecode = this.authService.deCodeAccessToken()
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
                        this.Devices = { ...this.Devices, ...data?.data };
                        this.otpConfirmVisiable = true
                    }

                },
            });
    }
    submitLockDevice() {
        const tokenDecode = this.authService.deCodeAccessToken()
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
                        this.otpConfirmVisiable = false
                        this.getDataDetail(this.idUser ?? '');
                    }
                },
            });
    }
    handleSearchKeyword(keyword: any) {
        this.formInput.page = 1;
        this.first = 0;
        this.formInput.textSearch = keyword.trim() || '';
        this.getDataDetail(this.idUser ?? '');
    }

    handleSearchKeywordHistory(keyword: any) {
        this.formInputHistory.page = 1;
        this.formInputHistory.textSearch = keyword.trim() || '';
        if (this.selectTabs === '2') {
            this.getDataHistoryUser();
        } else {
            this.getDataHistoryDevice();
        }
    }
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }

    onView(event: any) {
    }

    handleLazyLoadHistory(event: any) {
        this.formInputHistory.page = event.first + 1;
        this.formInputHistory.size = event.rows;
        if (this.selectTabs === '2') {
            this.getDataHistoryUser();
        }
    }

    tabIndexChange(event: any) {
        this.selectTabs = event;
    }

    getDataHistoryDevice() {
        this.loadingService.show();
        const { pageNumber, pageSize, ...historyInput } = this.formInputHistory;
        this.deviceService
            .historyDevice({
                ...historyInput,
                userId: this.idUser,
                page: this.formInputHistory.page || 1,
                size: this.formInputHistory.size || 10
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
                        this.historyList = data?.data?.data?.map((item: any, index: number) => {
                            return {
                                ...item,
                                stt: ((data?.data?.pageNumber || data?.data?.page) - 1) * (data?.data?.pageSize || data?.data?.size) + index + 1,
                            };
                        });
                        this.historyTotalRecords = data?.data?.totalCount || data?.data?.totalElements || 0;
                    }
                },
            });
    }

    getDataHistoryUser() {
        this.loadingService.show();
        const { pageNumber, pageSize, ...historyInput } = this.formInputHistory;
        this.deviceService
            .historyUser({
                ...historyInput,
                userId: this.idUser,
                page: this.formInputHistory.page || 1,
                size: this.formInputHistory.size || 10
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
                        this.historyList = data?.data?.data?.map((item: any, index: number) => {
                            return {
                                ...item,
                                result: item.result === 'SUCCESS' ? 'Common.StatusList.Success' : 'Common.StatusList.Fail',
                                stt: ((data?.data?.pageNumber || data?.data?.page) - 1) * (data?.data?.pageSize || data?.data?.size) + index + 1,
                            };
                        });
                        this.historyTotalRecords = data?.data?.totalCount || data?.data?.totalElements || 0;
                    }
                },
            });
    }
}
