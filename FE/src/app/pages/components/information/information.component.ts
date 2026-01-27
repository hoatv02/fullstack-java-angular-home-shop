import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../layout/service/auth.service';
import { LoadingService } from '../../../layout/service/loading.service';
import { SHARED_MODULES } from '../../../shared/shared.module';
import { NOSPECIALCHARREGEX, PHONE_REGEX } from '../../../utils/enums/const';
import { OperatorService } from '../../service/operator.service';

@Component({
  selector: 'app-information',
  imports: [SHARED_MODULES],
  templateUrl: './information.component.html',
})
export class InformationComponent {
  @Input() informationModal = false;
  @Output() close = new EventEmitter<void>();

  userForm!: FormGroup;
  roles: any[] = [];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private operatorService = inject(OperatorService);
  ngOnInit(): void {
    this.formInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['informationModal']?.currentValue === true) {
      this.userForm.reset()
      this.getDataDetail();
      this.getDataDropdownPermissionRole();
      this.userForm.get("userName")?.disable()
    }
  }

  formInit() {
    this.userForm = this.fb.group({
      roleId: [null, [Validators.required]],
      userName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      email: [null, [Validators.required, Validators.email]],
      status: [1],
      firstName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      lastName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      phone: [null, [Validators.pattern(PHONE_REGEX)]],
    });
  }

  getDataDropdownPermissionRole() {
    this.loadingService.show();
    this.operatorService.getDataDropdownPermissionRole({})
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingService.hide())
      )
      .subscribe((data: any) => {
        if (data?.code === 200) {
          this.roles = data.data || [];
        }
      });
  }

  getDataDetail() {
    const dataLocalStorage = this.authService.deCodeAccessToken()
    const id = dataLocalStorage?.['x-user-id'];
    if (!id) return;
    this.loadingService.show();
    this.operatorService
      .getOperatorById({ requestId: id })
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingService.hide())
      )
      .subscribe((data: any) => {
        if (data?.data) {
          this.userForm.patchValue({
            ...data.data,
            status: data.data.status === 1
          });
        }
      });
  }



  updateOperator() {
    const dataLocalStorage = this.authService.deCodeAccessToken()
    const id = dataLocalStorage?.['x-user-id'];
    this.loadingService.show();
    this.operatorService
      .updateOperatorModal({
        ...this.userForm.getRawValue(),
        status: 1,
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
          if (data?.code === 200) {
            this.informationModal = false
          }
        },
      });
  }

  submitUpdateProfile() {
    if (this.userForm.valid) {
      this.updateOperator();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onHide() {
    this.close.emit();
  }
}
