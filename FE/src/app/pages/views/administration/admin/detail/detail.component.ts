import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../../layout/service/auth.service';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import { EMAIL_REGEX, NOSPECIALCHARREGEX, NOSPECIALCHARREGEX_CODE, PHONE_REGEX } from '../../../../../utils/enums/const';
import { cleanForm } from '../../../../../utils/utils';
import { CustomerService } from '../../../../service/customer.service';
import { OperatorService } from '../../../../service/operator.service';
import { PermissionCommonService } from '../../../../service/PermissionCommon.service';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [SHARED_MODULES],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './detail.component.html',
})
export class DetailsComponent {
    userForm!: FormGroup;
    displayTitlePages: string = '';
    action?: ACTION;
    breadcrumbList: any[] = [];
    roles = [];
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    private operatorService = inject(OperatorService);
    private permissionCommon = inject(PermissionCommonService);
    private authService = inject(AuthService);
    private cdf = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.formInit();
        this.getDataDropdownPermissionRole()
        const id = this.route.snapshot.paramMap.get('id');
        const url = this.router.url;
        if (!id) {
            this.action = ACTION.CREATE;
        } else if (url.includes('/detail/')) {
            this.action = ACTION.DETAIL;
            this.getDataDetail(id);
            this.userForm.disable();
        } else {
            this.action = ACTION.EDIT;
            this.getDataDetail(id);
            this.userForm.get('userName')?.disable();
        }
        this.buildBreadcrumb();
        this.setDisplayTitle();
    }
    formInit() {
        this.userForm = this.fb.group({
            roleId: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX_CODE)]],
            userName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX_CODE)]],
            email: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            status: [true, [Validators.pattern(NOSPECIALCHARREGEX)]],
            firstName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
            requestId: [null, [Validators.pattern(NOSPECIALCHARREGEX)]],
            lastName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
            phone: [null, [Validators.pattern(PHONE_REGEX)]]
        });
    }
    buildBreadcrumb() {
        this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, 'Admin', '/admin', 'Breadcrumbs.Administration');
    }

    getDataDropdownPermissionRole() {
        this.loadingService.show();
        this.operatorService
            .getDataDropdownPermissionRole({})
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
                        this.roles = data?.data
                    }
                },
            });
    }
    getDataDetail(id: string) {
        this.loadingService.show();
        this.operatorService
            .getOperatorById({
                requestId: id
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
                        this.userForm.patchValue({
                            ...data.data,
                            status: data.data.status === 1 ? true : false
                        });
                    }
                },
            });
    }
    creatteOperator() {
        this.loadingService.show();
        this.operatorService
            .createOperator({
                ...this.userForm.value,
                status: this.userForm.value.status ? 1 : 0
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
                },

            });
    }

    updateOperator() {
        this.loadingService.show();
        this.operatorService
            .updateOperator({
                ...this.userForm.getRawValue(),
                status: this.userForm.value.status ? 1 : 0
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
                    if (data?.code === 200) {
                        this.cdf.detectChanges();

                    }
                },
            });
    }
    getDataRoleDetail(roleId: string) {
        this.permissionCommon.loadPermissions(roleId);
    }

    onSubmit() {
        if (this.userForm.valid) {
            cleanForm(this.userForm);
            if (this.action === ACTION.CREATE) {
                this.creatteOperator();
            } else {
                this.updateOperator();
            }
        } else {
            this.userForm.markAllAsTouched();
        }
    }

    setDisplayTitle() {
        switch (this.action) {
            case ACTION.CREATE:
                this.displayTitlePages = 'Administration.Admin.CreateDisplayTitlePages';
                break;
            case ACTION.EDIT:
                this.displayTitlePages = 'Administration.Admin.UpdateDisplayTitlePages';
                break;
            case ACTION.DETAIL:
            default:
                this.displayTitlePages = 'Administration.Admin.ViewDisplayTitlePages';
                break;
        }
    }
}
