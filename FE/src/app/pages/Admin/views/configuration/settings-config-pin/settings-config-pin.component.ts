import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { AuthService } from '../../../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX } from '../../../../../utils/enums/const';
import { cleanForm } from '../../../../../utils/utils';
import { ConfigOtpService } from '../../../service/config-otp.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';

@Component({
  selector: 'app-settings-config-pin',
  imports: [SHARED_MODULES],
  templateUrl: './settings-config-pin.component.html',
})
export class SettingsConfigPinComponent {
  pinConfigForm!: FormGroup;
  displayTitlePages: string = '';
  displayConfirmation: boolean = false;
  xacThucVisble: boolean = false;
  confirmUpdateConfig: boolean = false
  formInput: FormInputModel = new FormInputModel();

  action: string = ''
  breadcrumbList = [{ label: 'Cấu hình PIN', routerLink: '/authentication' }];
  lengthList: any[] = [
    {
      code: 4,
      name: "4",
      disabled: true
    }, {
      code: 6,
      name: "6"
    },
    { code: 8, name: '8', disabled: true },
  ]
  storage: any[] = [{
    code: 0,
    name: 'ConfigPin.Storage.Device'
  },
  {
    code: 1,
    name: 'ConfigPin.Storage.Server'
  }]
  numberConfirmOTP = [
    {
      code: 1,
      name: '1'
    },
    {
      code: 2,
      name: '2'
    },

  ];

  numberCount = [
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
    },
    {
      code: 6,
      name: '6'
    },
    {
      code: 7,
      name: '7'
    },
    {
      code: 8,
      name: '8'
    },
    {
      code: 9,
      name: '9'
    }, {
      code: 10,
      name: '10'
    },

  ];
  public fb = inject(FormBuilder);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private configOtpService = inject(ConfigOtpService);
  private cdf = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslationService);
  private noticeService = inject(NotificationService)
  private authService = inject(AuthService)
  public permissionCommon = inject(PermissionCommonService)

  otpConfirmVisiable: boolean = false;
  otpValue: string = ''
  DataConfigPin: any
  permissions: Record<string, boolean> = {};
  permissionsSub?: Subscription;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.formInit();
    this.getDataDetail()
    this.buildBreadcrumb();
    this.setDisplayTitle();
    this.loadFunctionPermission();

  }
  loadFunctionPermission() {
    this.permissionCommon
      .subscribePermissions('PIN_CONFIG', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.permissions = result;
        if (this.permissions['UPDATED']) {
          this.pinConfigForm.enable();
        } else {
          this.pinConfigForm.disable();
        }
      });
  }

  ngOnDestroy() {
    this.permissionsSub?.unsubscribe();
  }










  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, '', '/configuration-pin', 'Breadcrumbs.ConfigurationPin');
  }
  formInit() {
    this.pinConfigForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      storageType: [null, Validators.required],
      effectivePeriod: [null, [Validators.required, Validators.max(12)]],
      length: [null, [Validators.required]],
      workflow: [null],
      effectiveFrom: [null, Validators.required],
      wrongAttempts: [
        null,
        [
          Validators.required,
        ]
      ],

      effectiveTo: [null,],
      // detailConfigs: this.fb.array([]),
      detailConfigs: this.fb.array([], [this.maxTotalWrongAttemptsValidator(10)]),
      maxCheckTimes: [null, [Validators.required]],
      status: [true],
      requestId: [''],
      isDefault: [true],
      accessRemindDays: [null, [Validators.required]],
    });
  }

  maxTotalWrongAttemptsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (!formArray || !formArray.controls) return null;

      const total = formArray.controls.reduce((sum, ctrl) => {
        const value = ctrl.get('wrongAttempts')?.value ?? 0;
        return sum + Number(value);
      }, 0);
      formArray.controls.forEach(ctrl => {
        ctrl.get('wrongAttempts')?.setErrors(null);
      });
      if (total > max) {
        formArray.controls.forEach(ctrl => {
          const wrong = ctrl.get('wrongAttempts');
          const existing = wrong?.errors || {};
          wrong?.setErrors({ ...existing, totalExceeded: true });
        });

        return { totalExceeded: true };
      }

      return null;
    };
  }


  getDataDetail() {
    this.loadingService.show();
    this.configOtpService
      .getConfigPinDefault()
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
            this.pinConfigForm.patchValue({
              ...d,
              status: d.status === 1 ? true : false,
              effectiveFrom: d.effectiveFrom ? new Date(d.effectiveFrom) : null,
              effectiveTo: d.effectiveTo ? new Date(d.effectiveTo) : null,
              maxCheckTimes: d.workflow?.length || null,
              wrongAttempts: d.workflow && d.workflow.length > 0 ? d.workflow[0].wrongAttempts : null
            });
            const detailArray = this.pinConfigForm.get('detailConfigs') as FormArray;
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
          }
        },

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
  get detailConfigs(): FormArray {
    return this.pinConfigForm.get('detailConfigs') as FormArray;
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

  onSubmit() {

    if (this.pinConfigForm.valid) {
      this.otpValue = ''
      this.sendOtPin()
    } else {
      this.pinConfigForm.markAllAsTouched();
    }
  }

  sendOtPin() {
    const tokenDecode = this.authService.deCodeAccessToken()
    const userId = tokenDecode?.['x-user-id'];
    this.loadingService.show();
    this.configOtpService
      .sendOtpPin(userId)
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
            this.DataConfigPin = {
              ...this.DataConfigPin, ...data?.data,
              userId: userId
            };
            this.otpConfirmVisiable = true

          }
        },
      });
  }

  confirmUpdatePin() {
    this.otpConfirmVisiable = false
    this.confirmUpdateConfig = true
  }
  updateConfigPin() {
    const { detailConfigs, maxCheckTimes, wrongAttempts, ...body } = this.pinConfigForm.getRawValue();
    cleanForm(this.pinConfigForm)
    const fromDate = this.pinConfigForm.value.effectiveFrom ? moment(this.pinConfigForm.value.effectiveFrom)
      .startOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null
    const toDate = this.pinConfigForm.value.effectiveTo ? moment(this.pinConfigForm.value.effectiveTo)
      .endOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null

    const bodyRequest = {
      ...body,
      status: body.status ? 1 : 0,
      workflow: this.pinConfigForm?.value?.detailConfigs?.map((item: any) => ({
        ...item,
        wrongAttempts: this.pinConfigForm.value.wrongAttempts
      })),
      effectiveFrom: fromDate,
      effectiveTo: toDate,
      userId: this.DataConfigPin.userId,
      otp: this.otpValue,
      sessionId: this.DataConfigPin?.sessionId
    };
    this.loadingService.show();
    this.configOtpService
      .updateConfigPIN({
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
            this.confirmUpdateConfig = false
            this.otpConfirmVisiable = false
          }
        },
      });
  }
  onConfirmSwitchChange() {
    this.displayConfirmation = false;
  }

  setDisplayTitle() {
    const titleKeys = {
      [ACTION.CREATE]: 'ConfigPin.PageTitle.Create',
      [ACTION.EDIT]: 'ConfigPin.PageTitle.Edit',
      [ACTION.DETAIL]: 'ConfigPin.PageTitle.Detail'
    };
    this.displayTitlePages = this.translate.translate(
      titleKeys[this.action as keyof typeof titleKeys] || titleKeys[ACTION.DETAIL]
    );
  }
}
