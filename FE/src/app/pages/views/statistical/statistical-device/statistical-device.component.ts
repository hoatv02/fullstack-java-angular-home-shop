import { DeviceService } from './../../../service/device.service';
import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { FormInputModel } from '../../../../models/IFormInput';
import { TableComponent } from '../../../components/table/table.component';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../../service/customer.service';
import { LoadingService } from '../../../../layout/service/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../service/transactions.service';
import moment from 'moment';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { NotificationService } from '../../../../layout/service/notification.service';

@Component({
    selector: 'app-statistical-device',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './statistical-device.component.html',
})
export class StatisticalDeviceComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;

    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'STATISTICS.DEVICE.BREADCRUMB', routerLink: '/statistical-transaction' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'STATISTICS.DEVICE.SUCCESS': 'success',
            'STATISTICS.DEVICE.FAIL': 'danger'
        },
        responseStatus: {
            '200': 'success',
            '500': 'danger',
            '400': 'danger',
            '403': 'danger',
            '404': 'danger',
            '502': 'danger',
            '503': 'danger'
        }
    };

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'createdAt', header: 'STATISTICS.DEVICE.TIME', type: 'formatDate', formatDate: 'dd/MM/yyyy' },
        { field: 'active', header: 'STATISTICS.DEVICE.ACTIVE_DEVICE', styleClass: 'text-center' },
        { field: 'inactive', header: 'STATISTICS.DEVICE.INACTIVE_DEVICE', styleClass: 'text-center' },
        { field: 'unregistered', header: 'STATISTICS.DEVICE.UNREGISTERED_DEVICE', styleClass: 'text-center' },
        { field: 'suspend', header: 'STATISTICS.DEVICE.SUSPEND_DEVICE', styleClass: 'text-center' },
        { field: 'deregistered', header: 'STATISTICS.DEVICE.DEREGISTERED_DEVICE', styleClass: 'text-center' },
        { field: 'locked', header: 'STATISTICS.DEVICE.LOCKED_DEVICE', styleClass: 'text-center' },
        { field: 'otherDevice', header: 'STATISTICS.DEVICE.OTHER_DEVICE', styleClass: 'text-center' },
        { field: 'total', header: 'STATISTICS.DEVICE.TOTAL_DEVICE', styleClass: 'text-center' },
    ];
    dataList = [];
    deviceList: any[] = [
        {
            code: 'iOS',
            name: 'STATISTICS.DEVICE.IOS'
        },
        {
            code: 'Android',
            name: 'STATISTICS.DEVICE.ANDROID'
        },
        {
            code: 'iPadOS',
            name: 'IPadOS'
        }
    ];

    OSList: any[] = [
        {
            code: 'MOBILE',
            name: 'MOBILE'
        }
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
        private deviceService: DeviceService,
        private translate: TranslationService,
        public permissionCommon: PermissionCommonService,
        private notification: NotificationService,


    ) { }




    ngOnInit(): void {
        this.loadFunctionPermission();
    }

    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('DEVICE_STATISTIC', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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
    deviceChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.os = event?.code;
        } else {
            const { os, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }

    osChange(event: any) {
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
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.deviceService
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
                        this.dataList = data?.data?.data?.map((items: any, index: number) => {
                            return {
                                ...items,
                                stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                            };
                        });
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


    exportExcel() {
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.deviceService.exportStatisticalDeviceExcel({ ...formInput }).pipe(
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
        const requestId = event?.data?.id;
        this.router.navigate([`/customer-detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }
}
