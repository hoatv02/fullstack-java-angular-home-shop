import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { FileExportService } from '../../../service/FileExport.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';
@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService],
    templateUrl: './admin.component.html',
})
export class AdminComponent {
    displayConfirmationStatus: boolean = false;
    confirmationDeleteOperator: boolean = false;
    displayConfirmationResetPassword: boolean = false;
    first: number = 0;
    dataList: any[] = [];
    totalRecords: number = 0;
    formInput: FormInputModel = new FormInputModel();
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    Operator: any = {} as any;
    breadcrumbList = [{ label: 'Breadcrumbs.Administration.Admin.Title', routerLink: '/admin' }];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        status: {
            'Common.StatusActive': 'success',
            'Common.StatusInactive': 'danger'
        }
    };
    statusList: any[] = [
        {
            code: 1,
            name: 'Common.StatusActive'
        },
        {
            code: 0,
            name: 'Common.StatusInactive'
        }
    ];
    roleList: any[] = [];
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },
        { field: 'fullName', header: 'Administration.Admin.Name' },
        { field: 'userName', header: 'Administration.Admin.Username' },
        { field: 'roleName', header: 'Administration.Admin.Role' },
        { field: 'email', header: 'Administration.Admin.Email' },
        {
            field: 'status',
            header: 'Administration.Admin.Status',
            type: 'switch',
            active: 'Administration.Active',
            deactive: 'Administration.DeActive'
        }
    ];
    actionCondition = {
        delete: (row: any) => {
            return row.superAdmin === false;
        },
        edit: (row: any) => {
            return row.superAdmin === false;
        },
        reset: (row: any) => {
            return row.superAdmin === false;
        },
    };
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    permissionsSub?: Subscription;
    permissions: Record<string, boolean> = {};
    private destroy$ = new Subject<void>();

    constructor(
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private fileExportService: FileExportService,
        private route: ActivatedRoute,
        public permissionCommon: PermissionCommonService,
        private translate: TranslationService,
        private notification: NotificationService
    ) { }
    ngOnInit(): void {
    }


    ngOnDestroy() {
        this.permissionsSub?.unsubscribe();
    }
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.pageNumber = event.first + 1;
        this.formInput.pageSize = event.rows;
        if (!this.route.firstChild) {
        }
    }
    statusChange(event: any) {
        this.currentFirstPage();
        if (event) {
            this.formInput.status = event?.code;
        } else {
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
    }
    roleChange(event: any) {
        this.currentFirstPage();

        if (event) {
            this.formInput.roleId = event?.id;
        } else {
            const { roleId, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
    }

    editOperator(event?: any) {
        const action = event?.action;
        const requestId = event?.row?.requestId || event?.requestId;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/admin/edit/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/admin/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/admin/create'], { relativeTo: this.route });
        }
    }

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage();
        this.formInput.textSearch = keyword.trim() || '';
    }
    onConfirmDeleteOperator(Operator: any) {
        this.confirmationDeleteOperator = true;
        this.Operator = { ...Operator };
    }

    resetPassword(dataRow: any) {
        this.Operator = { ...dataRow };
        this.displayConfirmationResetPassword = true;
    }


    deleteSelectedOperators() { }
    exportExcel() {

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

        if (this.tempSwitchChange?.prevValue) {
            this.activeStatusAdmin();
        } else {
            this.deActiveStatusAdmin();
        }
    }

    activeStatusAdmin() {

    }
    deActiveStatusAdmin() {

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
        this.formInput.pageNumber = 1;
        this.first = 0;
    }
}
