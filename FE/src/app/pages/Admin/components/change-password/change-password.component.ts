import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../layout/Admins/service/notification.service';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { cleanForm } from '../../../../utils/utils';

@Component({
  selector: 'app-change-password',
  imports: [SHARED_MODULES],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  @Input() changePasswordModal: boolean = false;
  @Input() showButtonCancel: boolean = true;
  @Input() headerTitle: string = 'ChangePassword.Header';

  @Input() closable: boolean = true;
  @Output() close = new EventEmitter<void>();
  public fb = inject(FormBuilder);
  authService = inject(AuthService);
  private notification = inject(NotificationService);

  loadingService = inject(LoadingService);
  router = inject(Router);

  changePasswordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        this.strongPasswordValidator, // <-- thêm dòng này
      ],],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changePasswordModal']?.currentValue === true) {
      this.changePasswordForm.reset()
    }
  }

  strongPasswordValidator(control: any) {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\\/\[\]]/.test(value);
    const isValidLength = value.length >= 12;

    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;

    return passwordValid ? null : { weakPassword: true };
  }
  // custom validator
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }
  submitChangePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    cleanForm(this.changePasswordForm);
    this.loadingService.show();
    this.authService
      .changePassword({
        newPassword: this.changePasswordForm.value?.newPassword,
        oldPassword: this.changePasswordForm.value?.currentPassword
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
            this.changePasswordModal = false
            this.router.navigate(['/auth/login']);
          }
        },
      });
  }

  onHide() {
    this.close.emit();
  }
}
