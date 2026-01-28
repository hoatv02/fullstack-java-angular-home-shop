import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { ITransferServiceType } from '../../../../../models/ITransferServiceType';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
import { TransferServiceTypeService } from '../../../service/transfer-service-type.service';

@Component({
    selector: 'app-transfer-service-type',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, TransferServiceTypeService],
    templateUrl: './transfer-service-type.component.html',
})
export class TransferServiceTypeComponent {
    private transferServiceTypeService = inject(TransferServiceTypeService);
    private loadingService = inject(LoadingService);
    public router = inject(Router);
    private route = inject(ActivatedRoute);
    public permissionCommon = inject(PermissionCommonService);

    first: number = 0;
    dataList: ITransferServiceType[] = [];
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    displayConfirmationStatus: boolean = false;
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    breadcrumbList = [{ label: 'TRANSFER_SERVICE_TYPE.TITLE', routerLink: '/transfer-service-type' }];

    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        status: {
            'Common.StatusActive': 'success',
            'Common.StatusInactive': 'danger'
        }
    };

    statusList: any[] = [
        { code: 1, name: 'Common.StatusActive' },
        { code: 0, name: 'Common.StatusInactive' }
    ];

    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'code', header: 'TRANSFER_SERVICE_TYPE.CODE' },
        { field: 'name', header: 'TRANSFER_SERVICE_TYPE.NAME' },
        { field: 'createdAt', header: 'TRANSFER_SERVICE_TYPE.EXECUTION_TIME', type: "date" },
        {
            field: 'status',
            header: 'TRANSFER_SERVICE_TYPE.STATUS',
            type: 'switch',
            active: 'Administration.Active',
            deactive: 'Administration.DeActive'
        }
    ];

    actionCondition = {
        delete: (row: any) => false,
        edit: (row: any) => true,
        view: (row: any) => true
    };

    @ViewChild(TableComponent) tableComponent!: TableComponent;
    permissions: Record<string, boolean> = {};
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.loadFunctionPermission();
    }

    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('TRANSFER_SERVICE_TYPE', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.permissions = result;
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first + 1;
        this.formInput.pageSize = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }

    statusChange(event: any) {
        this.currentFirstPage();
        if (event) {
            this.formInput.status = event?.code;
        } else {
            delete this.formInput.status;
        }
        this.getData();
    }

    getData() {
        const { pageNumber, size, ...formInput } = this.formInput;
        this.loadingService.show();
        this.transferServiceTypeService
            .getListData({ ...formInput })
            .pipe(
                catchError(() => of({ data: { data: [], totalCount: 0 } })),
                finalize(() => this.loadingService.hide())
            )
            .subscribe({
                next: (res: any) => {
                    if (res?.data) {
                        this.dataList = res.data.data?.map((item: any, index: number) => ({
                            ...item,
                            stt: (res.data.pageNumber - 1) * res.data.pageSize + index + 1,
                            status: item.status === 1
                        }));
                        this.totalRecords = res.data.totalCount || 0;
                    }
                }
            });
    }

    handleAction(event?: any) {
        console.log(event);
        const action = event?.action;
        const requestId = event?.row?.id || event?.id;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/transfer-service-type/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/transfer-service-type/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/transfer-service-type/create'], { relativeTo: this.route });
        }
    }

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage();
        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }

    // =================== Xử lý chuyển đổi trạng thái ===================
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.tempSwitchChange = {
            row,
            field,
            prevValue: !row[field]
        };
        row[field] = value;
        this.displayConfirmationStatus = true;
    }

    onConfirmSwitchChange() {
        if (!this.tempSwitchChange) return;

        const { row, field } = this.tempSwitchChange;
        const body = { ...row, [field]: row[field] ? 1 : 0 };
        this.loadingService.show();
        this.transferServiceTypeService.update({ id: row.id, body: body })
            .pipe(finalize(() => {
                this.loadingService.hide();
                this.tempSwitchChange = null;
            }))
            .subscribe({
                next: (res) => {
                    if (res?.code === 200) {
                        this.displayConfirmationStatus = false;
                        this.getData();
                    } else {
                        this.onCancelSwitchChange();
                    }
                },
                error: () => {
                    this.onCancelSwitchChange();
                }
            });
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
        this.formInput.page = 1;
        this.first = 0;
    }
}
