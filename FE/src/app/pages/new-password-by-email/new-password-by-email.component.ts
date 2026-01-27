import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../layout/service/loading.service';
import { NotificationService } from '../../layout/service/notification.service';
import { SHARED_MODULES } from '../../shared/shared.module';
import { cleanForm } from '../../utils/utils';
import { AuthService } from './../../layout/service/auth.service';
import { AppConfigurator } from '../../layout/component/app.configurator';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-new-password-by-email',
  imports: [SHARED_MODULES, AppConfigurator],
  templateUrl: './new-password-by-email.component.html',
  styleUrls: ['./new-password-by-email.component.scss']
})
export class NewPasswordByEMailComponent {
  passwordForm!: FormGroup;
  token!: string | null;
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token');
    });
    this.passwordForm = this.fb.group(
      {
        token: [this.token],
        desiredPassword: ['', [Validators.required, Validators.minLength(12), this.passwordComplexityValidator()]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('desiredPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (password !== confirm) {
      return { passwordMismatch: true };
    }
    return null;
  }
  onSubmit() {
    this.loadingService.show();
    cleanForm(this.passwordForm);
    this.authService
      .updatePasswords(this.token || '',
        this.passwordForm.value.desiredPassword,
      )
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
          console.log("🚀 This is! __ data:", data)
          if (data && data.code === 200) {
            this.router.navigate(['/update-password-success']);
          }
        },

      });
  }
  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // Nếu chưa nhập thì không kiểm tra

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\+=\\\/\[\];']/g.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return !valid
        ? {
          passwordComplexity: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar
          }
        }
        : null;
    };
  }
}