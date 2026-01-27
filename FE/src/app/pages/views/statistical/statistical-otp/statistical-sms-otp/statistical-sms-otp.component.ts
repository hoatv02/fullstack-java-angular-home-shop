import { Component, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { catchError, of, finalize } from 'rxjs';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../../components/table/table.component';
import { CustomerService } from '../../../../service/customer.service';
import { SystemLogService } from '../../../../service/system-log.service';
import { Operator } from '../../../../../models/IOperator';
import { StatisticalOtpService } from '../../../../service/statistical.otp.service';

@Component({
    imports: [SHARED_MODULES, TableComponent],
    selector: 'app-statistical-sms-otp',
    templateUrl: './statistical-sms-otp.component.html',
})
export class StatisticalSmsOtpComponent {
    displayConfirmationStatus: boolean = false;
    confirmationDeleteOperator: boolean = false;
    first: number = 0;
    dataList: any[] = [];
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    Operator: Operator = {} as Operator;
    breadcrumbList = [{ label: 'Nhật ký hệ thống', routerLink: '/activity-log' }];
    validationStatusList: any[] = [
        {
            code: 'SUCCESS',
            name: 'SUCCESS'
        },
        {
            code: 'FAILED',
            name: 'FAILED'
        }
    ];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        validationStatus: {
            SUCCESS: 'success',
            FAILED: 'danger'
        }
    };

    columns = [
        { field: 'createdAt', header: 'Thời gian', type: 'date' },
        { field: 'type', header: 'Loại' },
        { field: 'total', header: 'Tổng' },
        { field: 'validationStatus', header: 'Trạng thái', type: 'tag' }
    ];

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        private systemLogService: SystemLogService,
        public router: Router,
        private destroyRef: DestroyRef,
        private statisticalOtp: StatisticalOtpService,
        private route: ActivatedRoute
    ) { }
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first;
        this.formInput.size = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }

    currentFirstPage() {
        this.formInput.page = 1;
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
                        this.dataList = data?.data?.data?.map((item: any) => ({
                            ...item,
                            status: item.status === 1 ? 'Thành công' : 'Thất bại',
                            responseStatus: item.responseStatus ? item.responseStatus.toString() : ''
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
            this.formInput = new FormInputModel();
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
        const { page, size, ...formInput } = this.formInput;
        // this.systemLogService.exportRasServiceExcel(
        //     {
        //         ...formInput
        //     },
        //     'system-ras',
        //     'xlsx'
        // );
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
