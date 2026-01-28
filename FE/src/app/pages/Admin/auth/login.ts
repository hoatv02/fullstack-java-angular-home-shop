import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { AppFloatingConfigurator } from '../../../layout/Admins/component/app.floatingconfigurator';
import { AuthService } from '../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../layout/Admins/service/loading.service';
import { SHARED_MODULES } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cleanForm } from '../../../utils/utils';
import { NotificationService } from '../../../layout/Admins/service/notification.service';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { RecapchaDemoComponent } from '../components/recapcha-demo/recapcha-demo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_MODULES, AppFloatingConfigurator, RecapchaDemoComponent],
  template: `<div class="hidden">
            <app-floating-configurator />
        </div>

        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 95%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px ">
                        <i
                            *ngIf="showStep === 1 || showStep === 2"
                            (click)="backFormLogin()"
                            class="pi pi-arrow-left p-3 bg-[#ececec] hover:bg-[#dfdfdf] my-2 rounded-full cursor-pointer"
                            style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"
                        ></i>
                        <div class="text-center mb-8">
                            <div class="flex justify-center text-center">
                                <!-- <img src="https://savyint.com/wp-content/uploads/2023/11/Logo-Savyint.svg" alt="Logo" class="w-[300] sm:w-[300px] md:w-[300px] lg:w-[400px] mb-10 h-[80px]" /> -->
                                <!-- <img src="assets/images/logo_Bac_A_Bank.png" alt="Logo" class="w-[300] sm:w-[300px] md:w-[300px] lg:w-[400px] mb-10 h-[120px]" /> -->
                                <img src="assets/images/LOGO-SAM-AUTH-LOGIN.png" alt="Logo" class="w-[300] sm:w-[300px] md:w-[300px] lg:w-[350px] " />
                            </div>
                            <div *ngIf="showStep === 2">
                                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                                    {{ 'Auth.ForgotPassword.Title' | translate }}
                                </div>
                                <span class="text-muted-color font-medium">{{ 'Auth.ForgotPassword.FillInfo' | translate }}</span>
                            </div>
                        </div>
                        <form [formGroup]="loginForm" (ngSubmit)="submitForm()">
                            <div *ngIf="showStep === 0">
                                <div class="w-full mb-5">
                                    <label for="username" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"> {{ 'Auth.Login.Username' | translate }} <span class="text-red-500">*</span> </label>
                                    <input pInputText id="username" formControlName="username" type="text" [placeholder]="'Auth.Login.EnterUsername' | translate" class="w-full" />
                                    <small *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" class="text-red-600">
                                        {{ 'Auth.Login.UsernameRequired' | translate }}
                                    </small>
                                </div>

                                <div class="w-full mb-5">
                                    <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"> {{ 'Auth.Login.Password' | translate }} <span class="text-red-500">*</span> </label>
                                    <p-password
                                        id="password"
                                        formControlName="password"
                                        [ngClass]="{ 'p-invalid': loginForm.get('password')?.touched && loginForm.get('password')?.invalid }"
                                        [placeholder]="'Auth.Login.EnterPassword' | translate"
                                        [toggleMask]="true"
                                        [fluid]="true"
                                        [feedback]="false"
                                    >
                                    </p-password>
                                    <small *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-red-600">
                                        {{ 'Auth.Login.PasswordRequired' | translate }}
                                    </small>
                                </div>
                                <div class="flex justify-end mb-4">
                                    <button type="button" class="text-sm text-primary-600 hover:underline" (click)="navigateForgotPassword()">
                                        {{ 'Auth.Login.ForgotPassword' | translate }}
                                    </button>
                                </div>
                                <p-button [label]="'Auth.Login.Button' | translate" styleClass="w-full" type="submit" [disabled]="loginForm.invalid"></p-button>
                            </div>
                        </form>
                        <div *ngIf="showStep === 1">
                            <div class="flex text-center items-center justify-center">
                                <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                    {{ 'Auth.Login.OTPLabel' | translate }}
                                </label>
                            </div>
                            <div class="flex justify-center">
                                <p-inputOtp
                                    [length]="6"
                                    [autofocus]="true"
                                    [(ngModel)]="otpValue"
                                    (ngModelChange)="otpValue = otpValue?.trim()"
                                    (onBlur)="otpValue = otpValue?.trim()"
                                    (keypress)="onKeyPress($event)"
                                    (keydown.enter)="verifyOtp()"
                                    inputClass="w-10 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 text-lg text-center rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                                >
                                </p-inputOtp>
                            </div>
                            <p-button [label]="'Auth.Login.VerifyOTP' | translate" styleClass="w-full mt-4" type="submit" (onClick)="verifyOtp()"></p-button>
                        </div>
                        <form [formGroup]="forgotPasswordForm" (ngSubmit)="submitForgotPassword()" *ngIf="showStep === 2">
                            <div>
                                <!-- <div class="w-full mb-5">
                                    <label for="userName" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"> {{ 'Auth.Login.Username' | translate }} <span class="text-red-500">*</span> </label>
                                    <input pInputText id="userName" formControlName="username" type="text" [placeholder]="'Auth.Login.EnterUsername' | translate" class="w-full" />
                                    <small *ngIf="forgotPasswordForm.get('username')?.touched && forgotPasswordForm.get('username')?.invalid" class="text-red-600">
                                        {{ 'Auth.Login.UsernameRequired' | translate }}
                                    </small>
                                </div> -->

                                <div class="w-full mb-5">
                                    <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium mb-2"> {{ 'Auth.ForgotPassword.Email' | translate }} <span class="text-red-500">*</span> </label>
                                    <input
                                        pInputText
                                        id="email"
                                        formControlName="email"
                                        type="text"
                                        [placeholder]="'Auth.ForgotPassword.EnterEmail' | translate"
                                        class="w-full"
                                        [ngClass]="{ 'p-invalid': forgotPasswordForm.get('email')?.touched && forgotPasswordForm.get('email')?.invalid }"
                                    />
                                    <small *ngIf="forgotPasswordForm.get('email')?.touched && forgotPasswordForm.get('email')?.hasError('required')" class="text-red-600">
                                        {{ 'Auth.ForgotPassword.EmailRequired' | translate }}
                                    </small>
                                    <small *ngIf="forgotPasswordForm.get('email')?.touched && forgotPasswordForm.get('email')?.hasError('email')" class="text-red-600">
                                        {{ 'Auth.ForgotPassword.EmailInvalid' | translate }}
                                    </small>
                                </div>
                                <div class=" mb-5">
                                    <app-recapcha-demo (resolved)="onCaptchaResolved($event)"> </app-recapcha-demo>
                                    <small *ngIf="forgotPasswordForm.get('captcha')?.invalid && forgotPasswordForm.get('captcha')?.touched" class="text-red-600">
                                        {{ 'Auth.ForgotPassword.InvalidCaptcha' | translate }}
                                    </small>
                                </div>
                                <p-button [label]="'Auth.ForgotPassword.Button' | translate" styleClass="w-full" type="submit" [disabled]="forgotPasswordForm.invalid"></p-button>
                            </div>
                        </form>
                        <div class="text-[0.75rem] text-[#6b7280] my-6">
                            <div class="flex justify-center text-center">
                                <span>{{ 'Auth.Support.NeedHelp' | translate }}</span>
                            </div>
                            <div class="flex justify-center text-center">
                                <span>{{ 'Auth.Support.ContactAdmin' | translate }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> `,
  styles: [
    `
            ::ng-deep .p-popover-content {
                padding: 8px 4px !important;
            }
        `
  ]
})
export class Login {
  loadingService = inject(LoadingService);
  t = inject(TranslationService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  email: string = '';
  otpValue: string | any = '';
  @ViewChild(RecapchaDemoComponent)
  captcha!: RecapchaDemoComponent;

  captchaToken = '';
  isVerifyCaptcha = false;
  onCaptchaResolved(token: string) {
    const captchaCtrl = this.forgotPasswordForm.get('captcha');
    if (!captchaCtrl) return;
    captchaCtrl.markAsTouched(); // 🔥 QUAN TRỌNG
    if (token) {
      captchaCtrl.setValue(token);
      captchaCtrl.setErrors(null);
    } else {
      captchaCtrl.setValue('');
      captchaCtrl.setErrors({ invalid: true });
    }
  }

  resetCaptcha() {
    const ctrl = this.forgotPasswordForm.get('captcha');
    ctrl?.reset();
    ctrl?.markAsUntouched();
  }
  password: string = '';
  private notification = inject(NotificationService);
  onKeyPress(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
  checked: boolean = false;
  @ViewChild('langPanel') langPanel!: any;
  languages = [
    {
      code: 'en',
      label: 'English',
      flag: 'data:image/png;base64,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'
    },
    {
      code: 'vi',
      label: 'Việt Nam',
      flag: 'data:image/png;base64,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'
    }
  ];
  showStep: number = 0;
  constructor() {
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      this.showStep = +savedStep;
    }

    this.route.queryParams.subscribe((params) => {
      const stepFromUrl = params['step'];
      if (stepFromUrl == null || +stepFromUrl !== this.showStep) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { ...params, step: this.showStep },
          replaceUrl: true
        });
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: 0
    });

