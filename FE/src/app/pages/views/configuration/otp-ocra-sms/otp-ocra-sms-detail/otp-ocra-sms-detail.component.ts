import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../../layout/service/auth.service';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { NotificationService } from '../../../../../layout/service/notification.service';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX } from '../../../../../utils/enums/const';
import { cleanForm } from '../../../../../utils/utils';
import { CustomerService } from '../../../../service/customer.service';
import { ConfigOtpService } from './../../../../service/config-otp.service';

@Component({
  selector: 'app-otp-ocra-sms-detail',
  imports: [SHARED_MODULES],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './otp-ocra-sms-detail.component.html',
})
export class OtpOcraSmsDetailComponent {
  configForm!: FormGroup;
  displayTitlePages: string = '';
  userId: string = '';
  confirmUpdateConfig: boolean = false
  action?: ACTION;
  breadcrumbList: any[] = [];
  lengthList: any[] = [
    {
      code: 6,
      name: "6"
    },
    { code: 8, name: '8' },
    { code: 10, name: '10' },
    { code: 12, name: '12' },
  ]
  otpList: any[] = [
    {
      code: 1,
      name: 'TOTP'
    },
    {
      code: 2,
      name: 'OCRA OTP'
    },
    {
      code: 3,
      name: 'SMS OTP'
    }
  ];
  algorithmList: any[] = [
    {
      code: 1,
      name: 'SHA-256'
    },
    {
      code: 2,
      name: 'SHA-384',
      disabled: true
    },
    {
      code: 3,
      name: 'SHA-512',
      disabled: true
    }
  ];
  customerTypeList: any[] = [
    {
      code: 1,
      name: 'Khách hàng cá nhân'
    },
    {
      code: 2,
      name: 'Khách hàng doanh nghiệp'
    }
  ];
  roles = [
    { name: 'Quản trị viên', code: 'REW2A5CJ10MHC869SFTM33T8NN' },
    { name: 'Người dùng', code: 'REW2A5CJ10MHC869SFTM33T8NN' },
    { name: 'Khách', code: 'REW2A5CJ10MHC869SFTM33T8NN' }
  ];
  numberConfirmOTP = [
    {
      code: 1,
      name: '1'
    },
    {
      code: 2,
      name: '2'
    },
    {
      code: 3,
      name: '3'
    },
    {
      code: 4,
      name: '4'
    },
    {
      code: 5,
      name: '5'
    }
  ];
  DataConfigOtp: any

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private configOtpService = inject(ConfigOtpService);
  private cdf = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private noticeService = inject(NotificationService);
  get detailConfigs(): FormArray {
    return this.configForm.get('detailConfigs') as FormArray;
  }
  ngOnInit(): void {
    const a = this.authService.deCodeAccessToken();
    this.userId = a?.['x-user-id'];
    this.formInit();
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (!id) {
      this.action = ACTION.CREATE;
    } else if (url.includes('/detail/')) {
      this.configForm.get('name')?.disable();
      this.action = ACTION.DETAIL;
      this.getDataDetail(id);
      this.configForm?.disable();
    } else {
      // this.configForm.get('name')?.disable();

      this.action = ACTION.EDIT;
      this.getDataDetail(id);
    }
    this.buildBreadcrumb();
    this.setDisplayTitle();
  }
  formInit() {
    this.configForm = this.fb.group({
      requestId: [''],
      name: ['', [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      type: [null, [Validators.required]],
      hashAlgo: [null, [Validators.required]],
      effectiveFrom: [null, [Validators.required]],
      effectivePeriod: [null, [Validators.required]],
      workflow: [null],
      length: [null, [Validators.required, Validators.min(6)]],
      clockSkew: [null, [Validators.required, Validators.max(15)]],
      effectiveTo: [null],
      status: [true],
      maxCheckTimes: [null, [Validators.required]],
      maxResend: [null, [Validators.required]],
      waitTimeResend: [null, [Validators.required]],
      resendLockTime: [null, [Validators.required]],
      userLockTime: [null, [Validators.required]],
      detailConfigs: this.fb.array([]),
      // smsTemplate: [''],
    });
  }

  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, 'Configuration', '/configuration-otp', 'Breadcrumbs');
  }

  onMaxCheckTimesChange(event: any) {
    const value = +event.value;
    this.detailConfigs.clear();
    if (value && value > 0) {
      for (let i = 0; i < value; i++) {
        const isLast = i === value - 1;
        this.detailConfigs.push(this.createDetailGroup(i + 1, null, isLast));
      }
    }
  }
  selectTypeOtpChange(event: any) {
    const value = event?.value;
    const effectivePeriodControl = this.configForm.get('effectivePeriod');
    // const smsTemplateControl = this.configForm.get('smsTemplate');
    const maxResendControl = this.configForm.get('maxResend');
    const waitTimeResendControl = this.configForm.get('waitTimeResend');
    const resendLockTimeControl = this.configForm.get('resendLockTime');
    const userLockTimeControl = this.configForm.get('userLockTime');

    let periodValidators: any[] = [];
    if (value === 1 || value === 2) {
      periodValidators = [Validators.required, Validators.min(30), Validators.max(120)];
    } else if (value === 3) {
      periodValidators = [Validators.required, Validators.min(0), Validators.max(300)];
    }
    effectivePeriodControl?.setValidators(periodValidators);
    effectivePeriodControl?.updateValueAndValidity();

    const isSmsType = value === 3;
    if (isSmsType) {
      // smsTemplateControl?.setValidators([Validators.required, Validators.minLength(5)]);
      // smsTemplateControl?.enable();
      maxResendControl?.setValidators([Validators.required, Validators.min(1)]);
      waitTimeResendControl?.setValidators([Validators.required, Validators.min(1)]);
      resendLockTimeControl?.setValidators([Validators.required, Validators.min(1)]);
      userLockTimeControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // smsTemplateControl?.clearValidators();
      // smsTemplateControl?.reset();
      // smsTemplateControl?.disable();
      maxResendControl?.clearValidators();
      maxResendControl?.reset();
      waitTimeResendControl?.clearValidators();
      waitTimeResendControl?.reset();
      resendLockTimeControl?.clearValidators();
      resendLockTimeControl?.reset();
      userLockTimeControl?.clearValidators();
      userLockTimeControl?.reset();
    }
    // smsTemplateControl?.updateValueAndValidity();
    maxResendControl?.updateValueAndValidity();
    waitTimeResendControl?.updateValueAndValidity();
    resendLockTimeControl?.updateValueAndValidity();
    userLockTimeControl?.updateValueAndValidity();
  }


