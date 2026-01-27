import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../../layout/service/auth.service';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../../components/table/table.component';
import { CustomerService } from '../../../../service/customer.service';
import { DeviceService } from './../../../../service/device.service';

@Component({
    selector: 'app-device-manager-detail',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    standalone: true,
    templateUrl: './device-manager-detail.component.html',
})
export class DeviceManagerDetailComponent {
    displayConfirmation: boolean = false;
    confirmationLock: boolean = false;
    otpConfirmVisiable: boolean = false;
    first: number = 0;
    otpValue: string | any = '';
    xmlContent: any;
    Devices: any = {};
    breadcrumbList = [
        { label: 'Common.DeviceList', routerLink: '/device' },
        { label: 'Breadcrumbs.CustomerManagement.DeviceDetail', routerLink: '/device-detail' }
    ];
    statusList: any[] = [
        { code: 1, name: 'Common.StatusList.StatusActive' },
        { code: 0, name: 'Common.StatusList.StatusInactive' },
        { code: -1, name: 'Common.StatusList.UNREGISTERED' },
        { code: 2, name: 'Common.StatusList.SUSPEND' },
        { code: 3, name: 'Common.StatusList.OtherDevice' },
        { code: -2, name: 'Common.StatusList.DEREGISTERED' },
        { code: -4, name: 'Common.StatusList.Lock' }
    ];
    tagConfig: Record<string, Record<string, string>> = {
        result: {
            'Common.StatusList.Success': 'success', // Đang hoạt động
            'Common.StatusList.Fail': 'danger'
        },
        status: {
            'Common.StatusList.StatusActive': 'success', // Đang hoạt động
            'Common.StatusList.StatusInactive': 'danger', // Ngừng hoạt động (không tiêu cực)
            'Common.StatusList.UNREGISTERED': 'info', // Chưa đăng ký
            'Common.StatusList.SUSPEND': 'warning', // Tạm ngưng
            'Common.StatusList.DEREGISTERED': 'danger', // Đã hủy đăng ký
            'Common.StatusList.OtherDevice': 'secondary', //Thiết bị khác
            'Common.StatusList.Lock': 'danger' // Bị khóa
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'actionName', header: 'CustomerManagement.DeviceLog.ActionName' },
        { field: 'userName', header: 'CustomerManagement.DeviceLog.Implementer' },
        // { field: 'errorMessage', header: 'CustomerManagement.DeviceLog.ErrorMessage' },
        // { field: 'processTime', header: 'CustomerManagement.DeviceLog.ProcessTime', type: 'number' },
        // { field: 'requestTime', header: 'CustomerManagement.DeviceLog.RequestTime', type: 'date' },
        // { field: 'responseTime', header: 'CustomerManagement.DeviceLog.ResponseTime', type: 'date' },
        { field: 'createdAt', header: 'CustomerManagement.CreateDate', type: 'date' },
        { field: 'result', header: 'CustomerManagement.DeviceLog.Result', type: 'tag' },
        { field: 'reason', header: 'Common.Reason' },

    ];
    dataList = [];
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    idDevice: string | null = '';
    urlDevice: string = '';
    username: any;
    externalId: any;
    user: any = {};
    deviceDetail: any = {};

    constructor(
        private customerService: CustomerService,
        private deviceService: DeviceService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.idDevice = this.route.snapshot.paramMap.get('id');
        this.urlDevice = this.router.url;
        this.username = this.route.snapshot.queryParamMap.get('username');
        this.externalId = this.route.snapshot.queryParamMap.get('externalId');
    }
    ngOnInit(): void {
        this.getDetailDevice();
    }

    handleLazyLoad(event: any) {
        this.formInput.page = event.first + 1;
        this.formInput.size = event.rows;
        if (this.deviceDetail?.userId && this.deviceDetail?.deviceId) this.getDataHistoryDevice();
    }
    getDetailDevice() {
        this.customerService
            .getDetailDevice(this.idDevice)
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
                        const statusObj = this.statusList.find((s) => s.code === data.data.status);
                        this.deviceDetail = {
                            ...data.data,
                            status: statusObj?.name ?? 'Common.StatusList.Unknown'
                        };
                        this.getDataHistoryDevice();
                    }
                }
            });
    }
    getDataHistoryDevice() {
        this.loadingService.show();
        this.formInput.page = this.formInput.page;
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.deviceService
            .historyDevice({
                ...formInput,
                deviceId: this.deviceDetail?.id,
                userId: this.deviceDetail?.userId
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
                            return {
                                ...item,
                                reason: item?.reason || item?.userName + ' ' + item?.actionName,
                                result: item?.result === 'SUCCESS' ? 'Common.StatusList.Success' : 'Common.StatusList.Fail',
                                stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                            };
                        });
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }

    handleSearchKeyword(keyword: any) {
        this.formInput.textSearch = keyword.trim() || '';
    }
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }

    onView(event: any) { }
}
