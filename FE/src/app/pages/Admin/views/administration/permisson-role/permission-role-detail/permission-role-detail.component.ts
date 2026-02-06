import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TranslationService } from '../../../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../../../layout/Admins/service/loading.service';
import { SHARED_MODULES } from '../../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX_CODE } from '../../../../../../utils/enums/const';
import { CustomerService } from '../../../../service/customer.service';
import { PermissionCommonService } from '../../../../service/PermissionCommon.service';
import { AuthService } from '../../../../../../layout/Admins/service/auth.service';
import { cleanForm } from '../../../../../../utils/utils';
import { ConfirmationService, MessageService } from 'primeng/api';
interface PermissionEntry {
    name: string;
    value: string;
    description: string;
    level: number;
    parent: string | null;
    permissions: string[];
    permissionStates?: Record<string, { value: boolean; disabled: boolean }>;
}

@Component({
    selector: 'app-permission-role-detail',
    standalone: true,
    imports: [SHARED_MODULES],
    providers: [ConfirmationService, MessageService, CustomerService],

    templateUrl: './permission-role-detail.component.html',
    styleUrl: './permission-role-detail.component.scss'
})
export class PermissionRoleDetailComponent implements OnInit {
    allPermissions = ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'];
    breadcrumbList: any = [];

    roleForm!: FormGroup;
    rawPermissions: PermissionEntry[] = [];
    parentPermissions: PermissionEntry[] = [];
    childMap: Record<string, PermissionEntry[]> = {};
    private fb = inject(FormBuilder);
    private cdf = inject(ChangeDetectorRef);
    action?: ACTION;
    displayTitlePages: string = '';
    dataList: any[] = [];
    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private route: ActivatedRoute,
        private t: TranslationService,
        private permissionCommon: PermissionCommonService,
        private authService: AuthService

    ) { }
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        const url = this.router.url;
        this.formInit();

        this.getDataPermission(() => {
            if (!id) {
                this.action = ACTION.CREATE;
                this.clearPermissionStates();
            } else if (url.includes('/detail/')) {
                this.action = ACTION.DETAIL;
                this.roleForm.disable();
                this.getPermissionDetail(id);
            } else {
                this.action = ACTION.EDIT;
                this.roleForm.get('code')?.disable();
                this.getPermissionDetail(id);
            }
            this.setDisplayTitle();
            this.buildBreadcrumb();
        });
    }
    onToggleParentRow(parent: PermissionEntry): void {
        const check = parent.permissionStates!['ALL'].value;

        // Set tất cả permission của parent
        for (const perm of this.allPermissions) {
            if (!parent.permissionStates![perm].disabled) {
                parent.permissionStates![perm].value = check;
            }
        }

        // Set toàn bộ permission của các child
        const children = this.childMap[parent.name] || [];
        for (const child of children) {
            // Cập nhật tất cả permission child
            for (const perm of this.allPermissions) {
                if (!child.permissionStates![perm].disabled) {
                    child.permissionStates![perm].value = check;
                }
            }
            // Cập nhật checkbox ALL đầu dòng child
            child.permissionStates!['ALL'].value = check;
        }

    }

    onToggleChildRow(child: PermissionEntry, parent: PermissionEntry): void {
        const check = child.permissionStates!['ALL'].value;

        // Set tất cả permission của child
        for (const perm of this.allPermissions) {
            if (!child.permissionStates![perm].disabled) {
                child.permissionStates![perm].value = check;
            }
        }

        const children = this.childMap[parent.name] || [];

        // Parent ALL phải phản ánh đúng tình trạng của child
        const allChecked = children.every(c =>
            this.allPermissions.every(perm => c.permissionStates![perm].value || c.permissionStates![perm].disabled)
        );

        const noneChecked = children.every(c =>
            this.allPermissions.every(perm => !c.permissionStates![perm].value || c.permissionStates![perm].disabled)
        );

        // 🟢 Sửa logic ở đây
        if (allChecked) {
            parent.permissionStates!['ALL'].value = true;
        } else {
            parent.permissionStates!['ALL'].value = false;
        }

    }

    buildBreadcrumb() {
        this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, 'RolePermission', '/role', 'Breadcrumbs.Administration');
    }
    formInit() {
        this.roleForm = this.fb.group({
            id: [''],
            code: ['', [Validators.required, Validators.pattern(NOSPECIALCHARREGEX_CODE)]],
            name: ['', [Validators.required]],
            description: [''],
            status: [true]
        });
    }

    onSubmit() {
        if (!this.roleForm.invalid) {
            cleanForm(this.roleForm);

            const selectedPermissions = this.rawPermissions.flatMap((item) => {
                const moduleCode = item.value;
                const permissionCodes = this.allPermissions.filter((perm) => item.permissionStates?.[perm]?.value);

                if (permissionCodes.length > 0) {
                    return [
                        {
                            moduleCode,
                            permissionCodes
                        }
                    ];
                }
                return [];
            });
            const payload = {
                ...this.roleForm.getRawValue(),
                modules: [
                    ...selectedPermissions,
                    {
                        moduleCode: 'HOME',
                        permissionCodes: ['VIEW']
                    }
                ]
            };

            if (this.action === ACTION.CREATE) {
                this.createPermission(payload);
            } else {
                this.updatePermission(payload);
            }
        } else {
            this.roleForm.markAllAsTouched();
        }
    }
    getNameHeaderTable(perm: string): string {
        switch (perm) {
            case 'VIEW':
                return 'Administration.RolePermission.View';
            case 'DETAIL':
                return 'Administration.RolePermission.Details';
            case 'CREATED':
                return 'Administration.RolePermission.Create';
            case 'UPDATED':
                return 'Administration.RolePermission.Update';
            case 'REMOVE':
                return 'Administration.RolePermission.Delete';
            default:
                return perm;
        }
    }

    initPermissionStates(): void {
        for (const item of this.rawPermissions) {
            item.permissionStates = {};
            for (const perm of this.allPermissions) {
                const hasPerm = item.permissions.includes(perm);
                item.permissionStates[perm] = {
                    value: hasPerm && !this.isDisabledCondition(item, perm),
                    disabled: !hasPerm || this.isDisabledCondition(item, perm)
                };
            }
            item.permissionStates['ALL'] = {
                value: false,
                disabled: false
            };
        }
    }

    isDisabledCondition(item: PermissionEntry, perm: string): boolean {
        return !item.permissions.includes(perm);
    }
    clearPermissionStates(): void {
        for (const item of this.rawPermissions) {
            item.permissionStates = {};
            for (const perm of this.allPermissions) {
                item.permissionStates[perm] = {
                    value: false,
                    disabled: !item.permissions.includes(perm)
                };
            }
            item.permissionStates['ALL'] = {
                value: false,
                disabled: false
            };
        }
    }

    onSelectAll(value: boolean): void {
        for (const parent of this.parentPermissions) {
            for (const perm of this.allPermissions) {
                if (!parent.permissionStates![perm].disabled) {
                    parent.permissionStates![perm].value = value;
                }
            }
            parent.permissionStates!['ALL'].value = value;
            const children = this.childMap[parent.name] || [];
            for (const child of children) {
                for (const perm of this.allPermissions) {
                    if (!child.permissionStates![perm].disabled) {
                        child.permissionStates![perm].value = value;
                    }
                }
                child.permissionStates!['ALL'].value = value;
            }
        }
    }

    groupHierarchy(): void {
        this.parentPermissions = this.rawPermissions.filter((p) => p.level === 0);
        this.childMap = {};
        for (const parent of this.parentPermissions) {
            this.childMap[parent.name] = this.rawPermissions.filter((p) => p.level === 1 && p.parent === parent.name);
        }
    }
    onParentPermissionChange(parent: PermissionEntry, perm: string): void {
        const children = this.childMap[parent.name] || [];
        for (const child of children) {
            if (child.permissionStates?.[perm] && !child.permissionStates[perm].disabled) {
                child.permissionStates[perm].value = parent.permissionStates?.[perm]?.value || false;
            }
        }
    }


    onChildPermissionChange(parent: PermissionEntry, perm: string): void {
        const children = this.childMap[parent.name] || [];
        for (const child of children) {
            if (child.permissionStates?.[perm]?.disabled && child.permissionStates[perm].value === true) {
                child.permissionStates[perm].value = false;
            }
        }
        for (const child of children) {
            const allCheckedChild = this.allPermissions
                .filter(p => !child.permissionStates![p].disabled)
                .every(p => child.permissionStates![p].value === true);

            child.permissionStates!['ALL'].value = allCheckedChild;
        }
        const allCheckedParent = children.every(child =>
            this.allPermissions
                .filter(p => !child.permissionStates![p].disabled)
                .every(p => child.permissionStates![p].value === true)
        );

        parent.permissionStates!['ALL'].value = allCheckedParent;

    }

    syncDisabledAndValue(): void {
        for (const item of this.rawPermissions) {
            for (const perm of this.allPermissions) {
                if (item.permissionStates?.[perm]?.disabled) {
                    if (item.permissionStates[perm].value === true) {
                        item.permissionStates[perm].value = false;
                        item.permissionStates = { ...item.permissionStates };
                    }
                }
            }

        }
    }

    getDataPermission(callback?: () => void) {

    }

    getPermissionDetail(id: string) {

    }

    createPermission(payload: any) {

    }
    updatePermission(payload: any) {

    }
    getDataRoleDetail(roleId: string) {
        this.permissionCommon.loadPermissions(roleId);
    }

    setDisplayTitle() {
        switch (this.action) {
            case ACTION.CREATE:
                this.displayTitlePages = 'Administration.RolePermission.CreateDisplayTitlePages';
                break;
            case ACTION.EDIT:
                this.displayTitlePages = 'Administration.RolePermission.UpdateDisplayTitlePages';
                break;
            case ACTION.DETAIL:
            default:
                this.displayTitlePages = 'Administration.RolePermission.ViewDisplayTitlePages';
                break;
        }
    }
}
