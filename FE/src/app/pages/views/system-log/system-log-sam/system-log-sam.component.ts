import { Component, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { Operator } from '../../../../models/IOperator';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { SystemLogService } from '../../../service/system-log.service';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { formatLabel } from '../../../../shared/validators/DecodeCommon';

@Component({
    selector: 'app-system-log-sam',
    imports: [SHARED_MODULES, TableComponent],
    templateUrl: './system-log-sam.component.html',
})
export class SystemLogSAMComponent {
    displayConfirmationStatus: boolean = false;
    confirmationDeleteOperator: boolean = false;
    first: number = 0;
    dataList: any[] = [];
    totalRecords: number = 0;
    otpConfirmVisiable: boolean = false;
    dataSystemLog: Record<string, any> = {};
    formInput: FormInputModel = new FormInputModel();
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    Operator: Operator = {} as Operator;
    breadcrumbList = [{ label: 'SYSTEM_LOG_SAM.BREADCRUMB', routerLink: '/activity-log' }];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        httpStatusCode: {
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
        { field: 'action', header: 'SystemLogRAS.ACTION_NAME' },
        { field: 'cif', header: 'CustomerManagement.Customer.CifCode' },
        // { field: 'uri', header: 'SystemLogRAS.RequetsPath' },
        // { field: 'userId', header: 'UserID' }, 
        { field: 'deviceId', header: 'DeviceID' },
        { field: 'sessionId', header: 'SessionID' },
        { field: 'requestTime', header: 'SystemLogRAS.RequestTime', type: 'dateSSS' },
        { field: 'responseTime', header: 'SystemLogRAS.ResponseTime', type: 'dateSSS' },
        { field: 'httpStatusCode', header: 'SystemLogRAS.STATUS', type: 'tag' }
    ];

    httpCode: any[] = [
        { code: '200', name: '200 - OK' },
        { code: '201', name: '201 - Created' },
        { code: '202', name: '202 - Accepted' },
        { code: '204', name: '204 - No Content' },
        { code: '301', name: '301 - Moved Permanently' },
        { code: '302', name: '302 - Found' },
        { code: '304', name: '304 - Not Modified' },
        { code: '400', name: '400 - Bad Request' },
        { code: '401', name: '401 - Unauthorized' },
        { code: '403', name: '403 - Forbidden' },
        { code: '404', name: '404 - Not Found' },
        { code: '405', name: '405 - Method Not Allowed' },
        { code: '408', name: '408 - Request Timeout' },
        { code: '409', name: '409 - Conflict' },
        { code: '429', name: '429 - Too Many Requests' },
        { code: '500', name: '500 - Internal Server Error' },
        { code: '501', name: '501 - Not Implemented' },
        { code: '502', name: '502 - Bad Gateway' },
        { code: '503', name: '503 - Service Unavailable' },
        { code: '504', name: '504 - Gateway Timeout' }
    ];

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        private systemLogService: SystemLogService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private translate: TranslationService
    ) { }

    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.pageNumber = event.first + 1;
        this.formInput.pageSize = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }

    currentFirstPage() {
        this.formInput.pageNumber = 1;
        this.first = 0;
    }
    getData() {
        this.loadingService.show();
        const { page, size, ...formInput } = this.formInput;
        this.systemLogService
            .getListDataSam({
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
                            status: item.status === 1 ? this.translate.translate('SYSTEM_LOG_SAM.STATUS_TEXT.SUCCESS') : this.translate.translate('SYSTEM_LOG_SAM.STATUS_TEXT.FAIL'),
                            responseStatus: item.responseStatus?.toString() || '',
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
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
                httpCode: event.code
            };
        } else {
            const { httpCode, ...formInput } = this.formInput;
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

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()
        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }
    exportExcel() {
        const { page, size, ...formInput } = this.formInput;
        this.systemLogService.exportSamServiceExcel(
            {
                ...formInput
            },
            'system-sam',
            'xlsx'
        );
    }

    formatLabel = formatLabel;
    getDisplayValue(key: string, value: any): string {
        if (!value) return '--';
        if (key === 'action') {
            const k = `SYSTEM_LOG_SAM.ACTION.${value}`;
            const t = this.translate.translate(k);
            return t !== k ? t : value;
        }
        if (key.endsWith('Time') || key.endsWith('At')) {
            return new Date(value).toLocaleString();
        }
        return value;
    }
    getValueClass(key: string, value: any): string {
        if (key === 'status') {
            return value === 'Thành công' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
        }
        if (key === 'uri') return 'text-blue-600 font-bold';
        if (key === 'httpStatusCode') {
            return value === 200 ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
        }
        return 'text-gray-900';
    }
    viewSystemLogSam(dataSystemLog: any) {
        if (dataSystemLog) {
            this.otpConfirmVisiable = true;
            const { stt, id, ...data } = dataSystemLog?.row;
            this.dataSystemLog = {
                action: data.action,
                cif: data.cif,
                userId: data.userId,
                deviceId: data.deviceId,
                sessionId: data.sessionId,
                createdAt: data.createdAt,
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                httpStatusCode: data.httpStatusCode,
                processTime: data.processTime,
                requestTime: data.requestTime,
                responseStatus: data.responseStatus || '--',
                responseTime: data.responseTime,
                status: data.status === 'Thành công' ? this.translate.translate('SYSTEM_LOG_SAM.STATUS_TEXT.SUCCESS') : this.translate.translate('SYSTEM_LOG_SAM.STATUS_TEXT.FAIL'),
                systemCode: data.systemCode,
                uri: data.uri,

            };
        }
    }
    isDateField(key: string): boolean {
        return ['createdAt', 'requestTime', 'responseTime'].includes(key);
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