  getDataDetail(id: string) {
    this.loadingService.show();
    this.configOtpService
      .getConfigOtp(id)
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
            const d = data.data;
            this.configForm.patchValue({
              ...d,
              status: d.status === 1 ? true : false,
              effectiveFrom: d.effectiveFrom ? new Date(d.effectiveFrom) : null,
              effectiveTo: d.effectiveTo ? new Date(d.effectiveTo) : null,
              maxCheckTimes: d.workflow?.length || null
            });
            this.selectTypeOtpChange({ value: d.type });
            const detailArray = this.configForm.get('detailConfigs') as FormArray;
            detailArray.clear();
            if (Array.isArray(d.workflow) && d.workflow.length > 0) {
              d.workflow.forEach((item: any, idx: number) => {
                const isLast = idx === d.workflow.length - 1;
                detailArray.push(this.createDetailGroup(item.order, item, isLast));
              });
            }
            if (this.action === ACTION.DETAIL) {
              detailArray.disable();
            }
            this.cdf.detectChanges();
          }
        },
        error: (err) => { },
        complete: () => { }
      });
  }
  private createDetailGroup(order: number, value?: any, isLast = false): FormGroup {
    const group: any = this.fb.group({
      order: [order],
      wrongAttempts: [value?.wrongAttempts ?? null, Validators.required],
      waitTimeBetweenAttempts: [
        value?.waitTimeBetweenAttempts ?? null,
        [Validators.required, Validators.min(1)],
      ],
    });

    if (!isLast) {
      group.addControl(
        'lockDuration',
        this.fb.control(value?.lockDuration ?? null, [Validators.required, Validators.min(1)])
      );
    }

    return group;
  }
  createConfigOtp() {
    const { detailConfigs, maxCheckTimes, ...body } = this.configForm.getRawValue();
    cleanForm(this.configForm)
    const fromDate = this.configForm.value.effectiveFrom ? moment(this.configForm.value.effectiveFrom).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;
    const toDate = this.configForm.value.effectiveTo ? moment(this.configForm.value.effectiveTo).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;
    const bodyRequest = {
      ...body,
      status: body.status ? 1 : 0,
      workflow: this.configForm?.value?.detailConfigs,
      effectiveFrom: fromDate,
      effectiveTo: toDate
    };
    this.loadingService.show();
    this.configOtpService
      .createConfigOtp({
        ...bodyRequest
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
            this.router.navigate(['/configuration-otp']);
          }
        },

      });
  }
  otpConfirmVisiable: boolean = false
  otpValue: string | any = ''
  onKeyPress(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
  sendOtp() {
    const tokenDecode = this.authService.deCodeAccessToken()
    const userId = tokenDecode?.['x-user-id'];
    this.loadingService.show();
    this.configOtpService
      .getOtpOcraSMS(userId)
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
            this.DataConfigOtp = {
              ...this.DataConfigOtp, ...data?.data,
              userId: userId
            };
            this.otpConfirmVisiable = true
          }
        },
      });
  }

  updateConfigOtp() {
    const { detailConfigs, maxCheckTimes, ...body } = this.configForm.getRawValue();
    cleanForm(this.configForm)
    const fromDate = this.configForm.value.effectiveFrom ? moment(this.configForm.value.effectiveFrom)
      .startOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null
    const toDate = this.configForm.value.effectiveTo ? moment(this.configForm.value.effectiveTo)
      .endOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null
    const bodyRequest = {
      ...body,
      status: body.status ? 1 : 0,
      workflow: this.configForm?.value?.detailConfigs,
      effectiveFrom: fromDate,
      effectiveTo: toDate,
      userId: this.DataConfigOtp.userId,
      otp: this.otpValue,
      sessionId: this.DataConfigOtp?.sessionId
    };
    this.loadingService.show();
    this.configOtpService
      .updateConfigOtp({
        ...bodyRequest
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
            this.router.navigate(['/configuration-otp']);

          }
        },
      });
  }
  onSubmit() {
    // this.otpConfirmVisiable = true
    if (this.configForm.valid) {
      cleanForm(this.configForm);
      if (this.action === ACTION.CREATE) {
        this.createConfigOtp();
      } else {
        this.otpValue = ""
        this.sendOtp()
      }
    } else {
      this.configForm.markAllAsTouched();
    }
  }

  setDisplayTitle() {
    switch (this.action) {
      case ACTION.CREATE:
        this.displayTitlePages = 'TransactionType.PageTitle.Create';
        break;
      case ACTION.EDIT:
        this.displayTitlePages = 'TransactionType.PageTitle.Edit';
        break;
      case ACTION.DETAIL:
      default:
        this.displayTitlePages = 'TransactionType.PageTitle.Detail';
        break;
    }
  }
}
