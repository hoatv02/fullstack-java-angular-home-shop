import { Component, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { catchError, of, finalize, takeUntil, Subscription, Subject } from 'rxjs';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../../components/table/table.component';
import { CustomerService } from '../../../../service/customer.service';
import { SystemLogService } from '../../../../service/system-log.service';
import { Operator } from '../../../../../models/IOperator';
import { StatisticalOtpService } from '../../../../service/statistical.otp.service';
import { PermissionCommonService } from '../../../../service/PermissionCommon.service';
import { NotificationService } from '../../../../../layout/service/notification.service';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';

@Component({
    imports: [SHARED_MODULES, TableComponent],
    selector: 'app-statistical-smart-otp',
    templateUrl: './statistical-smart-otp.component.html',
})
export class StatisticalSmartOtpComponent {
    displayConfirmationStatus: boolean = false;
    confirmationDeleteOperator: boolean = false;
    first: number = 0;
    dataList: any[] = [];
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    Operator: Operator = {} as Operator;
    validationStatusList: any[] = [
        {
            code: 'SUCCESS',
            name: 'Common.Successfully'
        },
        {
            code: 'FAILED',
            name: 'Common.Failed'
        }
    ];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        validationStatus: {
            SUCCESS: 'success',
            FAILED: 'danger'
        }
    };
    otpList: any[] = [
        {
            code: 'OCRA',
            name: 'OCRA'
        },
        {
            code: 'OTP',
            name: 'OTP'
        },
        {
            code: 'TOTP',
            name: 'TOTP'
        }
    ];

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'createdAt', header: 'STATISTICS.OTP.TIME', type: 'formatDate', formatDate: 'dd/MM/yyyy' },
        { field: 'success', header: 'STATISTICS.OTP.SUCCESS', styleClass: 'text-center' },
        { field: 'failed', header: 'STATISTICS.OTP.FAIL', styleClass: 'text-center' },
        { field: 'total', header: 'STATISTICS.OTP.TOTAL', styleClass: 'text-center' },
    ];
    permissionsSub?: Subscription;
    permissions: Record<string, boolean> = {};
    private destroy$ = new Subject<void>();

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        private systemLogService: SystemLogService,
        public router: Router,
        private destroyRef: DestroyRef,
        private statisticalOtp: StatisticalOtpService,
        private route: ActivatedRoute,
        public permissionCommon: PermissionCommonService,
        private translate: TranslationService,
        private notification: NotificationService

    ) { }


    ngOnInit(): void {
        this.loadFunctionPermission();
    }

    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('OTP_STATISTIC', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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
    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.statisticalOtp
            .getStatisticalSmartOtp({
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
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1

                            // status: item.status === 1 ? 'Thành công' : 'Thất bại',
                            // responseStatus: item.responseStatus ? item.responseStatus.toString() : ''
                        }));
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }

    handleFilterHttpCodeChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput = {
                ...this.formInput,
                validationStatus: event.code
            };
        } else {
            const { validationStatus, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }

    handleFilteStatusChange(event: any) {
        this.currentFirstPage()

        if (event) {
            this.formInput = {
                ...this.formInput,
                otpGroup: event.code
            };
        } else {
            const { otpGroup, ...formInput } = this.formInput;
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

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()

        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }

    exportExcel() {
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.statisticalOtp.exportStatisticalOtpExcel({ ...formInput }).pipe(
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
        this.tempSwitchChange = {
            row,
            field,
            prevValue: value
        };
        row[field] = value;
        this.displayConfirmationStatus = true;
    }

    onConfirmSwitchChange() {
        if (this.tempSwitchChange) {
            const { row, field, prevValue } = this.tempSwitchChange;
            row[field] = prevValue;
        }
        this.displayConfirmationStatus = false;
        this.tempSwitchChange = null;
    }
    onCancelSwitchChange() {
        if (this.tempSwitchChange) {
            const { row, field, prevValue } = this.tempSwitchChange;
            row[field] = !prevValue;
            this.dataList = [...this.dataList];
        }
        this.displayConfirmationStatus = false;
        this.tempSwitchChange = null;
    }
}
