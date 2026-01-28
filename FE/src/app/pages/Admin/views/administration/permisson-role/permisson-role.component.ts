import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { IPermission } from '../../../../../models/IPermission';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { PermissionService } from '../../../service/permission.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';

@Component({
    selector: 'app-permisson-role',
    standalone: true,
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './permisson-role.component.html',
})
export class PermissonRoleComponent {
    formInput: FormInputModel = new FormInputModel();
    displayConfirmation: boolean = false;
    tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
    first: number = 0;
    totalRecords: number = 0;
    dataList: any[] = [];
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
    breadcrumbList = [{ label: 'Breadcrumbs.Administration.RolePermission.Title', routerLink: '/admin' }];
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },

        { field: 'name', header: 'Administration.RolePermission.Name' },
        { field: 'createdDate', header: 'Administration.RolePermission.CreatedAt', type: 'date' },
        { field: 'description', header: 'Administration.RolePermission.Description' },

        {
            field: 'status',
            header: 'Administration.Admin.Status',
            type: 'switch',
            active: 'Administration.Active',
            deactive: 'Administration.DeActive'
        }
    ];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        status: {
            'Common.StatusActive': 'success',
            'Common.StatusInactive': 'danger'
        }
    };
    confirmationDeletePermission: boolean = false;
    permission: IPermission = {} as IPermission;
    displayConfirmationStatus: boolean = false;

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    permissions: Record<string, boolean> = {};
    permissionsSub?: Subscription;
    private destroy$ = new Subject<void>();
    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private route: ActivatedRoute,
        private permissionService: PermissionService,
        public permissionCommon: PermissionCommonService
    ) { }
    ngOnInit(): void {
        this.loadFunctionPermission();
    }
    loadFunctionPermission() {
        this.permissionCommon
            .subscribePermissions('ROLE', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
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
        this.formInput.pageNumber = event.first + 1;
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
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    getData() {
        this.loadingService.show();
        const { page, size, ...formInput } = this.formInput;

        this.permissionService
            .getListDataPermission({
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
                        this.dataList =
                            data?.data?.data?.map((items: any, index: number) => {
                                return {
                                    ...items,
                                    stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                                };
                            }) || [];
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }
    editPermission(event?: any) {
        const action = event?.action;
        const id = event?.row?.id || event?.id;
        this.router.navigate([`/role/edit/${id}`], { relativeTo: this.route });
        if (action === ACTION.EDIT) {
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/role/detail/${id}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/role/create'], { relativeTo: this.route });
        }
    }

    handleSearchKeyword(keyword: any) {
        this.currentFirstPage();
        this.formInput.textSearch = keyword.trim() || '';
        this.getData();
    }
    onConfirmDeletePermission(permission: any) {
        this.confirmationDeletePermission = true;
        this.permission = { ...permission?.row };
    }
    deleteCustomer() {
        this.loadingService.show();
        this.permissionService
            .deletePermission(this.permission.id)
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
                        this.confirmationDeletePermission = false;
                        this.getData();
                    }
                }
            });
    }
    deleteSelectedCustomers() { }

    exportCSV() {
        // this.tableComponent?.exportCSV();
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

        if (this.tempSwitchChange?.prevValue) {
            this.activeStatusAdmin();
        } else {
            this.deActiveStatusAdmin();
        }
    }

    activeStatusAdmin() {
        this.loadingService.show();
        this.permissionService
            .activeStatusPermission(this.tempSwitchChange?.row?.id)
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
                        this.displayConfirmationStatus = false;
                        this.tempSwitchChange = null;
                        this.getData();
                    }
                }
            });
    }
    deActiveStatusAdmin() {
        this.loadingService.show();
        this.permissionService
            .deActiveStatusPermission(this.tempSwitchChange?.row?.id)
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
                        this.displayConfirmationStatus = false;
                        this.tempSwitchChange = null;
                        this.getData();
                    }
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
        this.formInput.pageNumber = 1;
        this.first = 0;
    }
}
