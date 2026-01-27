import { NotificationService } from './../../../../../layout/service/notification.service';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { CustomerService } from '../../../../service/customer.service';
import { NOSPECIALCHARREGEX } from '../../../../../utils/enums/const';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import moment from 'moment';
import { catchError, finalize, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { ConfigOtpService } from '../../../../service/config-otp.service';
import { cleanForm } from '../../../../../utils/utils';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';

@Component({
  selector: 'app-pin-detail',
  imports: [SHARED_MODULES],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './pin-detail.component.html',
  styleUrl: './pin-detail.component.scss'
})
export class PinDetailComponent {
  pinConfigForm!: FormGroup;
  displayTitlePages: string = '';
  displayConfirmation: boolean = false;
  xacThucVisble: boolean = false;
  confirmUpdateConfig: boolean = false

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


  ngOnInit(): void {
    this.formInit();
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (!id) {
      this.action = ACTION.CREATE;
    } else if (url.includes('/detail/')) {
      this.pinConfigForm.get('name')?.disable()
      this.action = ACTION.DETAIL;
      this.getDataDetail(id);
      this.pinConfigForm?.disable()
    } else {
      // this.pinConfigForm.get('name')?.disable()
      this.action = ACTION.EDIT;
      this.getDataDetail(id);
    }
    this.buildBreadcrumb();
    this.setDisplayTitle();
  }
  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, '', '/configuration-pin', 'Breadcrumbs.Configuration');
  }
  formInit() {
    this.pinConfigForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      storageType: [null, Validators.required],
      effectivePeriod: [null, [Validators.required, Validators.max(12)]],
      length: [null, [Validators.required]],
      workflow: [null],
      effectiveFrom: [null, Validators.required],
      effectiveTo: [null,],
      // detailConfigs: this.fb.array([]),
      detailConfigs: this.fb.array([], [this.maxTotalWrongAttemptsValidator(10)]),
      maxCheckTimes: [null, [Validators.required]],
      status: [true],
      requestId: ['']
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


  getDataDetail(id: string) {
    this.loadingService.show();
    this.configOtpService
      .getConfigPin(id)
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
      if (this.action === ACTION.CREATE) {
        this.createConfigPin();
      } else {
        this.confirmUpdateConfig = true
      }
    } else {
      this.pinConfigForm.markAllAsTouched();
    }
  }

  createConfigPin() {
    const { detailConfigs, maxCheckTimes, ...body } = this.pinConfigForm.getRawValue();
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
      workflow: this.pinConfigForm?.value?.detailConfigs,
      effectiveFrom: fromDate,
      effectiveTo: toDate,
    }
    this.loadingService.show();
    this.configOtpService
      .createConfigPinOtp({
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
            this.router.navigate(['/configuration-pin']);
          }
        },
      });
  }

  updateConfigPin() {
    const { detailConfigs, maxCheckTimes, ...body } = this.pinConfigForm.getRawValue();
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
      workflow: this.pinConfigForm?.value?.detailConfigs,
      effectiveFrom: fromDate,
      effectiveTo: toDate,
    }
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
            this.router.navigate(['/configuration-pin']);
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
