import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../layout/service/loading.service';
import { NotificationService } from '../../../../layout/service/notification.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { Operator } from '../../../../models/IOperator';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { FileExportService } from '../../../service/FileExport.service';
import { OperatorService } from '../../../service/operator.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { ActivityService } from './../../../service/Activity.service';
@Component({
    selector: 'app-activity-log',
    imports: [SHARED_MODULES, TableComponent],
    templateUrl: './activity-log.component.html',
})
export class ActivityLogComponent {
    displayConfirmationStatus: boolean = false;
    confirmationDeleteOperator: boolean = false;
    first: number = 0;
    dataList: any[] = [];
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    Operator: Operator = {} as Operator;
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

    breadcrumbList = [{ label: 'ActivityLog.Title', routerLink: '/activity-log' }];
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
        { field: 'description', header: 'ActivityLog.Columns.ActionName' },
        { field: 'moduleName', header: 'ActivityLog.Columns.functionName' },
        { field: 'userName', header: 'ActivityLog.Columns.userName' },
        { field: 'actorName', header: 'ActivityLog.Columns.Username' },
        { field: 'requestIp', header: 'Request IP' },
        { field: 'logTime', header: 'ActivityLog.Columns.RequestTime', type: "date" },
        { field: 'httpStatusCode', header: 'ActivityLog.Columns.HttpCode', type: 'tag' },
        // { field: 'errorMess', header: 'ActivityLog.Columns.Description' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;

    constructor(
        private OperatorService: OperatorService,
        private loadingService: LoadingService,
        private operatorService: OperatorService,
        private activityService: ActivityService,
        public router: Router,
        private destroyRef: DestroyRef,
        private fileExportService: FileExportService,
        private route: ActivatedRoute,
        public permissionCommon: PermissionCommonService,
        private translate: TranslationService,
        private notification: NotificationService

    ) { }
    permissionsSub?: Subscription;
    permissions: Record<string, boolean> = {};
    private destroy$ = new Subject<void>();
    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('ACTIVITY_LOG', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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

    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, username, ...formInput } = this.formInput;
        this.activityService
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
                        this.dataList = data?.data?.data?.map((item: any, index: number) => ({
                            ...item,
                            description: item.description + (item.objectId ? ` (id: ${item.objectId})` : ''),
                            status: item.status === 1 ? true : false,
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1,
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
                httpStatusCode: event.code
            };
        } else {
            const { httpStatusCode, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    formToDateChange(event: any) {
        this.currentFirstPage()
        if (event?.length === 2) {
            const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.startDate = fromDate;
            this.formInput.endDate = toDate;
            this.getData();
        } else if (event?.length === 0) {
            this.formInput.startDate = null;
            this.formInput.endDate = null;
            this.getData();
        }
    }

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()
        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }
    exportExcel() {
        const { pageNumber, pageSize, ...formInput } = this.formInput;
        this.activityService.exportActivityExcel({ ...formInput }).pipe(
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

    currentFirstPage() {
        this.formInput.page = 0;
        this.first = 0;
    }
}