    this.forgotPasswordForm = this.formBuilder.group({
      // username: ['', Validators.required],
      captcha: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.showStep = 0;
    localStorage.setItem('currentStep', '0');
    this.changeStep(0);
  }
  backFormLogin() {
    this.showStep = 0;
    this.changeStep(0);
    this.loginForm.reset();
    this.forgotPasswordForm.reset();
    this.otpValue = '';
  }

  navigateForgotPassword() {
    this.showStep = 2;
    this.changeStep(2);
    this.loginForm.reset();
    this.forgotPasswordForm.reset();
  }
  verifyOtp() {
    this.loadingService.show();
    this.authService
      .verifyOtp({
        otp: this.otpValue,
        userName: this.loginForm.value.username ?? ''
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
          if (data.data) {
            this.changeStep(1);
            this.authService.setChangePasswordRequired(!!data.data?.isChangeFirstPassword);
            this.router.navigate(['/']);
            this.getInfoDecodeToken();
          }
        },
        complete: () => { }
      });
  }
  changeStep(next: number) {
    this.showStep = next;
    localStorage.setItem('currentStep', String(this.showStep));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.route.snapshot.queryParams, step: this.showStep },
      queryParamsHandling: 'merge'
    });
  }
  onChangeTranslate(lang: any) {
    this.t.setLanguage(lang.code);
  }
  submitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    cleanForm(this.loginForm);
    this.loadingService.show();
    this.authService
      .login({
        ...this.loginForm.value
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
            if (data?.data?.requireOtp) {
              this.notification.success(this.t.translate('Common.Notification'), this.t.translate('Common.SendOtpSuccess'));
              this.changeStep(1);
              localStorage.removeItem('currentStep');
            } else {
              this.authService.setChangePasswordRequired(!!data.data?.isChangeFirstPassword);
              this.getInfoDecodeToken();
            }

          }
        },
        complete: () => { }
      });
  }
  getInfoDecodeToken() {
    this.authService
      .getInfoDecodeToken()
      .pipe(
        catchError((error) => {
          return of([]);
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data?.code === 200) {
            this.authService.setLocalStorage(data.data);
            this.authService.setChangePasswordRequired(!!data.data?.isChangeFirstPassword);
            this.router.navigate(['/']);
          }
        },
        complete: () => { }
      });
  }
  submitForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    cleanForm(this.forgotPasswordForm);
    this.loadingService.show();
    this.authService
      .forgotPassword({
        email: this.forgotPasswordForm.value.email
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
            this.forgotPasswordForm.reset();
            this.changeStep(0);
          }
        },
        complete: () => { }
      });
  }
}
